import { send, receive } from '../utils.js';

// https://www.sitepoint.com/html5-svg-cubic-curves/
//
const template = document.createElement('template');
template.innerHTML = `
  <style> @import "http://localhost:8000/style.css" </style>
  <svg>
    <path d="M100,250 C100,100 400,100 400,250 S700,400 700,250" />
  </svg>
`;

// Pipe connects 2 nodes in a one way connection
// connects 'write' events on node A to 'read' events on node B
export class Pipe extends HTMLElement {

  constructor() {
    super();
    this._id = `${Math.random().toString(16).slice(2)}`;
  }

  connectedCallback() {
    window.pipe = this;
    this.setAttribute('id', this._id);
    this.innerText = "pipe";
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
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

