define(["require", "exports", "bytebuffer"], function (require, exports, ByteBuffer) {
    "use strict";
    var rtds;
    (function (rtds) {
        var RtdsClient = (function () {
            function RtdsClient(server) {
                var _this = this;
                this.sock_ = null;
                this.protocol_ = null;
                this.events_ = {};
                this.pendingOutData_ = [];
                var me = this;
                var sock = this.sock_ = new WebSocket(server, "binary");
                sock.binaryType = "arraybuffer";
                var protocol = this.protocol_ = new RtdsProtocol(function (data) {
                    if (sock.readyState === WebSocket.OPEN)
                        sock.send(data);
                    else
                        me.pendingOutData_.push(data);
                });
                protocol.on("item", function (action, item) {
                    me.raiseEvent("item", action, item);
                });
                sock.onmessage = function (event) {
                    protocol.receive(event.data);
                };
                sock.onopen = function (event) {
                    me.raiseEvent("open");
                    _this.pendingOutData_.forEach(function (data) {
                        sock.send(data);
                    });
                    // console.log("status:",sock.readyState);
                };
                sock.onerror = function () {
                    me.raiseEvent("error");
                };
                sock.onclose = function () {
                    me.raiseEvent("close");
                };
            }
            RtdsClient.prototype.close = function () {
                this.sock_.close();
            };
            RtdsClient.prototype.addParser = function (name, pb) {
                this.protocol_.addParser(name, pb);
            };
            RtdsClient.prototype.setFilter = function (filter) {
                this.protocol_.setFilter(filter);
            };
            RtdsClient.prototype.on = function (type, handler) {
                if (this.events_.hasOwnProperty(type))
                    this.events_[type].push(handler);
                else
                    this.events_[type] = [handler];
            };
            RtdsClient.prototype.un = function (type, handler) {
                if (this.events_.hasOwnProperty(type)) {
                    var handlers = this.events_[type];
                    var idx = handlers.indexOf(handler);
                    handlers.splice(idx, 1);
                }
            };
            RtdsClient.prototype.raiseEvent = function (type) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                if (this.events_.hasOwnProperty(type)) {
                    var handlers = this.events_[type];
                    for (var i = 0; i < handlers.length; i++) {
                        handlers[i].apply(null, args);
                    }
                }
            };
            return RtdsClient;
        }());
        rtds.RtdsClient = RtdsClient;
        var RtdsProtocol = (function () {
            function RtdsProtocol(sender) {
                this._sender = sender;
                this._buffer = new MessageBuffer(this.onMessage.bind(this));
                this._rid = 1;
                this._items = {};
                this._parsers = {};
                this._eventHandlers = {};
            }
            RtdsProtocol.prototype.receive = function (data) {
                this._buffer.write(data);
            };
            RtdsProtocol.prototype.setFilter = function (filter) {
                console.log(this._rid, filter.describe());
                var ab = filter.serialize();
                var header = new ByteBuffer(8, true, true);
                header.writeUint16(8 + ab.byteLength);
                header.writeUint16(0x0103);
                header.writeUint32(this._rid++);
                header.reset();
                this._sender(header.toBuffer());
                this._sender(ab);
            };
            RtdsProtocol.prototype.addParser = function (type, parser) {
                this._parsers[type] = parser;
            };
            RtdsProtocol.prototype.on = function (eventType, handler) {
                if (!(eventType in this._eventHandlers))
                    this._eventHandlers[eventType] = [handler];
                else
                    this._eventHandlers[eventType].push(handler);
            };
            RtdsProtocol.prototype.un = function (eventType, handler) {
                if (eventType in this._eventHandlers) {
                    var handlers = this._eventHandlers[eventType];
                    var idx = handlers.indexOf(handler);
                    if (idx >= 0)
                        handlers.splice(idx, 1);
                }
            };
            RtdsProtocol.prototype.onMessage = function (msg) {
                var size = msg.readUint16();
                var type = msg.readUint16();
                switch (type) {
                    case 0x1004:
                        this.onDataImteMessage(msg);
                        break;
                    case 0x1101: {
                        var rid = msg.readUint32();
                        var code = msg.readInt32();
                        var err = code === 0 ? null : msg.readUTF8String(msg.readUint16(), ByteBuffer.METRICS_BYTES);
                        console.log("RESULT: ", rid, code, err);
                        break;
                    }
                }
            };
            RtdsProtocol.prototype.onDataImteMessage = function (msg) {
                var idx = msg.readUint32();
                var action = msg.readUint8();
                msg.skip(3);
                var type;
                var id;
                var payload;
                if (action === 1 || action === 2)
                    type = msg.readUTF8String(msg.readUint16(), ByteBuffer.METRICS_BYTES);
                id = msg.readUTF8String(msg.readUint16(), ByteBuffer.METRICS_BYTES);
                if (action === 1 || action === 2) {
                    var payloadSize = msg.readUint16();
                    payload = msg.slice(msg.offset, msg.offset + payloadSize);
                }
                if (action === 3) {
                    if (id in this._items) {
                        var item = this._items[id];
                        delete this._items[id];
                        this.fireItemEvent("remove", item);
                    }
                }
                else if (action === 1 || action === 2) {
                    var item = this._parsers[type].decode(payload);
                    if (id in this._items) {
                        this._items[item["Id"]] = item;
                        this.fireItemEvent("update", item);
                    }
                    else {
                        this._items[item["Id"]] = item;
                        this.fireItemEvent("add", item);
                    }
                }
                //if(item["Id"]==="MMSI:412700810")
                //    console.log(item["DynamicTime"],item["Latitude"],item["Longitude"],item["SOG"],item["COG"]);
            };
            RtdsProtocol.prototype.fireItemEvent = function (action, item) {
                if ("item" in this._eventHandlers) {
                    var handlers = this._eventHandlers["item"];
                    for (var i = 0; i < handlers.length; i++)
                        handlers[i].apply(this, [action, item]);
                }
            };
            return RtdsProtocol;
        }());
        rtds.RtdsProtocol = RtdsProtocol;
        var MessageBuffer = (function () {
            function MessageBuffer(callback) {
                this._buffer = new ByteBuffer(0, true, true);
                this._cb = callback;
            }
            MessageBuffer.prototype.write = function (data) {
                this.append(data);
                var offset = 0, remains = this._buffer.offset;
                while (true) {
                    if (remains < 2)
                        break;
                    var size = this._buffer.readUint16(offset);
                    if (size === 0)
                        break;
                    if (remains < size)
                        break;
                    var msg = this._buffer.slice(offset, offset + size);
                    this._cb(msg);
                    offset += size;
                    remains -= size;
                }
                this._buffer.copyTo(this._buffer, 0, offset, this._buffer.offset);
                this._buffer.offset = remains;
            };
            MessageBuffer.prototype.append = function (data) {
                var s = this._buffer.offset + data.byteLength;
                if (s > this._buffer.limit) {
                    var x;
                    if (this._buffer.limit)
                        x = Math.floor((s + 4095) / this._buffer.limit) * this._buffer.limit;
                    else
                        x = 4096;
                    this._buffer.resize(x);
                    this._buffer.limit = x;
                }
                this._buffer.append(data);
            };
            return MessageBuffer;
        }());
    })(rtds || (rtds = {}));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = rtds;
});
