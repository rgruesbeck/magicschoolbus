
export const send = (topic, ...rest) => {
  // create and dispatch event
  const event = new CustomEvent(topic, {
    detail: [...rest]
  });
  this.dispatchEvent(event);
}

export const listen = (topic, callBack) => {
    // create wrapper for callback
    const wrapper = (event) => {
      const { detail } = event;
      callBack(...detail);
    };
    this.addEventListener(topic, wrapper);

    // return unsubscribe handler
    return () => {
      this.removeEventListener(topic, wrapper);
    };
}
