var H52D_Framework;
(function (H52D_Framework) {
    var TEvent = /** @class */ (function () {
        function TEvent() {
            this._handerList = new Array();
        }
        TEvent.prototype.Add = function (handler) {
            this._handerList.push(handler);
        };
        TEvent.prototype.Remove = function (handler) {
            for (var i = 0; i < this._handerList.length; i++) {
                if (handler.caller == this._handerList[i].caller && handler.method == this._handerList[i].method) {
                    this._handerList[i].recover();
                    this._handerList.splice(i, 1);
                    handler.recover();
                    return;
                }
            }
        };
        TEvent.prototype.Exec = function (args) {
            for (var i = 0; i < this._handerList.length; i++) {
                var handler = this._handerList[i];
                if (handler != null) {
                    handler.setTo(handler.caller, handler.method, args, false);
                    handler.run();
                }
            }
        };
        return TEvent;
    }());
    var MAX_STACK_DEEP = 8;
    var Event = /** @class */ (function () {
        function Event() {
        }
        Event.DispatchEvent = function (type, args) {
            if (!(args instanceof Array))
                args = [args];
            var ev = this._eventList[type];
            if (ev != null) {
                try {
                    this._stackDeep++;
                    if (this._stackDeep > MAX_STACK_DEEP)
                        throw new Error("Event stack overflow");
                    ev.Exec(args);
                }
                catch (e) {
                    H52D_Framework.Debugger.LogError(e);
                }
                finally {
                    this._stackDeep--;
                }
            }
        };
        Event.RegistEvent = function (type, handler) {
            var ev = this._eventList[type];
            if (ev == null) {
                ev = new TEvent();
                this._eventList[type] = ev;
            }
            ev.Add(handler);
        };
        Event.RemoveEvent = function (type, handler) {
            var ev = this._eventList[type];
            if (ev != null && handler != null) {
                ev.Remove(handler);
            }
        };
        Event._eventList = {};
        return Event;
    }());
    H52D_Framework.Event = Event;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=Event.js.map