import Abstract from '../view/abstract.js';
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
    // this._filmPopupComponent = null; // ??? НЕ СТАЛ СОЗДАВАТЬ ПОПАПЫ ДО ИХ ОТКРЫТИЯ, НУЖНО ???

    this._handlerFilmCardClick = this._handlerFilmCardClick.bind(this);
    this._handlerEscKeyDown = this._handlerEscKeyDown.bind(this);

    this._handleWatchListClick = this._handleWatchListClick.bind(this);
    this._handleHistoryClick = this._handleHistoryClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);

  }

  init(film, films) {
    this._films = films;
    this._film = film;

    const prevFilmCardComponent = this._filmCardComponent;
    this._filmCardComponent = new FilmCard(film);

    this._filmCardComponent.setClickHandler(this._handlerFilmCardClick); // обработчик открытия попапа на карточку
    this._filmCardComponent.setWatchListClickHandler(this._handleWatchListClick);
    this._filmCardComponent.setHistoryClickHandler(this._handleHistoryClick);
    this._filmCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if (prevFilmCardComponent === null) {
      render(this._filmsContainer, this._filmCardComponent);
      return 0;
    }

    if (this._filmsContainer.contains(prevFilmCardComponent.getElement())) {
      replace(this._filmCardComponent, prevFilmCardComponent);
    }

    remove(prevFilmCardComponent);
  }

  destroy() {
    remove(this._filmCardComponent);
  }


  _closePopup(popup) {
    popup instanceof Abstract ? remove(popup) : popup.remove();
    document.body.classList.remove(CLASS_HIDE_SCROLL);
    document.removeEventListener('keydown', this._handlerEscKeyDown);
  }

  _findAndClosePopup () {
    const popup = document.querySelector(SELECTOR_POPUP);
    popup ? this._closePopup(popup) : null;
  }

  _renderFilmCards() {
    this._films
      .slice(this._filmsShownIndexes.first, this._filmsShownIndexes.last)
      .forEach((film) => this._renderFilmCard(film));
  }

  _renderPopup(film) {
    this._findAndClosePopup();
    const filmPopup = new FilmPopup(film);


    filmPopup.setWatchListClickHandler(this._handleWatchListClick);

    this._handlerClosePopupClick = () => this._closePopup(filmPopup); // linter вроде не возражает
    filmPopup.setClickHandler(this._handlerClosePopupClick); // обработчик закрытия попапа на попап(кнопку)
    document.addEventListener('keydown', this._handlerEscKeyDown);
    document.body.classList.add(CLASS_HIDE_SCROLL);
    render(this._footer, filmPopup, RenderPosition.AFTER_END);
    const commentContainer = filmPopup.getElement().querySelector(SELECTOR_COMMENT_CONTAINER);
    this._renderComments(commentContainer, film.comments);
  }

  _renderComment(container, comment) {
    const commentItem = new Comment(comment);
    render(container, commentItem);
  }

  _renderComments(container, comments) {
    comments.forEach((comment) => this._renderComment(container, comment));
  }


  _handlerEscKeyDown(evt) {
    if (evt.keyCode === KEY_CODE_ESC) {
      evt.preventDefault();
      this._findAndClosePopup();
    }
  }

  _handlerFilmCardClick(id) {
    const selectedFilm = this._films.find((item) => item.id === +id); // находит тыкнутый
    this._renderPopup(selectedFilm);
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
