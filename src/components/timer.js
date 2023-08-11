
class Timer extends HTMLElement {

  constructor() {
    super();
    this._id = `${Math.random().toString(16).slice(2)}`;
    this.intervalId = null;
    this.value = 0;
  }

  connectedCallback() {
    this.setAttribute('id', this._id);

    this.style.padding = '1em';
    this.style.margin = '1em';
    this.style.border = '1px solid red';
    this.style.borderRadius = '2em';
    this.style.cursor = 'pointer';

    this.unsubscribe = bus.listen('timer', (message) => {
      const { id } = message;
      if (id == this._id) { return; }
      console.log(this._id, message);
      clearInterval(this.intervalId);
      this.intervalId = null;
    });

    this.addEventListener('click', this.clickHandler);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.clickHandler);
    this.unsubscribe();
  }

  clickHandler(event) {
    bus && bus.send('timer', { id: this._id, body: 'hello' });
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    } else {
      this.intervalId = setInterval(() => {
        this.value += 1;
        this.innerText = `${this.value}`;
        console.log('tick', this.value);
      }, 1000);
    }
  }
}

export default Timer;
