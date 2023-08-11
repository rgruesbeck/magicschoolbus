/*
 * return unsubscribe method
 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener#matching_event_listeners_for_removal
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/Web_Components
 * https://justinfagnani.com/2019/11/01/how-to-publish-web-components-to-npm/
 *
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/draggable
 * https://www.codingnepalweb.com/draggable-div-element-in-javascript/
 * https://www.codingnepalweb.com/drag-drop-list-or-draggable-list-javascript/
 */


// Node has an input and an output
// writing to the node is done by writing to its input
// when a node is done with its operation it writes to its output
class Node extends HTMLElement {
  constructor() {
    super();
    this._id = `${Math.random().toString(16).slice(2)}`;
    this.inputs = new Map();
    this.outputs = new Set();
  }

  connectedCallback() {
    this.setAttribute('id', this._id);
    this.innerText = "node";
  }

  // add connection
  connect(connection) {
    const { input, output } = connection;
    // add read node
    if (input && !this.inputs.has(input)) {
      this.addEventListener()
    }
    
    // add write node
    if (output) {
      this.outputs.add(output);
    }
  }

  // remove connection
  disconnect(connection) {
    const { input, output } = connection;
    // remove read node
    if (input && this.inputs.has(input)) {
      const unsubscribe = this.inputs.get(input);
      unsubscribe();
      this.inputs.delete(input);
    }
    
    // remove write node
    if (output) {
      this.outputs.delete(output);
    }
  }

  // read incoming message
  read(message) {
    console.log('node: read messages', message);
  }

  // write message
  write(message) {
    console.log('node: write messages', message);
  }
}

const bootstrap = () => {
  customElements.define('c-bus', MessageBus);
  customElements.define('c-timer', Timer);
  customElements.define('c-node', Node);

  const bus = document.createElement('c-bus');
  bus.id = "mainbus";
  document.body.appendChild(bus);

  const node = document.createElement('c-node');
  node.busid ="mainbus";
  document.body.appendChild(node);

  console.log('bootstrap!', bus, node);
}

setTimeout(() => {
  bootstrap();
}, 1000);

