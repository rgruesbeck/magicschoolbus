import { listen, send } from '../utils.js';

// Node has an input and an output
// reads intput with 'read' events
// writes output with 'write' events
export class Node extends HTMLElement {
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
    console.log('node: write', ...data);
    this._write('write', ...data);
  }
}

