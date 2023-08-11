import { listen, send } from '../utils.js';

// Pipe has an input and output
// writing to the pipe is done by writing to its input
// when the pipe is writen too it, then writes to its output
class Pipe extends HTMLElement {

  constructor() {
    super();
    this.id = `${Math.random().toString(16).slice(2)}`;
  }

  connectedCallback() {
    this.setAttribute('id', this._id);
    this.innerText = "pipe";
  }

  connect(conn) {
    const { input, output } = conn;
    const read = listen.bind(input);
    const write = send.bind(output);
    this.close = read('readout', (...data) => {
      write(...data);
    });
  }

  disconnect() {
    this.close && this.close();
  }
}
