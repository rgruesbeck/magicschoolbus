import { send, receive, evalInContext } from '../utils.js';

// unix pipeline history
// https://www.youtube.com/watch?v=bKzonnwoR2I

// sockets, pipes, files
// https://www.youtube.com/watch?v=il4N6KjVQ-s

// custom code
const func = (a, b) => {
  return a + b;
};


// Node has an input and an output
// reads intput with 'read' events
// writes output with 'write' events
export class Node extends HTMLElement {
  constructor() {
    super();
    this._id = `${Math.random().toString(16).slice(2)}`;
    this._write = send.bind(null, this, 'write');
    const read = receive.bind(null, this, 'read');
    this._close = read((...data) => {
      this.read(...data);
    });
  }

  connectedCallback() {
    this.setAttribute('id', this._id);
    this.innerText = "node";
    window.nodes ? window.nodes.push(this) : window.nodes = [this];
    this._js = `(${func})(...this.args)`;
  }

  disconnectedCallback() {
    this._close();
  }

  // read incoming message
  read(...data) {
    console.log(`node-${this._id}: read`, ...data);
    const res = evalInContext(this._js, { args: [...data] });
    this.write(res);
  }

  // write message
  write(...data) {
    console.log(`node-${this._id}: write`, ...data);
    this._write(...data);
  }
}

