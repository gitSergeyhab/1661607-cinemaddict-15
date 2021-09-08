
import NoFilms from '../view/films/no-films.js';
import FilmPresenter from './film.js';

import {render, remove} from '../utils/dom-utils.js';
import {UserAction, UpdateType, Mode, FilterType, EmptyResultMessage, FilmSectionName} from '../constants.js';


const SELECTOR_FILM_CONTAINER = '.films-list__container';
const SHAKE_ANIMATION_TIMEOUT = 5000;


export default class AbstractFilmList {
  constructor(container, filmsModel, commentsModel, api) {
    this._container = container;
    this._api = api;

    this._noFilmComponent = null;
    this._filmBlockComponent = null; // задается в дочерних филмлистах
    this._sortComponent = null;// задается (или нет) в дочерних филмлистах
    this._loadingComponent = null;// задается (или нет) в дочерних филмлистах

    this._filmPresenter = new Map();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._commentsModel = commentsModel;
    this._commentsModel.addObserver(this._handleModelEvent);

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

  _getAllFilms() { // нужен для перерендеринга незакрытого Popup в Extra Blocks
    return this._filmsModel.films;
  }

  _renderFilmCard(film, modeRender) {
    const filmCardContainer = this._filmBlockComponent.getElement().querySelector(SELECTOR_FILM_CONTAINER);
    const filmCardPresenter = new FilmPresenter(filmCardContainer, this._handleViewAction, this._commentsModel, this._api, this._openedFilmId);
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

  _handleViewAction(actionType, updateType, update, film) {
    switch(actionType) {
      case UserAction.UPDATE_FILM:
        this._api.updateFilm(update)
          .then((response) => this._filmsModel.updateFilm(updateType, response));
        break;
      case UserAction.ADD_COMMENT:
        this._api.addComment(update, film.id)
          .then((response) => this._commentsModel.addComment(UpdateType.NONE, response)) // обновление фильмов отстает (число комментов в карточке не всегда успевает обновляться при добавлении/удалении коммента в попапе), поэтому при add/del комментов - вьюхи я решил не перерисовывать ...
          .then(() => this._api.updateFilm(film)
            .then((response) => this._filmsModel.updateFilm(updateType, response))) // ... чтобы не перерисовывать (моргать) два раза, перерисовываю все и сразу после обновленя данных и модели фильмов
          .catch(() => {
            const form = document.querySelector('.film-details__inner');
            form.querySelector('.film-details__comment-input').disabled = false;
            AbstractFilmList.shake(form);
          });
        break;
      case UserAction.DELETE_COMMENT:
        this._api.deleteComment(update)
          .then(() => this._commentsModel.deleteComment(UpdateType.NONE, update))
          .then(() => this._api.updateFilm(film)
            .then((response) => this._filmsModel.updateFilm(updateType, response)))
          .catch(() => {
            const needComment = this._findCommentElementsById(update);
            needComment.deleteBtn.textContent = 'Delete';
            needComment.deleteBtn.disabled = false;
            AbstractFilmList.shake(needComment.commentBlock);
          });
        break;
    }
  }

  _handleModelEvent(updateType) {
    switch(updateType) {
      case UpdateType.PATCH:// favorite, watchList, history
        this._clearFilmList();
        this._renderFilmList();
        break;
      case UpdateType.MINOR:// filter-menu
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

  _changeDisplayStyle() {
    switch (this._name) {
      case FilmSectionName.MOST_COMMENTED:
        this._filmBlockComponent.getElement().style.display = this._getFilms()[0].comments.length ? 'block' : 'none';
        break;
      case FilmSectionName.TOP_RATED:
        this._filmBlockComponent.getElement().style.display = this._getFilms()[0].filmInfo.totalRating ? 'block' : 'none';
    }
  }

  _renderFilmList() {
    this._getFilms().length ? this._changeDisplayStyle() : this._renderNoFilms();

    if (this._openedFilmId[0] !== null) {
      this._renderPopup();
    }
  }

  static shake(element) {
    element.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => element.style.animation = '', SHAKE_ANIMATION_TIMEOUT);
  }
}
