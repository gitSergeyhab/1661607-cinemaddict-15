import {
  createElement
} from '../../utils/dom-utils.js';

import {
  FILM_CONTAINER_SELECTOR
} from '../../constants.js';

const createMainFilmsBlock = () => `
  <section class="films-list">
    <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    <div class="films-list__container">
    </div>
  </section>`;


export default class MainFilmsBlock {
  constructor(name, containerSelector = FILM_CONTAINER_SELECTOR) {
    this._containerSelector = containerSelector;
    this._name = name;
    this._element = null;
  }

  getTemplate() {
    return createMainFilmsBlock(this._name);
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

