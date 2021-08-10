import AbstractWithContainer from '../abstract-with-container.js';
import {FILM_CONTAINER_SELECTOR} from '../../constants.js';

const createExtraFilmsBlock = (name) => `
  <section class="films-list films-list--extra">
    <h2 class="films-list__title">${name}</h2>
    <div class="films-list__container">
    </div>
  </section>`;


export default class ExtraFilmsBlock extends AbstractWithContainer {
  constructor(name, containerSelector = FILM_CONTAINER_SELECTOR) {
    super(containerSelector);
    this._name = name;
  }

  getTemplate() {
    return createExtraFilmsBlock(this._name);
  }
}
