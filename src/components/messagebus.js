// https://developer.mozilla.org/en-US/docs/Web/API/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks

class MessageBus extends HTMLElement {
  constructor() {
    super();
    this.topics = new Map();
  }

  connectedCallback() {
    //window.bus = this;
  }

  disconnectedCallback() {
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

export default MessageBus;
