function EventHandler() {

    this.handler = {};

    this.link = function(cls, func, caller) {
        caller = (typeof caller !== 'undefined') ? caller : null;
        if(typeof(cls) !== 'function' || typeof(func) !== 'function') {
            throw 'link: cls or func is not a function';
        }
        var T = cls.prototype.constructor.name;
        if(!this.handler.hasOwnProperty(T)) {
            this.handler[T] = [];
        }
        this.handler[T].push([func, caller]);
    };

    this.unlink = function(func, caller) {
        caller = (typeof caller !== 'undefined') ? caller : null;
        if(typeof(func) !== 'function') {
            throw 'unlink: func is not a function';
        }
        for(var T in this.handler) {
            for(var i = 0; i < this.handler[T].length; i++) {
                if(this.handler[T][i][0] == func && (!this.handler[T][i][1] || this.handler[T][i][1] == caller)) {
                    this.handler[T].splice(i, 1);
                    return true;
                }
            }
        }
        return false;
    };

    this.dispatch = function(sender, obj) {
        var T = Object.getPrototypeOf(obj).constructor.name;
        if(!this.handler[T]) {
            return 0;
        }
        for(var i = 0; i < this.handler[T].length; i++) {
            if(this.handler[T][i][1]) {
                this.handler[T][i][0].call(this.handler[T][i][1], sender, obj);
            } else {
                this.handler[T][i][0](sender, obj);
            }
        }
        return i;
    };

}

module.exports = EventHandler;