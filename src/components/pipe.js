import { send, receive } from '../utils.js';

// Pipe connects 2 nodes in a one way connection
// connects 'write' events on node A to 'read' events on node B
export class Pipe extends HTMLElement {

  constructor() {
    super();
    this._id = `${Math.random().toString(16).slice(2)}`;
  }

  connectedCallback() {
    this.setAttribute('id', this._id);
    this.innerText = "pipe";
    window.pipe = this;
  }

  disconnectedCallback() {
    this.disconnect();
  }

  connect(conn) {
    const { input, output } = conn;
    const read = receive.bind(null, input, 'write');
    const write = send.bind(null, output, 'read');
    this.close = read((...data) => {
      write(...data);
    });
  }

  disconnect() {
    this.close && this.close();
  }
}

