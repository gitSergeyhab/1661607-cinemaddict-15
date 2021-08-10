import Abstract from './abstract.js';


export default class AbstractWithContainer extends Abstract {
  constructor(containerSelector) {
    super();
    this._containerSelector = containerSelector;
  }

  getContainer() {
    if (this._element) {
      return this._element.querySelector(this._containerSelector);
    }
  }
}
