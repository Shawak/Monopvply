class Event {

    constructor(sender) {
        this.sender = sender;
        this.handlers = [];
    }

    add(func) {
        this.handlers.push(func);
    }

    remove(func) {
        this.handlers.remove(func);
    }

    call() {
        for(let func of this.handlers) {
            func(this.sender);
        }
    }

}

module.exports = Event;