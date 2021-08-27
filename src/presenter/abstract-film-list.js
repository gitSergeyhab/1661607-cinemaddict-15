
import NoFilms from '../view/films/no-films.js';
import FilmPresenter from './film.js';

import {render} from '../utils/dom-utils.js';
import {UserAction, UpdateType} from '../constants.js';

const EmptyResultMessage = {
  ALL: 'There are no movies in our database',
  WATCH_LIST: 'There are no movies to watch now',
  HISTORY: 'There are no watched movies now',
  FAVORITE: 'There are no favorite movies now',
};

const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
  ALL: 'ALL',
};


const SELECTOR_FILM_CONTAINER = '.films-list__container';
const CLASS_HIDE_SCROLL = 'hide-overflow';

export default class AbstractFilmList {
  constructor(container, filmsModel, commentsModel) {
    this._container = container;

    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;

    this._noFilmComponent = new NoFilms(EmptyResultMessage.ALL);
    this._filmBlockComponent = null; // задается в дочерних филмлистах
    this._sortComponent = null;// задается (или нет) в дочерних филмлистах

    this._filmPresenter = new Map();

    this._filmsCount = this._getFilms().length;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._commentsModel.addObserver(this._handleModelEvent);

    this._openedPopup = [null];
  }

  init(){
    render(this._container, this._filmBlockComponent);
    this._renderFilmList();
  }

  _renderPopup() {
    const needFilm = this._getFilms().find((film) => film.id === this._openedPopup[0]);
    if (needFilm) {
      this._renderFilmCard(needFilm, Mode.POPUP);
      // return;
    }
  }

  _getFilms() {
    return this._filmsModel.films;
  }

  _renderFilmCard(film, modeRender) {
    const filmCardContainer = this._filmBlockComponent.getElement().querySelector(SELECTOR_FILM_CONTAINER);
    const filmCardPresenter = new FilmPresenter(filmCardContainer, this._commentsModel, this._handleViewAction, this._openedPopup);
    const alreadyIn = this._filmPresenter.get(film.id);

    if (alreadyIn) { // если фильм уже в мапе презентеров - удалить и отрендерить уже вместе с попапом
      alreadyIn.destroy();
      this._filmPresenter.delete(film.id);
      filmCardPresenter.init(film, Mode.ALL);
    } else {
      filmCardPresenter.init(film, modeRender);
    }

    this._filmPresenter.set(film.id, filmCardPresenter); // (пере)записать FilmPresenter в Мапу
  }

  _clearFilmList() {
    this._filmPresenter.forEach((presenter) => presenter.destroy()); // удаляет все FilmPresenter в Мапе
    this._filmPresenter.clear(); // очищает Мапу
    document.body.classList.remove(CLASS_HIDE_SCROLL); // если перед очисткой был не закрыт попап
  }

  _renderFilmCards(films) {
    films.forEach((film) => this._renderFilmCard(film));
  }

  _renderNoFilms() {
    render(this._filmBlockComponent, this._noFilmComponent);
  }

  _handleViewAction(actionType, updateType, update) {
    switch(actionType) {
      case UserAction.UPDATE_FILM:
        this._filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this._commentsModel.addComment(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this._commentsModel.delComment(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch(updateType) {
      case UpdateType.PATCH:// скорее всего не понадибится
        this._filmPresenter.get(data.id).init(data);
        // обновить фильмы в других filmlist по data.id
        break;
      case UpdateType.MINOR:// favorite, watchList
        this._clearFilmList();
        this._renderFilmList();
        // обновить другие filmlist
        // обновить filters
        break;
      case UpdateType.MAJOR:
        this._clearFilmList();
        this._renderFilmList();
        // обновить другие filmlist
        // обновить filters
        // обновить Profile
        break;
    }
  }

  _renderFilmList() {
    if (!this._filmsCount) {
      this._renderNoFilms();
      return;
    }

    if (this._openedPopup[0] !== null) {
      this._renderPopup();
    }
  }
}
