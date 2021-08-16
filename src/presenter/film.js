import FilmCard from '../view/films/film-card.js';
import FilmPopup from '../view/popup/film-popup.js';
import Comment from '../view/popup/comment.js';

import {render, remove, replace} from '../utils/dom-utils.js';
import {RenderPosition} from '../constants.js';


const SELECTOR_COMMENT_CONTAINER = '.film-details__comments-list';
const SELECTOR_POPUP = 'section.film-details';
const CLASS_HIDE_SCROLL = 'hide-overflow';
const KEY_CODE_ESC = 27;


export default class Film {
  constructor(filmsContainer, footer, changeData) {
    this._filmsContainer = filmsContainer;
    this._footer = footer;
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
  }

  init(film, films) {
    this._films = films;
    this._film = film;

    const prevFilmCardComponent = this._filmCardComponent;
    const prevFilmPopupComponent = this._filmPopupComponent;

    this._filmCardComponent = new FilmCard(film);
    this._filmPopupComponent = new FilmPopup(film);

    // навесить обработчики
    this._filmCardComponent.setOpenPopupClickHandler(this._handlerFilmCardClick); // обработчик открытия попапа на карточку
    this._filmCardComponent.setWatchListClickHandler(this._handleWatchListClick);
    this._filmCardComponent.setHistoryClickHandler(this._handleHistoryClick);
    this._filmCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    this._filmPopupComponent.setClosePopupClickHandler(this._handlerClosePopupClick); // обработчик закрытия попапа на попап(кнопку)
    this._filmPopupComponent.setWatchListClickHandler(this._handleWatchListClick);
    this._filmPopupComponent.setHistoryClickHandler(this._handleHistoryClick);
    this._filmPopupComponent.setFavoriteClickHandler(this._handleFavoriteClick);


    if (prevFilmCardComponent === null || prevFilmPopupComponent === null) {
      render(this._filmsContainer, this._filmCardComponent);
      return 0;
    }

    if (this._filmsContainer.contains(prevFilmCardComponent.getElement())) {
      replace(this._filmCardComponent, prevFilmCardComponent);
    }

    if (document.body.contains(prevFilmPopupComponent.getElement())) {
      replace(this._filmPopupComponent, prevFilmPopupComponent);
    }

    remove(prevFilmCardComponent);
    remove(prevFilmPopupComponent);
  }

  destroy() {
    remove(this._filmCardComponent);
    remove(this._filmPopupComponent);
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
    render(this._footer, this._filmPopupComponent, RenderPosition.AFTER_END);
    const commentContainer = this._filmPopupComponent.getElement().querySelector(SELECTOR_COMMENT_CONTAINER);
    this._renderComments(commentContainer, this._film.comments);
  }

  _renderComment(container, comment) {
    const commentItem = new Comment(comment);
    render(container, commentItem);
  }

  _renderComments(container, comments) {
    comments.forEach((comment) => this._renderComment(container, comment));
  }


  _handlerClosePopupClick() {
    this._closePopup();
  }

  _handlerEscKeyDown(evt) {
    if (evt.keyCode === KEY_CODE_ESC) {
      evt.preventDefault();
      this._closePopup();
    }
  }

  _handlerFilmCardClick() {
    this._renderPopup();
  }

  _handleWatchListClick() {
    this._changeData((
      {...this._film, userDetails: {...this._film.userDetails, watchList: !this._film.userDetails.watchList}}
    ));
  }

  _handleHistoryClick() {
    this._changeData((
      {...this._film, userDetails: {...this._film.userDetails, alreadyWatched: !this._film.userDetails.alreadyWatched}}
    ));
  }

  _handleFavoriteClick() {
    this._changeData((
      {...this._film, userDetails: {...this._film.userDetails, favorite: !this._film.userDetails.favorite}}
    ));
  }
}
