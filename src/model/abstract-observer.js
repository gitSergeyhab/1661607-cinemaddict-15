export default class AbstractObserver {
  constructor() {
    this._observers = new Set();
  }

  addObserver(observer){
    this._observers.add(observer);
  }

  removeObserver(observer) {
    this._observers.delete(observer);
  }

  _notify(evt, payload) {
    this._observers.forEach((observer) => observer(evt, payload));
  }
}
