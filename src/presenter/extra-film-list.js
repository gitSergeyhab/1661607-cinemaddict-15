import AbstractFilmList from './abstract-film-list';
import ExtraFilmsBlock from '../view/films/extra-films-block.js';

import {getTopFilms, getMostCommentedFilms} from '../utils/utils.js';
import {FilmSectionName} from '../constants.js';


export default class ExtraFilmList extends AbstractFilmList {
  constructor(container, filmsModel, commentsModel, api, name) {
    super(container, filmsModel, commentsModel, api);
    this._name = name;

    this._filmBlockComponent = new ExtraFilmsBlock(name);
  }

  _getFilms() {
    switch (this._name) {
      case FilmSectionName.TOP_RATED:
        return getTopFilms(this._filmsModel.films);
      case FilmSectionName.MOST_COMMENTED:
        return getMostCommentedFilms(this._filmsModel.films);
      default:
        return this._filmsModel.films;
    }
  }

  _renderFilmList() {
    super._renderFilmList();
    this._renderFilmCards(this._getFilms());
  }
}
