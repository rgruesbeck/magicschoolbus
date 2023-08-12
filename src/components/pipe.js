import { send, receive } from '../utils.js';

// Pipe connects 2 nodes in a one way connection
// connects 'write' events on node A to 'read' events on node B
class Pipe extends HTMLElement {

  constructor() {
    super();
    this.id = `${Math.random().toString(16).slice(2)}`;
  }

  connectedCallback() {
    this.setAttribute('id', this._id);
    this.innerText = "pipe";
  }

  disconnectedCallback() {
    this.disconnect();
  }

  connect(conn) {
    const { input, output } = conn;
    const read = receive.bind(input);
    const write = send.bind(output);
    this.close = read('write', (...data) => {
      write('read', ...data);
    });
  }

  disconnect() {
    this.close && this.close();
  }
}

