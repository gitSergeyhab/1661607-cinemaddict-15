
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


const SELECTOR_FILM_CONTAINER = '.films-list__container';

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

    this._filmsModel.addObserver(this._handleModelEvent);


  }

  init(){
    // this._films = films.slice();
    render(this._container, this._filmBlockComponent);
    this._renderFilmList();
  }

  _getFilms() {
    return this._filmsModel.films;
  }

  _renderFilmCard(film) {
    const filmCardContainer = this._filmBlockComponent.getElement().querySelector(SELECTOR_FILM_CONTAINER);
    const filmCardPresenter = new FilmPresenter(filmCardContainer, this._commentsModel, this._handleViewAction);
    filmCardPresenter.init(film);
    this._filmPresenter.set(film.id, filmCardPresenter); // добавляет каждый созданный FilmPresenter в Мапу
  }

  _clearFilmList() {
    this._filmPresenter.forEach((presenter) => presenter.destroy()); // удаляет все FilmPresenter в Мапе
    this._filmPresenter.clear(); // очищает Мапу




  }

  _renderFilmCards(films) {
    films.forEach((film) => this._renderFilmCard(film));
  }

  _renderNoFilms() {
    render(this._filmBlockComponent, this._noFilmComponent);
  }

  // _handleFilmChange(updateFilm) {
  //   // this._films = updateItem(this._films, updateFilm); // обновляет данные -> вставляет новый фильм вместо старого

  //   // Здесь будем вызывать обновление модели
  //   this._filmPresenter.get(updateFilm.id).init(updateFilm); //овторно инициализируем FilmPresenter
  // }

  _handleViewAction(actionType, updateType, update) {
    switch(actionType) {
      case UserAction.UPDATE_FILM:
        this._filmsModel.updateFilm(updateType, update);
        break;
      // case UserAction.ADD_COMMENT:
      //   this._filmsModel.updateFilm(updateType, update);
      //   break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch(updateType) {
      case UpdateType.PATCH:
        this._filmPresenter.get(data.id).init(data);
        // обновить другие filmlist
        break;
      case UpdateType.MINOR:
        this._filmPresenter.get(data.id).init(data);
        // обновить другие filmlist
        // обновить filters
        break;
      case UpdateType.MAJOR:
        this._filmPresenter.get(data.id).init(data);
        // обновить другие filmlist
        // обновить filters
        // обновить Profile
        break;
    }
  }

  _renderFilmList() {
    if (!this._filmsCount) {
      this._renderNoFilms();
      return 0; // линтер ругается на пустой return
    }
  }
}
