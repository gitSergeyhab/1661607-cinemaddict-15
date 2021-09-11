import ExtraFilmsBlock from '../view/films/extra-films-block.js';
import ExtraFilmList from './extra-film';
import {FilmSectionName} from '../constants.js';
import {getMostCommentedFilms} from '../utils/utils.js';

export default class MostCommentedFilmList extends ExtraFilmList {
  constructor(container, filmsModel, commentsModel, api) {
    super(container, filmsModel, commentsModel, api);
    this._filmBlockComponent = new ExtraFilmsBlock(FilmSectionName.MOST_COMMENTED);
  }

  _getFilms() {
    return getMostCommentedFilms(this._filmsModel.films);
  }

  _changeDisplayStyle() {
    this._filmBlockComponent.getElement().style.display = this._getFilms()[0].comments.length ? 'block' : 'none';
  }
}
