import { listen, send } from '../utils.js';

// Node has an input and an output
// writing to the node is done by writing to its input
// when a node is done with its operation it writes to its output
class Node extends HTMLElement {
  constructor() {
    super();
    this._id = `${Math.random().toString(16).slice(2)}`;
    this._read = listen.bind(this);
    this._write = send.bind(this);
    this.close = this._read('read', (...data) => {
      this.read(...data);
    });
  }

  connectedCallback() {
    this.setAttribute('id', this._id);
    this.innerText = "node";
  }

  disconnectedCallback() {
    this.close();
  }

  // read incoming message
  read(...data) {
    console.log('node: read', ...data);
  }

  // write message
  write(...data) {
    console.log('node: write messages', message);
    this._write('write', ...data);
  }
}

export default Node;
