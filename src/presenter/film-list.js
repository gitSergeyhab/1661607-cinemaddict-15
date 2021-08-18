import AbstractFilmList from './abstract-film-list';
import MainFilmsBlock from '../view/films/main-films-block.js';
import BtnShowMore from '../view/films/show-more-btn.js';
import Sort from '../view/sort.js';

import {render} from '../utils/dom-utils.js';
import {sortDate, sortRating} from '../utils/utils';
import {RenderPosition, SortType} from '../constants.js';


const FILM_COUNT_PER_STEP = 5;

export default class ExtraFilmList extends AbstractFilmList {
  constructor(container) {
    super(container);

    this._sortComponent = new Sort();
    this._filmBlockComponent = new MainFilmsBlock();
    this._btnShowMoreComponent = new BtnShowMore();

    this._filmsShown = 0;
    this._sortType = SortType.DEFAULT;

    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleTypeChangeClick = this._handleTypeChangeClick.bind(this);
  }

  init(films){
    this._renderSort();
    super.init(films);
    this._filmsSortDefault = films.slice();
  }

  _renderSort() {
    render(this._container, this._sortComponent);
    this._sortComponent.setSortTypeChangeHandler(this._handleTypeChangeClick);
  }

  _clearFilmList() {
    super._clearFilmList();
    this._filmsShown = 0; //возвращает счетчик в начало
  }

  _hideBtnShowMore() {
    const allFilmsAreShown = this._filmsShown + FILM_COUNT_PER_STEP >= this._films.length;
    this._btnShowMoreComponent.getElement().style.display = allFilmsAreShown ? 'none' : 'block';
  }

  _renderFilmCards() {
    this._films
      .slice(this._filmsShown, this._filmsShown + FILM_COUNT_PER_STEP)
      .forEach((film) => this._renderFilmCard(film));

    this._hideBtnShowMore();
  }

  _renderMainBlock() {
    this._renderFilmCards();
    if (this._filmsShown + FILM_COUNT_PER_STEP < this._films.length) {
      this._renderLoadMoreBtn();
    }
  }

  _sotrFilms(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._films = this._films.sort(sortDate);
        break;
      case SortType.RATING:
        this._films = this._films.sort(sortRating);
        break;
      default:
        this._films = this._filmsSortDefault.slice();
    }
    this._sortType = sortType;
  }

  _handleTypeChangeClick(sortType){
    if (this._sortType === sortType) {
      return;
    }
    this._clearFilmList();
    this._sotrFilms(sortType);
    this._renderMainBlock();
  }

  _handleLoadMoreButtonClick() { // обработчик добавления фильмов на кнопку
    this._filmsShown += FILM_COUNT_PER_STEP;
    this._renderFilmCards();
  }

  _renderLoadMoreBtn() {
    render(this._filmBlockComponent, this._btnShowMoreComponent, RenderPosition.AFTER_END);
    this._btnShowMoreComponent.setClickHandler(this._handleLoadMoreButtonClick);
  }

  _renderFilmList() {
    super._renderFilmList();
    this._renderMainBlock();
  }
}
