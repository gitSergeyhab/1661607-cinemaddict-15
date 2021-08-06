import {
  createElement
} from '../../utils/dom-utils.js';

const createFooterStatistic = (count) => `<p>${count} movies inside</p>`;

export default class FooterStatistic {
  constructor(count) {
    this._count = count;
    this._element = null;
  }

  getTemplate() {
    return createFooterStatistic(this._count);
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
