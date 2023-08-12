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

import MessageBus from './components/messagebus.js'
import { Pipe } from './components/pipe.js'
import { Node } from './components/node.js'

const bootstrap = () => {
  customElements.define('c-bus', MessageBus);
  customElements.define('c-node', Node);
  customElements.define('c-pipe', Pipe);

  const bus = document.createElement('c-bus');
  bus.id = "mainbus";
  document.body.appendChild(bus);

  const nodea = document.createElement('c-node');
  document.body.appendChild(nodea);

  const nodeb = document.createElement('c-node');
  document.body.appendChild(nodeb);

  const pipe = document.createElement('c-pipe');
  document.body.appendChild(pipe);

  console.log(bus, nodea, nodeb, pipe);
  pipe.connect({ input: nodea, output: nodeb });
  nodea.write(2, 10);
}

setTimeout(() => {
  bootstrap();
}, 1000);

