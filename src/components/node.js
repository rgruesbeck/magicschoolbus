import { send, receive, evalInContext } from '../utils.js';

// styling
// https://css-tricks.com/styling-a-web-component/
// https://dev.to/43081j/using-tailwind-at-run-time-with-web-components-47c

// unix pipeline history
// https://www.youtube.com/watch?v=bKzonnwoR2I

// sockets, pipes, files
// https://www.youtube.com/watch?v=il4N6KjVQ-s

//https://javascript.info/call-apply-decorators

// custom code
const func = (a, b) => {
  return a + b;
};

// https://tailwindcss.com/docs/margin
const template = document.createElement('template');
template.innerHTML = `
  <style> @import "http://localhost:8000/style.css" </style>
  <div class="p-3 m-3 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex flex-col items-center space-x-4">
    <textarea class="p-2 w-full rounded-md bg-white border-solid border-2" placeholder="// code here"></textarea>
    <div class="mt-2 max-w-sm mx-auto w-full h-10 bg-white rounded-md">...</div>
  </div>
`;

// Node has an input and an output
// reads intput with 'read' events
// writes output with 'write' events
export class Node extends HTMLElement {
  constructor() {
    super();
    this._id = `${Math.random().toString(16).slice(2)}`;
    this._js = `(${func})(...this.args)`;
    this._write = send.bind(null, this, 'write');
    const read = receive.bind(null, this, 'read');
    this._close = read((...data) => {
      this.read(...data);
    });
  }

  connectedCallback() {
    this.setAttribute('id', this._id);
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    const input = this.shadowRoot.querySelector("textarea");
    input && input.addEventListener("change", this.handleChange);
  }

  disconnectedCallback() {
    this._close();
  }

  handleChange(event) {
    this._js = `(${event.target.value})(...this.args)`;
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

