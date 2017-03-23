class EventSource {
    private eventHandlers_:{[type:string]:any[]};

    constructor() {
    }

    bind(type:string, handler:Function) {
        if (!this.eventHandlers_) {
            var handlers = {[type]: [handler]};
            Object.defineProperty(this, "eventHandlers_", {
                configurable: false,
                enumerable: false,
                writable: false,
                value: handlers
            });
        } else if (type in this.eventHandlers_) {
            this.eventHandlers_[type].push(handler);
        } else {
            this.eventHandlers_[type] = [handler];
        }
    }

    unbind(type:string, handler:Function) {
        if (!this.eventHandlers_ || !(type in this.eventHandlers_))
            return;
        var handlers = this.eventHandlers_[type];
        var idx = handlers.indexOf(handler);
        if (idx < 0)
            return;
        handlers.splice(idx, 1);
    }

    trigger<T extends EventObject>(event:T|string, ...args:any[]) {
        var evt:EventObject;
        if (typeof(event) === 'string')
            evt = {type: <string>event, target: this};
        else {
            evt = <EventObject>event;
            evt.target = this;
        }
        var type = evt.type;
        if (!this.eventHandlers_ || !(type in this.eventHandlers_))
            return;
        var handlers = this.eventHandlers_[type];
        var args2 = Array.prototype.slice.call(arguments);
        args2[0] = evt;
        for (var i = 0; i < handlers.length; i++) {
            handlers[i].apply(this, args2);
        }
    }
}
interface EventObject {
    type: string;
    target?: any;
}
export default EventSource;
