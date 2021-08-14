import Abstract from '../view/abstract.js';
import FilmCard from '../view/films/film-card.js';
import FilmPopup from '../view/popup/film-popup.js';
import Comment from '../view/popup/comment.js';

import {render} from '../utils/dom-utils.js';
import {RenderPosition} from '../constants.js';


const SELECTOR_FILM_CONTAINER = '.films-list__container';
const SELECTOR_COMMENT_CONTAINER = '.film-details__comments-list';
const SELECTOR_POPUP = 'section.film-details';
const CLASS_HIDE_SCROLL = 'hide-overflow';


export default class Film {
  constructor(filmsContainer, footer) {
    this._filmsContainer = filmsContainer;
    this._footer = footer;

    this._filmComponent = null;
    this._popupComponent = null;
  }

  init(film, films) {
    this._films = films;
    const openPopup = (id) => {
      const selectedFilm = this._films.find((item) => item.id === +id); // находит тыкнутый
      this._renderPopup(selectedFilm);
    };

    const filmCard = new FilmCard(film);
    filmCard.setClickHandler(openPopup); // обработчик открытия попапа на карточку
    render(this._filmsContainer, filmCard);
  }


  _closePopup(popup) {
    if (popup instanceof Abstract) {
      popup.getElement().remove();
      popup.removeElement();
    } else {
      popup.remove();
    }
    document.body.classList.remove(CLASS_HIDE_SCROLL);
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

  _renderComment(container, comment) {
    const commentItem = new Comment(comment);
    render(container, commentItem);
  }

  _renderComments(container, comments) {
    comments.forEach((comment) => this._renderComment(container, comment));
  }

  _renderPopup(film) {
    this._findAndClosePopup();
    const filmPopup = new FilmPopup(film);
    filmPopup.setClickHandler(() => this._closePopup(filmPopup)); // обработчик закрытия попапа на попап(кнопку)

    document.body.classList.add(CLASS_HIDE_SCROLL);
    render(this._footer, filmPopup, RenderPosition.AFTER_END);
    const commentContainer = filmPopup.getElement().querySelector(SELECTOR_COMMENT_CONTAINER);
    this._renderComments(commentContainer, film.comments);
  }
}
