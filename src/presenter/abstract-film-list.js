
import NoFilms from '../view/films/no-films.js';
import FilmPresenter from './film.js';
import FilmsModel from '../model/films-model.js';
import Abstract from '../view/abstract.js';

import {render, remove} from '../utils/dom-utils.js';
import {UserAction, UpdateType, Mode, FilterType, EmptyResultMessage} from '../constants.js';


const SELECTOR_FILM_CONTAINER = '.films-list__container';

export default class AbstractFilmList {
  constructor(container, filmsModel, commentsModel, api) {
    this._container = container;
    this._api = api;

    this._noFilmComponent = null;
    this._filmBlockComponent = null;
    this._sortComponent = null;
    this._loadingComponent = null;

    this._filmPresenter = new Map();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._commentsModel = commentsModel;
    this._filmsModel = filmsModel;
    this._filmsModel.addObserver(this._handleModelEvent);

    this._openedFilmId = [null];
  }

  init(){
    render(this._container, this._filmBlockComponent);
    this._renderFilmList();
  }


  _renderPopup() {
    const needFilm = this._getAllFilms().find((film) => film.id === this._openedFilmId[0]);
    if (needFilm) {
      this._renderFilmCard(needFilm, Mode.POPUP);
    }
  }

  _getFilms() {
    return this._filmsModel.films;
  }

  _getAllFilms() {
    return this._filmsModel.films;
  }

  _renderFilmCard(film, modeRender) {
    const filmCardContainer = this._filmBlockComponent.getElement().querySelector(SELECTOR_FILM_CONTAINER);
    const filmCardPresenter = new FilmPresenter(filmCardContainer, this._handleViewAction, this._commentsModel, this._api, this._openedFilmId);
    const alreadyIn = this._filmPresenter.get(film.id);

    if (alreadyIn) {
      alreadyIn.destroy();
      this._filmPresenter.delete(film.id);
      filmCardPresenter.init(film, Mode.ALL);
    } else {
      filmCardPresenter.init(film, modeRender);
    }

    this._filmPresenter.set(film.id, filmCardPresenter);
  }

  _clearFilmList() {
    this._filmPresenter.forEach((presenter) => presenter.destroy());
    this._filmPresenter.clear();
  }

  _renderFilmCards(films) {
    films.forEach((film) => this._renderFilmCard(film));
  }

  _renderNoFilms() {
    this._noFilmComponent = new NoFilms(EmptyResultMessage[FilterType.ALL_MOVIES]);
    render(this._filmBlockComponent, this._noFilmComponent);
  }

  _findCommentElementsById(id) {
    const popupComments= document.querySelectorAll('.film-details__comment-delete');
    const deleteBtn = Array.from(popupComments).find((comment) => comment.dataset.id === id);
    if (deleteBtn) {
      const commentBlock = deleteBtn.closest('.film-details__comment');
      return {deleteBtn, commentBlock};
    }

    throw new Error(`there is not comment with id: ${id}`);
  }

  _renderFilmList() {
    if (!this._getFilms().length) {
      this._renderNoFilms();
    }

    if (this._openedFilmId[0] !== null) {
      this._renderPopup();
    }
  }

  _handleViewAction(actionType, updateType, update, film) {
    switch(actionType) {
      case UserAction.UPDATE_FILM:
        this._api.updateFilm(update)
          .then((response) => this._filmsModel.updateFilm(updateType, response));
        break;
      case UserAction.ADD_COMMENT:
        this._api.addComment(update, film.id)
          .then((response) => {
            this._commentsModel.addComment(response);
            return response.movie;
          })
          .then((movie) => this._filmsModel.updateFilm(updateType, FilmsModel.adaptToClient(movie)))
          .catch(() => {
            const form = document.querySelector('.film-details__inner');
            form.querySelector('.film-details__comment-input').disabled = false;
            Abstract.shake(form);
          });
        break;
      case UserAction.DELETE_COMMENT:
        this._api.deleteComment(update)
          .then(() => this._commentsModel.deleteComment(update))
          .then(() => this._filmsModel.deleteId(updateType, update, film.id))
          .catch(() => {
            const needComment = this._findCommentElementsById(update);
            needComment.deleteBtn.textContent = 'Delete';
            needComment.deleteBtn.disabled = false;
            Abstract.shake(needComment.commentBlock);
          });
        break;
    }
  }

  _handleModelEvent(updateType) {
    switch(updateType) {
      case UpdateType.PATCH:
        this._clearFilmList();
        this._renderFilmList();
        break;
      case UpdateType.MINOR:
        this._clearFilmList(true, true);
        this._renderFilmList();
        break;
      case UpdateType.INIT:
        if (this._loadingComponent) {
          remove(this._loadingComponent);
        }
        this.init();
    }
  }
}
