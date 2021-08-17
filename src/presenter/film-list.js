import AbstractFilmList from './abstract-film-list';
import MainFilmsBlock from '../view/films/main-films-block.js';
import BtnShowMore from '../view/films/show-more-btn.js';
import Sort from '../view/sort.js';

import {render} from '../utils/dom-utils.js';
import {RenderPosition} from '../constants.js';


const FILM_COUNT_PER_STEP = 5;

export default class ExtraFilmList extends AbstractFilmList {
  constructor(container) {
    super(container);

    this._sortComponent = new Sort();
    this._filmBlockComponent = new MainFilmsBlock();
    this._btnShowMoreComponent = new BtnShowMore();

    this._alreadyDrawnFilm = 0;

    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
  }

  _renderSort() {
    render(this._container, this._sortComponent);
  }

  _clearFilmList() {
    super._clearFilmList();
    this._alreadyDrawnFilm = FILM_COUNT_PER_STEP; //возвращает счетчик в начало
  }

  _renderFilmCards() {
    this._films
      .slice(this._alreadyDrawnFilm, this._alreadyDrawnFilm + FILM_COUNT_PER_STEP)
      .forEach((film) => this._renderFilmCard(film));
  }

  _renderMainBlock() {
    this._renderFilmCards();
    if (this._alreadyDrawnFilm + FILM_COUNT_PER_STEP < this._films.length) {
      this._renderLoadMoreBtn();
    }
  }


  _handleLoadMoreButtonClick() { // обработчик добавления фильмов на кнопку
    this._alreadyDrawnFilm += FILM_COUNT_PER_STEP;

    this._renderFilmCards();

    if (this._alreadyDrawnFilm + FILM_COUNT_PER_STEP >= this._films.length) {
      this._btnShowMoreComponent.getElement().style.display = 'none';
    }
  }

  _renderLoadMoreBtn() {
    render(this._filmBlockComponent, this._btnShowMoreComponent, RenderPosition.AFTER_END);
    this._btnShowMoreComponent.setClickHandler(this._handleLoadMoreButtonClick);
  }

  _renderFilmList() { //"Повторяет метод родительского класса" - он не повторяет - в родителе вызывается this._renderFilmCards() а тут this._renderMainBlock();
    if (!this._films.length) {
      this._renderNoFilms();
      return;
    }

    this._renderMainBlock();
  }
}
