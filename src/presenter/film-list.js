import AbstractFilmList from './abstract-film-list';
import MainFilmsBlock from '../view/films/main-films-block.js';
import BtnShowMore from '../view/films/show-more-btn.js';
import Sort from '../view/sort.js';
import NoFilms from '../view/films/no-films.js';
import Loading from '../view/loading';

import {render, remove} from '../utils/dom-utils.js';
import {sortDate, sortRating} from '../utils/utils';
import {RenderPosition, SortType, EmptyResultMessage} from '../constants.js';
import {filter} from '../utils/filter.js';


const FILM_COUNT_PER_STEP = 5;

export default class FilmList extends AbstractFilmList {
  constructor(container, filmsModel, commentsModel, api, filtersModel) {
    super(container, filmsModel, commentsModel, api);

    this._filmBlockComponent = new MainFilmsBlock();
    this._btnShowMoreComponent = new BtnShowMore();
    this._loadingComponent = new Loading();

    this._filmsShown = FILM_COUNT_PER_STEP;
    this._sortType = SortType.DEFAULT;

    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._filtersModel = filtersModel;
    this._filtersModel.addObserver(this._handleModelEvent);

    render(this._container, this._loadingComponent);
  }


  _getFilms() {
    const filteredFilms = filter[this._filtersModel.getFilter()](this._filmsModel.films);
    switch (this._sortType) {
      case SortType.DATE:
        return filteredFilms.slice().sort(sortDate);
      case SortType.RATING:
        return filteredFilms.slice().sort(sortRating);
    }
    return filteredFilms;
  }

  _clearFilmList(resetRenderedFilmCount = false, resetSortType = false) {
    super._clearFilmList();

    remove(this._sortComponent);
    remove(this._noFilmComponent);
    remove(this._btnShowMoreComponent);

    if (resetSortType) {
      this._sortType = SortType.DEFAULT;
    }

    if (resetRenderedFilmCount) {
      this._filmsShown = FILM_COUNT_PER_STEP;
    }
  }

  _renderNoFilms() {
    this._noFilmComponent = new NoFilms(EmptyResultMessage[this._filtersModel.getFilter()]);
    render(this._filmBlockComponent, this._noFilmComponent);
  }

  _renderFilmCards(films) {
    const filmsForRender = films.slice(this._filmsShown - FILM_COUNT_PER_STEP, this._filmsShown);
    super._renderFilmCards(filmsForRender);
    this._hideBtnShowMore();
  }

  _renderFilmList() {
    super._renderFilmList();
    this._renderMainBlock();
  }


  hideSort() {
    this._sortComponent.getElement().style.display = 'none';
    this._sortType = SortType.DEFAULT;
  }

  showSort() {
    this._sortComponent.getElement().style.display = 'flex';
  }


  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new Sort(this._sortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._container, this._sortComponent, RenderPosition.BEFORE_BEGIN);
  }

  _hideBtnShowMore() {
    const allFilmsAreShown = this._filmsShown >= this._getFilms().length;
    this._btnShowMoreComponent.getElement().style.display = allFilmsAreShown ? 'none' : 'block';
  }

  _renderMainBlock() {
    const filmsForRender = this._getFilms().slice(0, this._filmsShown);
    super._renderFilmCards(filmsForRender);
    this._renderSort();
    if (this._filmsShown < this._getFilms().length) {
      this._renderLoadMoreBtn();
    }
  }

  _renderLoadMoreBtn() {
    render(this._filmBlockComponent, this._btnShowMoreComponent, RenderPosition.AFTER_END);
    this._btnShowMoreComponent.setClickHandler(this._handleLoadMoreButtonClick);
  }


  _handleSortTypeChange(sortType){
    if (this._sortType === sortType) {
      return;
    }

    this._sortType = sortType;
    this._clearFilmList(true, false);
    this._renderFilmList();
  }

  _handleLoadMoreButtonClick() {
    this._filmsShown += FILM_COUNT_PER_STEP;
    this._renderFilmCards(this._getFilms());
  }
}
