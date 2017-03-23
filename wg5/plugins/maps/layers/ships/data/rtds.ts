import * as ByteBuffer from "bytebuffer";
import * as ProtoBuf from "protobufjs";

import exprs from "./exprs";

module rtds {
    export class RtdsClient {
        private sock_:WebSocket = null;
        private protocol_:RtdsProtocol = null;
        private events_:{[type:string]:{(...args:any[]):any}[]} = {};
        private pendingOutData_:any[] = [];

        constructor(server:string) {
            var me = this;

            var sock = this.sock_ = new WebSocket(server, "binary");
            sock.binaryType = "arraybuffer";
            var protocol = this.protocol_ = new RtdsProtocol(function (data) {
                if (sock.readyState === WebSocket.OPEN)
                    sock.send(data);
                else
                    me.pendingOutData_.push(data);
            });

            protocol.on("item", (action, item) => {
                me.raiseEvent("item", action, item)
            });
            sock.onmessage = (event) => {
                protocol.receive(event.data);
            };
            sock.onopen = (event) => {
                me.raiseEvent("open");
                this.pendingOutData_.forEach(function (data) {
                    sock.send(data);
                });

               // console.log("status:",sock.readyState);
            };
            sock.onerror = () => {
                me.raiseEvent("error");
            };
            sock.onclose = () => {
                me.raiseEvent("close");
            };
        }

        close() {
            this.sock_.close();
        }

        addParser(name:string, pb:ProtoBuf.MetaMessage<any>) {
            this.protocol_.addParser(name, pb);
        }

        setFilter(filter:exprs.Expression) {
            this.protocol_.setFilter(filter);
        }

        on(type:string, handler:{(...args:any[]):any}) {
            if (this.events_.hasOwnProperty(type))
                this.events_[type].push(handler);
            else
                this.events_[type] = [handler];
        }

        un(type:string, handler:{(...args:any[]):any}) {
            if (this.events_.hasOwnProperty(type)) {
                var handlers = this.events_[type];
                var idx = handlers.indexOf(handler);
                handlers.splice(idx, 1);
            }
        }

        private raiseEvent(type:string, ...args:any[]) {
            if (this.events_.hasOwnProperty(type)) {
                var handlers = this.events_[type];
                for (var i = 0; i < handlers.length; i++) {
                    handlers[i].apply(null, args);
                }
            }
        }
    }

    export class RtdsProtocol {
        private _sender:(data:ArrayBuffer)=>any;
        private _buffer:MessageBuffer;
        private _rid:number;
        private _items:{[key:string]:ProtoBuf.Message};
        private _parsers:{[key:string]:ProtoBuf.MetaMessage<any>};
        private _eventHandlers:{[key:string]:Array<(...args:Array<any>)=>any>};

        constructor(sender:(data:ArrayBuffer)=>any) {
            this._sender = sender;
            this._buffer = new MessageBuffer(this.onMessage.bind(this));
            this._rid = 1;
            this._items = {};
            this._parsers = {};
            this._eventHandlers = {};
        }

        receive(data:ArrayBuffer):void {
            this._buffer.write(data);
        }

        setFilter(filter:exprs.Expression) {
            console.log(this._rid, filter.describe());
            var ab = filter.serialize();

            var header = new ByteBuffer(8, true, true);
            header.writeUint16(8 + ab.byteLength);
            header.writeUint16(0x0103);
            header.writeUint32(this._rid++);
            header.reset();

            this._sender(header.toBuffer());
            this._sender(ab);
        }

        addParser(type:string, parser:ProtoBuf.MetaMessage<any>) {
            this._parsers[type] = parser;
        }

        on(eventType:string, handler:(...args:Array<any>)=>any) {
            if (!(eventType in this._eventHandlers))
                this._eventHandlers[eventType] = [handler];
            else
                this._eventHandlers[eventType].push(handler);
        }

        un(eventType:string, handler:(...args:Array<any>)=>any) {
            if (eventType in this._eventHandlers) {
                var handlers = this._eventHandlers[eventType];
                var idx = handlers.indexOf(handler);
                if (idx >= 0)
                    handlers.splice(idx, 1);
            }
        }

        private onMessage(msg:ByteBuffer) {
            var size = msg.readUint16();
            var type = msg.readUint16();
            switch (type) {
                case 0x1004:
                    this.onDataImteMessage(msg);
                    break;
                case 0x1101:
                {
                    var rid = msg.readUint32();
                    var code = msg.readInt32();
                    var err = code === 0 ? null : msg.readUTF8String(msg.readUint16(), ByteBuffer.METRICS_BYTES);
                    console.log("RESULT: ", rid, code, err);
                    break;
                }
            }
        }

        private onDataImteMessage(msg:ByteBuffer) {

            var idx = msg.readUint32();
            var action = msg.readUint8();
            msg.skip(3);
            var type:string;
            var id:string;
            var payload:ByteBuffer;
            if (action === 1 || action === 2)
                type = msg.readUTF8String(msg.readUint16(), ByteBuffer.METRICS_BYTES);

            id = msg.readUTF8String(msg.readUint16(), ByteBuffer.METRICS_BYTES);
            if (action === 1 || action === 2) {
                var payloadSize = msg.readUint16();
                payload = msg.slice(msg.offset, msg.offset + payloadSize);
            }

            if (action === 3) {
                if(id in this._items) {
                    let item = this._items[id];
                    delete this._items[id];
                    this.fireItemEvent("remove", item);
                }
            } else if (action === 1 || action === 2) {
                let item = this._parsers[type].decode(payload);
                if(id in this._items) {
                    this._items[item["Id"]] = item;
                    this.fireItemEvent("update", item);
                } else {
                    this._items[item["Id"]] = item;
                    this.fireItemEvent("add", item);
                }
            }

            //if(item["Id"]==="MMSI:412700810")
            //    console.log(item["DynamicTime"],item["Latitude"],item["Longitude"],item["SOG"],item["COG"]);
        }

        private fireItemEvent(action:string, item:any) {
            if ("item" in this._eventHandlers) {
                var handlers = this._eventHandlers["item"];
                for (var i = 0; i < handlers.length; i++)
                    handlers[i].apply(this, [action, item]);
            }
        }
    }

    class MessageBuffer {
        private _buffer:ByteBuffer;
        private _size:number;
        private _cb:(msg:ByteBuffer)=>any;

        constructor(callback:(msg:ByteBuffer)=>any) {
            this._buffer = new ByteBuffer(0, true, true);
            this._cb = callback;
        }

        write(data:ArrayBuffer) {
            this.append(data);
            var offset = 0, remains = this._buffer.offset;
            while (true) {
                if (remains < 2)
                    break;
                var size = this._buffer.readUint16(offset);
                if (remains < size)
                    break;
                var msg = this._buffer.slice(offset, offset + size);
                this._cb(msg);
                offset += size;
                remains -= size;
            }
            this._buffer.copyTo(this._buffer, 0, offset, this._buffer.offset);
            this._buffer.offset = remains;
        }

        private append(data:ArrayBuffer):void {
            var s = this._buffer.offset + data.byteLength;
            if (s > this._buffer.limit) {
                var x:number;
                if (this._buffer.limit)
                    x = Math.floor((s + 4095) / this._buffer.limit) * this._buffer.limit;
                else
                    x = 4096;
                this._buffer.resize(x);
                this._buffer.limit = x;
            }
            this._buffer.append(data);
        }
    }
}
export default rtds;
