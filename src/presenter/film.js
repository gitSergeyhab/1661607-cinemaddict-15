import FilmCard from '../view/films/film-card.js';
import FilmPopup from '../view/popup/film-popup.js';

import {render, remove, replace} from '../utils/dom-utils.js';
import {UserAction, UpdateType} from '../constants.js';



const SELECTOR_POPUP = 'section.film-details';
const CLASS_HIDE_SCROLL = 'hide-overflow';
const ESCAPE = 'Escape';


export default class Film {
  constructor(filmsContainer, commentsModel, changeData) {
    this._filmsContainer = filmsContainer;
    this._commentsModel = commentsModel;
    this._changeData = changeData;

    this._filmCardComponent = null;
    this._filmPopupComponent = null;

    // привязать обработчики
    this._handlerFilmCardClick = this._handlerFilmCardClick.bind(this);
    this._handlerEscKeyDown = this._handlerEscKeyDown.bind(this);
    this._handlerClosePopupClick = this._handlerClosePopupClick.bind(this);

    this._handleWatchListClick = this._handleWatchListClick.bind(this);
    this._handleHistoryClick = this._handleHistoryClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);

    this._handleDeleteComment = this._handleDeleteComment.bind(this);

    this._handleViewActionComment = this._handleViewActionComment.bind(this);
    this._handleModelEventComment = this._handleModelEventComment.bind(this);

    this._commentsModel.addObserver(this._handleModelEventComment);
  }

  init(film) {
    this._film = film;
    this._comments = this._getNeedComments();

    const prevFilmCardComponent = this._filmCardComponent;
    const prevFilmPopupComponent = this._filmPopupComponent;

    this._filmCardComponent = new FilmCard(film);

    this._filmPopupComponent = new FilmPopup(film, this._comments);

    // навесить обработчики
    this._filmCardComponent.setOpenPopupClickHandler(this._handlerFilmCardClick); // обработчик открытия попапа на карточку
    this._filmCardComponent.setWatchListClickHandler(this._handleWatchListClick);
    this._filmCardComponent.setHistoryClickHandler(this._handleHistoryClick);
    this._filmCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    this._filmPopupComponent.setClosePopupClickHandler(this._handlerClosePopupClick); // обработчик закрытия попапа на попап(кнопку)
    this._filmPopupComponent.setWatchListClickHandler(this._handleWatchListClick);
    this._filmPopupComponent.setHistoryClickHandler(this._handleHistoryClick);
    this._filmPopupComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    this._filmPopupComponent.setDeleteCommentHandler(this._handleDeleteComment);

    //если создается
    if (prevFilmCardComponent === null || prevFilmPopupComponent === null) {
      render(this._filmsContainer, this._filmCardComponent);
      return;
    }

    //если изменяется
    replace(this._filmCardComponent, prevFilmCardComponent);
    replace(this._filmPopupComponent, prevFilmPopupComponent);

    remove(prevFilmCardComponent);
    remove(prevFilmPopupComponent);
  }

  destroy() {
    remove(this._filmCardComponent);
    remove(this._filmPopupComponent);
  }

  _getComments() {
    return this._commentsModel.comments;
  }

  _getNeedComments() {
    const comments = this._getComments();
    const needComments = comments.filter((comment) =>  this._film.comments.some((filmComment) => filmComment === comment.id));
    return needComments;
  }

  _closePopup() {
    const popup = document.querySelector(SELECTOR_POPUP);
    if (popup) {
      popup.remove();
      document.body.classList.remove(CLASS_HIDE_SCROLL);
      document.removeEventListener('keydown', this._handlerEscKeyDown);
    }
  }

  _renderPopup() {
    this._closePopup();
    document.addEventListener('keydown', this._handlerEscKeyDown);
    document.body.classList.add(CLASS_HIDE_SCROLL);
    render(document.body, this._filmPopupComponent);
    this._filmPopupComponent.reset(this._film); // нужно сбрасывать стэйт здесь: в _closePopup() сбрасывать нельзя - this.updateElement() не работает - ...
    // ... при повторном рендеринге родителя у this._filmPopupComponent.getElement уже нет, так как сам .getElement был удален при первом _closePopup()
  }

  _handlerClosePopupClick() {
    this._closePopup();
  }

  _handlerEscKeyDown(evt) {
    if (evt.key === ESCAPE) {
      this._closePopup();
    }
  }

  _handlerFilmCardClick() {
    this._renderPopup();
  }

  _handleWatchListClick() {
    this._changeData(UserAction.UPDATE_FILM, UpdateType.MINOR,
      {...this._film, userDetails: {...this._film.userDetails, watchList: !this._film.userDetails.watchList}},
    );
  }

  _handleHistoryClick() {
    this._changeData(UserAction.UPDATE_FILM, UpdateType.MAJOR,
      {...this._film, userDetails: {...this._film.userDetails, alreadyWatched: !this._film.userDetails.alreadyWatched}}
    );
  }

  _handleFavoriteClick() {
    this._changeData(UserAction.UPDATE_FILM, UpdateType.MINOR,
      {...this._film, userDetails: {...this._film.userDetails, favorite: !this._film.userDetails.favorite}}
    );
  }

  _handleDeleteComment(id) {
    console.log(id)
    const needCom = this._getComments().find((comment) => comment.id === id);

    console.log(needCom)
    this._handleViewActionComment(UserAction.DELETE_COMMENT, UpdateType.PATCH,
      {...this._getComments(), userDetails: {...this._film.userDetails, watchList: !this._film.userDetails.watchList}},
    );
  }

  _handleViewActionComment(actionType, updateType, update) {
    switch(actionType) {
      case UserAction.ADD_COMMENT:
        this._commentsModel.addComment(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this._commentsModel.delComment(updateType, update);
        break;
    }
  }

  _handleModelEventComment(){}
}
