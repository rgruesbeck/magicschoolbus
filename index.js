/*
 * return unsubscribe method
 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener#matching_event_listeners_for_removal
 */

class MessageBus extends HTMLElement {
    constructor() {
        super();
        this.topics = new Map();
    }

    connectedCallback() {
        window.bus = this;
    }

    listen(topic, callBack) {
        // create wrapper for callback
        const wrapper = (event) => {
            const { detail } = event;
            callBack(...detail);
        };

        // increment topics
        const increment = (topic, cb) => {
            const t = this.topics.get(topic);
            t ? this.topics.set(topic, t.add(cb)) : this.topics.set(topic, new Set([cb]));
        };

        // decrement topics
        const decrement = (topic, cb) => {
            const t = this.topics.get(topic);
            (t && t.size > 1) ? this.topics.set(topic, t.delete(cb)): this.topics.delete(topic);
        };

        // subscribe handler to the topic and increment topics
        this.addEventListener(topic, wrapper);
        increment(topic, callBack);

        // return unsubscribe handler
        return () => {
            this.removeEventListener(topic, wrapper);
            decrement(topic, callBack);
        };
    }

    send(topic, ...rest) {
        // handle wildcard
        if (topic == "*") {
            // iterate all topics, send message to all topics except wildcard
            for (const currentTopic of this.topics.keys()) {
                if (currentTopic == "*") {
                    continue;
                }
                this.send(currentTopic, ...rest);
            }
            return;
        }

        // handle patterns
        if (topic instanceof RegExp) {
            // iterate all topics, send message to all matching topics
            for (const currentTopic of this.topics.keys()) {
                if (topic.test(currentTopic)) {
                    this.send(currentTopic, ...rest);
                }
            }
            return;
        }

        // create and dispatch event
        const event = new CustomEvent(topic, {
            detail: [...rest]
        });
        this.dispatchEvent(event);
    }
}

class TTimer extends HTMLElement {
    constructor() {
        super();
        this._id = `${Math.random().toString(16).slice(2)}`;
        this.intervalId = null;
        this.value = 0;
    }

    connectedCallback() {
        this.setAttribute('id', this._id);

        this.style.padding = '1em';
        this.style.margin = '1em';
        this.style.border = '1px solid red';
        this.style.borderRadius = '2em';
        this.style.cursor = 'pointer';

        this.unsubscribe = bus.listen('timer', (message) => {
            const { id } = message;
            if (id == this._id) { return; }
            console.log(this._id, message);
            clearInterval(this.intervalId);
            this.intervalId = null;
        });

        this.addEventListener('click', this.clickHandler);
    }

    disconnectedCallback() {
        this.removeEventListener('click', this.clickHandler);
        this.unsubscribe();
    }

    clickHandler(event) {
        bus && bus.send('timer', { id: this._id, body: 'hello' });
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        } else {
            this.intervalId = setInterval(() => {
                this.value += 1;
                this.innerText = `${this.value}`;
                console.log('tick', this.value);
            }, 1000);
        }
    }
}

customElements.define('message-bus', MessageBus);
customElements.define('t-timer', TTimer);

// const ttimer = document.createElement('t-timer');
// document.body.appendChild(ttimer);
