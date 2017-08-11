class Event {

    constructor(sender) {
        this.sender = sender;
        this.handlers = [];
    }

    add(func, caller) {
        this.handlers.push([func, caller]);
    }

    remove(func, caller) {
        let index = this.handlers.find(x => x[0] == func && x[1] == caller);
        this.handlers.splice(index, 1);
    }

    dispatch() {
        for (let handler of this.handlers) {
            handler[0].call(handler[1], this.sender);
        }
    }

}

module.exports = Event;