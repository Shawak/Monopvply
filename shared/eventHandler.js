function EventHandler() {

    this.handler = [];

    this.link = function(cls, func) {
        if(typeof(cls) !== 'function' || typeof(func) !== 'function') {
            throw 'link: cls or func is not a function';
        }
        var T = Object.getPrototypeOf(new cls());
        if(!this.handler[T]) {
            this.handler[T] = [];
        }
        this.handler[T].push(func);
    };

    this.unlink = function(func) {
        if(typeof(func) !== 'function') {
            throw 'unlink: func is not a function';
        }
        for(var T in this.handler) {
            for(var i = 0; i < this.handler[T].length; i++) {
                if(this.handler[T][i] == func) {
                    this.handler[T].splice(i, 1);
                    return true;
                }
            }
        }
        return false;
    };

    this.dispatch = function(sender, obj) {
        var T = Object.getPrototypeOf(obj);
        if(!this.handler[T]) {
            return 0;
        }
        for(var i = 0; i < this.handler[T].length; i++) {
            this.handler[T][i](sender, obj);
        }
        return i;
    };

}

module.exports = EventHandler;