
import NoFilms from '../view/films/no-films.js';
import FilmPresenter from './film.js';

import {render, remove} from '../utils/dom-utils.js';
import {UserAction, UpdateType, Mode, FilterType, EmptyResultMessage} from '../constants.js';


const SELECTOR_FILM_CONTAINER = '.films-list__container';
const CLASS_HIDE_SCROLL = 'hide-overflow';


export default class AbstractFilmList {
  constructor(container, filmsModel, commentsModel, api) {
    this._container = container;
    this._api = api;

    this._noFilmComponent = null;
    this._filmBlockComponent = null; // задается в дочерних филмлистах
    this._sortComponent = null;// задается (или нет) в дочерних филмлистах
    this._loadingComponent = null;


    this._filmPresenter = new Map();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filmsModel = filmsModel;
    this._filmsModel.addObserver(this._handleModelEvent);

    this._commentsModel = commentsModel;
    this._commentsModel.addObserver(this._handleModelEvent);

    this._openedPopup = [null];
  }

  init(){
    render(this._container, this._filmBlockComponent);
    this._renderFilmList();
  }

  _renderPopup() {
    const needFilm = this._getAllFilms().find((film) => film.id === this._openedPopup[0]);
    if (needFilm) {
      this._renderFilmCard(needFilm, Mode.POPUP);
    }
  }

  _getFilms() {
    return this._filmsModel.films;
  }

  _getAllFilms() { // нужен для перерендеринга незакрытого Popup в Extra Blocks
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
    this._noFilmComponent = new NoFilms(EmptyResultMessage[FilterType.ALL_MOVIES]);
    render(this._filmBlockComponent, this._noFilmComponent);
  }

  _handleViewAction(actionType, updateType, update) {
    switch(actionType) {
      case UserAction.UPDATE_FILM:
        this._api.updateFilm(update)
          .then((response) => this._filmsModel.updateFilm(updateType, response));
        break;
      case UserAction.ADD_COMMENT:
        this._commentsModel.addComment(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this._commentsModel.delComment(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType) {
    switch(updateType) {
      case UpdateType.PATCH:// favorite, watchList, comments
        this._clearFilmList();
        this._renderFilmList();
        break;
      case UpdateType.MINOR:// filter-menu
        this._clearFilmList(true, true);
        this._renderFilmList();
        break;
      case UpdateType.MAJOR: //history
        this._clearFilmList();
        this._renderFilmList();
        break;
      case UpdateType.INIT:
        this._loadingComponent ? remove(this._loadingComponent) : null;
        this.init();
    }
  }

  _renderFilmList() {
    if (!this._getFilms().length) {
      this._renderNoFilms();
    }

    if (this._openedPopup[0] !== null) {
      this._renderPopup();
    }
  }
}
