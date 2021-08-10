import AbstractWithContainer from '../abstract-with-container.js';
import {FILM_CONTAINER_SELECTOR} from '../../constants.js';


const createMainFilmsBlock = () => `
  <section class="films-list">
    <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    <div class="films-list__container">
    </div>
  </section>`;


export default class MainFilmsBlock extends AbstractWithContainer {
  constructor(name, containerSelector = FILM_CONTAINER_SELECTOR) {
    super(containerSelector);
    this._name = name;
  }

  getTemplate() {
    return createMainFilmsBlock(this._name);
  }
}
