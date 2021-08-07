import {createElement} from '../../utils/dom-utils.js';


export default class BtnShowMore {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return '<button class="films-list__show-more">Show more</button>';
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
}
