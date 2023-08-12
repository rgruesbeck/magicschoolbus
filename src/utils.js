
export const send = (node, topic, ...rest) => {
  // create and dispatch event
  const event = new CustomEvent(topic, {
    detail: [...rest]
  });
  node.dispatchEvent(event);
}

export const receive = (node, topic, callBack) => {
    // create wrapper for callback
    const wrapper = (event) => {
      const { detail } = event;
      callBack(...detail);
    };
    node.addEventListener(topic, wrapper);

    // return unsubscribe handler
    return () => {
      node.removeEventListener(topic, wrapper);
    };
}

// eval in a context
// https://stackoverflow.com/questions/8403108/calling-eval-in-particular-context
export const evalInContext = (js, context) => {
  return function() { return eval(js); }.call(context);
}
