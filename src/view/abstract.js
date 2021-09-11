import {createElement} from '../utils/dom-utils';
import {getNotImplementedError} from '../utils/utils.js';

const SHAKE_ANIMATION_TIMEOUT = 3000;


export default class Abstract {
  constructor () {
    if (new.target === Abstract) {
      throw new Error('Can\'t instantiate Abstract, only concrete one.');
    }
    this._callback = {};
    this._element = null;
  }

  getTemplate() {
    getNotImplementedError('getTemplate');
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }


  static shake(element) {
    element.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => element.style.animation = '', SHAKE_ANIMATION_TIMEOUT);
  }
}
