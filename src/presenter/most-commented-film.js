import AbstractFilmList from './abstract-film-list';
import ExtraFilmsBlock from '../view/films/extra-films-block.js';
import {FilmSectionName} from '../constants.js';
import {getMostCommentedFilms} from '../utils/utils.js';

export default class MostCommentedFilmList extends AbstractFilmList {
  constructor(container, filmsModel, commentsModel, api) {
    super(container, filmsModel, commentsModel, api);
    this._filmBlockComponent = new ExtraFilmsBlock(FilmSectionName.TOP_RATED);
  }

  _getFilms() {
    return getMostCommentedFilms(this._filmsModel.films);
  }

  _changeDisplayStyle() {
    this._filmBlockComponent.getElement().style.display = this._getFilms()[0].comments.length ? 'block' : 'none';
  }

  _renderFilmList() {
    this._getFilms().length ? this._changeDisplayStyle() : this._renderNoFilms();
    if (this._openedFilmId[0] !== null) {
      this._renderPopup();
    }

    this._renderFilmCards(this._getFilms());
  }
}
