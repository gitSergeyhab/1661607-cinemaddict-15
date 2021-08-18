import AbstractFilmList from './abstract-film-list';
import ExtraFilmsBlock from '../view/films/extra-films-block.js';


export default class ExtraFilmList extends AbstractFilmList {
  constructor(container, name) {
    super(container);

    this._filmBlockComponent = new ExtraFilmsBlock(name);
  }

  _renderFilmList() {
    super._renderFilmList();
    this._renderFilmCards();
  }
}
