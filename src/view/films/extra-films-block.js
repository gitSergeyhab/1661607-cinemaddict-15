import {
  createElement
} from '../../utils/dom-utils.js';

import {
  FILM_CONTAINER_SELECTOR
} from '../../constants.js';

const createExtraFilmsBlock = (name) => `
  <section class="films-list films-list--extra">
    <h2 class="films-list__title">${name}</h2>
    <div class="films-list__container">
    </div>
  </section>`;


export default class ExtraFilmsBlock {
  constructor(name, containerSelector = FILM_CONTAINER_SELECTOR) {
    this._containerSelector = containerSelector;
    this._name = name;
    this._element = null;
  }

  getTemplate() {
    return createExtraFilmsBlock(this._name);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  getContainer() {
    if (this._element) {
      return this._element.querySelector(this._containerSelector);
    }
  }

  removeElement() {
    this._element = null;
  }
}
