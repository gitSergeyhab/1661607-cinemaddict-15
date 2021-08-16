import FilmCard from '../view/films/film-card.js';
import FilmPopup from '../view/popup/film-popup.js';
import Comment from '../view/popup/comment.js';

import {render, remove, replace} from '../utils/dom-utils.js';
import {RenderPosition} from '../constants.js';


const SELECTOR_POPUP = 'section.film-details';
const CLASS_HIDE_SCROLL = 'hide-overflow';
const ESCAPE = 'Escape';


export default class Film {
  constructor(filmsContainer, changeData) {
    this._filmsContainer = filmsContainer;
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

  init(film) {
    this._film = film;

    const prevFilmCardComponent = this._filmCardComponent;
    const prevFilmPopupComponent = this._filmPopupComponent;

    this._filmCardComponent = new FilmCard(film);

    this._filmPopupComponent = new FilmPopup(film);
    const commentContainer = this._filmPopupComponent.getElement().querySelector('.film-details__comments-list');
    this._renderComments(commentContainer, this._film.comments);

    // навесить обработчики
    this._filmCardComponent.setOpenPopupClickHandler(this._handlerFilmCardClick); // обработчик открытия попапа на карточку
    this._filmCardComponent.setWatchListClickHandler(this._handleWatchListClick);
    this._filmCardComponent.setHistoryClickHandler(this._handleHistoryClick);
    this._filmCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    this._filmPopupComponent.setClosePopupClickHandler(this._handlerClosePopupClick); // обработчик закрытия попапа на попап(кнопку)
    this._filmPopupComponent.setWatchListClickHandler(this._handleWatchListClick);
    this._filmPopupComponent.setHistoryClickHandler(this._handleHistoryClick);
    this._filmPopupComponent.setFavoriteClickHandler(this._handleFavoriteClick);


    if (prevFilmCardComponent === null || prevFilmPopupComponent === null) {//если создается
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

  _renderComment(container, comment) {
    const commentItem = new Comment(comment);
    render(container, commentItem);
  }

  _renderComments(container, comments) {
    comments.forEach((comment) => this._renderComment(container, comment));
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
    render(document.body, this._filmPopupComponent, RenderPosition.AFTER_END);
    render(document.body, this._filmPopupComponent);
  }


  _handlerClosePopupClick() {
    this._closePopup();
  }

  _handlerEscKeyDown(evt) {
    if (evt.key === ESCAPE) {
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
