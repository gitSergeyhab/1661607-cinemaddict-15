import abstractfilmList from './abstract-film-list';
import ExtraFilmsBlock from '../view/films/extra-films-block.js';


export default class ExtraFilmList extends abstractfilmList {
  constructor(container, name) {
    super(container);

    this._filmBlockComponent = new ExtraFilmsBlock(name);
  }
}
