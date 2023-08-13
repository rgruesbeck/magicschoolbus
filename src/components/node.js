import { send, receive, evalInContext } from '../utils.js';

// styling
// https://lit.dev/docs/components/lifecycle/
// https://css-tricks.com/styling-a-web-component/
// https://dev.to/43081j/using-tailwind-at-run-time-with-web-components-47c
// https://wiredjs.com/

// unix pipeline history
// https://www.youtube.com/watch?v=bKzonnwoR2I

// sockets, pipes, files
// https://www.youtube.com/watch?v=il4N6KjVQ-s

// https://www.codingnepalweb.com/draggable-div-element-in-javascript/
// https://javascript.info/call-apply-decorators
//
// https://javascript.info/mixins

// custom code
const func = (a, b) => {
  return a + b;
};

// https://heroicons.com/
// https://tailwindcss.com/docs/margin
const template = document.createElement('template');
template.innerHTML = `
  <style> @import "http://localhost:8000/style.css" </style>
  <div class="m-3 max-w-sm bg-white rounded-xl shadow-lg flex flex-col divide-y divide-solid">
    <div class="p-3 w-full flex">
      <span id="name" class="italic cursor-grab flex-auto">Name</span>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 cursor-pointer flex-none">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
      </svg>
    </div>
    <div class="p-3 w-full">
      <textarea class="p-3 w-full rounded-md bg-white border-solid border-2" placeholder="// code here"></textarea>
    </div>
    <div id="console" class="p-3 w-full text-slate-500 rounded-b-xl">..</div>
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

    // update js
    const input = this.shadowRoot.querySelector("textarea");
    input && input.addEventListener("change", this.handleChange);

    // console
    this.console = this.shadowRoot.getElementById("console");

    // name
    this.name = this.shadowRoot.getElementById("name");
    this.name.innerText = 'javascript'
  }

  disconnectedCallback() {
    this._close();
  }

  handleChange(event) {
    this._js = `(${event.target.value})(...this.args)`;
    console.log('handleChange', this._js);
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
    this.console.innerText = `${data}`;
    this._write(...data);
  }
}

