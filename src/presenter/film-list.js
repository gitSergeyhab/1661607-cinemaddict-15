import Abstract from '../view/abstract.js';
// import Menu from '../view/menu.js';
import FilmSection from '../view/films/films.js';
import MainFilmsBlock from '../view/films/main-films-block.js';
// import ExtraFilmsBlock from '../view/films/extra-films-block.js';
import BtnShowMore from '../view/films/show-more-btn.js';
import FilmCard from '../view/films/film-card.js';
import FilmPopup from '../view/popup/film-popup.js';
import Comment from '../view/popup/comment.js';
import Sort from '../view/sort.js';
import NoFilms from '../view/films/no-films.js';


import {render} from '../utils/dom-utils.js';
import {RenderPosition} from '../constants.js';

const filmsShownIndexes = {
  first: 0, // индекс 1-го вновь отрисовываемого фильма
  last: 5, // индекс фильма до которого нужно отрисовывать
  plus: 5, // на сколько нужно увеличить предыдущие значения
};


const SELECTOR_FILM_CONTAINER = '.films-list__container';
const SELECTOR_COMMENT_CONTAINER = '.film-details__comments-list';
const SELECTOR_POPUP = 'section.film-details';
const CLASS_HIDE_SCROLL = 'hide-overflow';


const closePopup = (popup) => {
  if (popup instanceof Abstract) {
    popup.getElement().remove();
    popup.removeElement();
  } else {
    popup.remove();
  }
  document.body.classList.remove(CLASS_HIDE_SCROLL);
};

const findOpenPopup = () => document.querySelector(SELECTOR_POPUP); //ищет незакрытый попап

const removePopup = () => findOpenPopup() ? closePopup(findOpenPopup()) : null; //удаляет незакрытый попап


export default class FilmList {
  constructor(container, footer) {
    this._container = container;
    this._footer = footer;

    this._sortComponent = new Sort();
    this._filmBlockComponent = new MainFilmsBlock();

  }

  init(films){
    this._films = films.slice();
    render(this._container, this._filmBlockComponent);
    this._renderFilmList();
  }


  _renderSort() {
    render(this._container, this._sortComponent);
  }

  _renderFilmCard(film) {

    const openPopup = (id) => {
      const selectedFilm = this._films.find((item) => item.id === +id); // находит тыкнутый
      this._renderPopup(selectedFilm);
    };

    const filmCard = new FilmCard(film);
    filmCard.setClickHandler(openPopup); // обработчик открытия попапа на карточку
    render(this._filmBlockComponent.getElement().querySelector(SELECTOR_FILM_CONTAINER), filmCard);
  }


  _renderFilmCards() {
    this._films
      .slice(filmsShownIndexes.first, filmsShownIndexes.last)
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
    removePopup();
    const filmPopup = new FilmPopup(film);
    filmPopup.setClickHandler(() => closePopup(filmPopup)); // обработчик закрытия попапа на попап(кнопку)

    document.body.classList.add(CLASS_HIDE_SCROLL);
    render(this._footer, filmPopup, RenderPosition.AFTER_END);
    const commentContainer = filmPopup.getElement().querySelector(SELECTOR_COMMENT_CONTAINER);
    this._renderComments(commentContainer, film.comments);
  }


  _renderNoFilms() {
    render(this._filmBlockComponent, new NoFilms('ALL'));
  }

  _renderLoadMoreBtn() {
    this._btnShowMoreComponent = new BtnShowMore();
    render(this._filmBlockComponent, this._btnShowMoreComponent, RenderPosition.AFTER_END);

    this._btnShowMoreComponent.setClickHandler(() => { // обработчик добавления фильмов на кнопку
      filmsShownIndexes.first += filmsShownIndexes.plus;
      filmsShownIndexes.last += filmsShownIndexes.plus;

      this._renderFilmCards();

      if (filmsShownIndexes.last >= this._films.length) {
        this._btnShowMoreComponent.getElement().style.display = 'none';
      }
    });

  }

  _renderFilmList() {
    if (!this._films.length) {
      this._renderNoFilms();
      return 0;
    }

    this._renderFilmCards();
    this._renderLoadMoreBtn();
  }
}
