import AbstractFilmList from './abstract-film-list';
import MainFilmsBlock from '../view/films/main-films-block.js';
import BtnShowMore from '../view/films/show-more-btn.js';
import Sort from '../view/sort.js';

import {render, remove} from '../utils/dom-utils.js';
import {sortDate, sortRating} from '../utils/utils';
import {RenderPosition, SortType} from '../constants.js';


const FILM_COUNT_PER_STEP = 5;


export default class ExtraFilmList extends AbstractFilmList {
  constructor(container, filmsModel, commentsModel) {
    super(container, filmsModel, commentsModel);

    this._filmBlockComponent = new MainFilmsBlock();
    this._btnShowMoreComponent = new BtnShowMore();


    this._filmsShown = FILM_COUNT_PER_STEP;
    this._sortType = SortType.DEFAULT;

    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(){
    super.init();
  }


  _getFilms() {
    switch (this._sortType) {
      case SortType.DATE:
        return this._filmsModel.films.slice().sort(sortDate);
      case SortType.RATING:
        return this._filmsModel.films.slice().sort(sortRating);
    }
    return super._getFilms();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new Sort(this._sortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._container, this._sortComponent, RenderPosition.BEFORE_BEGIN);
  }

  _clearFilmList(resetRenderedTaskCount = false, resetSortType = false) {
    super._clearFilmList();

    remove(this._sortComponent); // ?
    remove(this._noFilmComponent);
    remove(this._btnShowMoreComponent);

    if (resetSortType) {
      this._sortType = SortType.DEFAULT;
    }

    if (resetRenderedTaskCount) {
      this._filmsShown = FILM_COUNT_PER_STEP;
    } else {
      this._filmsShown = Math.min(this._filmsCount, this._filmsShown);
    }
  }

  _hideBtnShowMore() {
    const allFilmsAreShown = this._filmsShown >= this._filmsCount;
    this._btnShowMoreComponent.getElement().style.display = allFilmsAreShown ? 'none' : 'block';
  }

  _renderFilmCards(films) {
    const filmsForRender = films.slice(this._filmsShown - FILM_COUNT_PER_STEP, this._filmsShown);
    super._renderFilmCards(filmsForRender);
    this._hideBtnShowMore();
  }

  _renderMainBlock() {
    const filmsForRender = this._getFilms().slice(0, this._filmsShown);
    super._renderFilmCards(filmsForRender);
    this._renderSort();// ?
    if (this._filmsShown < this._filmsCount) {
      this._renderLoadMoreBtn();
    }
  }

  _renderLoadMoreBtn() {
    render(this._filmBlockComponent, this._btnShowMoreComponent, RenderPosition.AFTER_END);
    this._btnShowMoreComponent.setClickHandler(this._handleLoadMoreButtonClick);
  }

  _renderFilmList() {
    super._renderFilmList();
    this._renderMainBlock();
  }

  _handleSortTypeChange(sortType){
    if (this._sortType === sortType) {
      return;
    }

    this._sortType = sortType;
    this._clearFilmList();
    this._renderMainBlock();
  }

  _handleLoadMoreButtonClick() {
    this._filmsShown += FILM_COUNT_PER_STEP;
    this._renderFilmCards(this._getFilms());
  }
}
