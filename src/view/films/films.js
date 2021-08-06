import {
  createElement
} from '../../utils/dom-utils.js';


const createFilmsSections = () => '<section class="films"></section>';

export default class FilmSection {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    // return '<section class="films"></section>'; // ??? а ТАК нельзя ???
    return createFilmsSections();
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
