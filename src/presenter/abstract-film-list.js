
import NoFilms from '../view/films/no-films.js';
import FilmPresenter from './film.js';

import {render, remove} from '../utils/dom-utils.js';
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


    this._filmPresenter = new Map();
    this._filmBlockComponent = null;

    this._noFilmComponent = new NoFilms(EmptyResultMessage.ALL);
    this._sortComponent = null;

    this._filmsCount = this._getFilms().length;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    // this._handleModeChange = this._handleModeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);

    this._openedPopup = [null];


  }

  init(){
    // this._films = films.slice();
    render(this._container, this._filmBlockComponent);
    this._renderFilmList();
  }

  _renderPopup() {
    const needFilm = this._getFilms().find((film) => film.id === this._openedPopup[0]);
    if (needFilm) {
      this._renderFilmCard(needFilm, Mode.POPUP);
      return;
    }
    console.log('no film')
  }

  _getFilms() {
    return this._filmsModel.films;
  }

  _renderFilmCard(film, modeRender) {
    const filmCardContainer = this._filmBlockComponent.getElement().querySelector(SELECTOR_FILM_CONTAINER);
    const filmCardPresenter = new FilmPresenter(filmCardContainer, this._commentsModel, this._handleViewAction, this._openedPopup);
    const alreadyIn = this._filmPresenter.get(film.id);

    if (alreadyIn) {
      alreadyIn.destroy();
      this._filmPresenter.delete(film.id);
      filmCardPresenter.init(film, Mode.ALL);
    } else {
      filmCardPresenter.init(film, modeRender);
    }

    this._filmPresenter.set(film.id, filmCardPresenter); // добавляет каждый созданный FilmPresenter в Мапу
    // console.log(this._filmPresenter.get(film.id))
    // console.log(this._filmPresenter)
  }

  _clearFilmList() {
    this._filmPresenter.forEach((presenter) => presenter.destroy()); // удаляет все FilmPresenter в Мапе
    this._filmPresenter.clear(); // очищает Мапу
    document.body.classList.remove(CLASS_HIDE_SCROLL); // если перед очисткой был открыт попап
  }

  _renderFilmCards(films) {
    films.forEach((film) => this._renderFilmCard(film));
    // console.log(this._filmPresenter)
  }

  _renderNoFilms() {
    render(this._filmBlockComponent, this._noFilmComponent);
  }

  // _handleFilmChange(updateFilm) {
  //   // this._films = updateItem(this._films, updateFilm); // обновляет данные -> вставляет новый фильм вместо старого

  //   // Здесь будем вызывать обновление модели
  //   this._filmPresenter.get(updateFilm.id).init(updateFilm); //овторно инициализируем FilmPresenter
  // }

  // _handleModeChange() {
  //   this._filmPresenter.forEach((presenter) => presenter.resetView());
  // }

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

  // _handleModelEvent(updateType, data) {
  //   switch(updateType) {
  //     case UpdateType.PATCH:
  //       this._filmPresenter.get(data.id).init(data);
  //       // обновить другие filmlist
  //       break;
  //     case UpdateType.MINOR:
  //       this._filmPresenter.get(data.id).init(data);
  //       // обновить другие filmlist
  //       // обновить filters
  //       break;
  //     case UpdateType.MAJOR:
  //       this._filmPresenter.get(data.id).init(data);
  //       // обновить другие filmlist
  //       // обновить filters
  //       // обновить Profile
  //       break;
  //   }
  // }

  _handleModelEvent(updateType, data) {
    // console.log(this._openedPopup)
    switch(updateType) {
      case UpdateType.PATCH:// комментарии
        this._filmPresenter.get(data.id).init(data);
        // обновить фильмы в других filmlist по data.id
        break;
      case UpdateType.MINOR:// favorite, watchList
        // this._filmPresenter.get(data.id).init(data);
        this._clearFilmList();
        this._renderFilmList();
        // обновить другие filmlist
        // обновить filters
        // восстановить открытый попап
        break;
      case UpdateType.MAJOR:
        // this._filmPresenter.get(data.id).init(data);
        this._clearFilmList();
        this._renderFilmList();
        // обновить другие filmlist
        // обновить filters
        // обновить Profile
        // восстановить открытый попап
        break;
    }
  }

  _renderFilmList() {
    if (!this._filmsCount) {
      this._renderNoFilms();
      return 0; // линтер ругается на пустой return
    }

    if (this._openedPopup[0] !== null) {
      this._renderPopup();
    }
  }
}
