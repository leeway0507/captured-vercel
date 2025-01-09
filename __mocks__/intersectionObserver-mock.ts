
export default class IntersectionObserver {
    callback: CallableFunction
    elements: Array<any>

  constructor(callback:CallableFunction) {

    this.callback = callback;
    this.elements = [];
  }

  observe(element:any) {
    this.elements.push(element);
    // Immediately invoke the callback with the element intersecting
    this.callback([{ isIntersecting: true, target: element }]);
  }

  unobserve(element:any) {
    this.elements = this.elements.filter(el => el !== element);
  }

  disconnect() {
    this.elements = [];
  }
}

Object.defineProperty(global, 'IntersectionObserver', {
  value: IntersectionObserver,
  writable: true
});
