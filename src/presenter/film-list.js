import AbstractFilmList from './abstract-film-list';
import MainFilmsBlock from '../view/films/main-films-block.js';
import BtnShowMore from '../view/films/show-more-btn.js';
import Sort from '../view/sort.js';

import {render, remove} from '../utils/dom-utils.js';
import {sortDate, sortRating} from '../utils/utils';
import {RenderPosition, SortType} from '../constants.js';
import {UserAction, UpdateType} from '../constants.js';



const FILM_COUNT_PER_STEP = 5;

export default class ExtraFilmList extends AbstractFilmList {
  constructor(container, filmsModel, commentsModel) {
    super(container, filmsModel, commentsModel);

    // this._sortComponent = new Sort();
    this._filmBlockComponent = new MainFilmsBlock();
    this._btnShowMoreComponent = new BtnShowMore();


    this._filmsShown = 0;
    this._sortType = SortType.DEFAULT;

    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleTypeChangeClick = this._handleTypeChangeClick.bind(this);
  }

  init(){
    // this._renderSort();
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
    this._sortComponent.setSortTypeChangeHandler(this._handleTypeChangeClick);
    // console.log(this._container.getElement())
    console.log(this._sortComponent.getElement())
    // render(this._container, this._btnShowMoreComponent, RenderPosition.BEFORE_END);
    // render(document.body.querySelector('nav'), this._sortComponent, RenderPosition.AFTER_END);
    render(this._container, this._sortComponent, RenderPosition.BEFORE_BEGIN); // так почему-то не работает

    console.log(this._container.getElement(), this._sortComponent.getElement())
  }

  _clearFilmList(resetSortType = false) {
    super._clearFilmList();

    remove(this._sortComponent); // ?
    remove(this._noFilmComponent);
    remove(this._btnShowMoreComponent);

    if (resetSortType) {
      this._sortType = SortType.DEFAULT;
    }
    this._filmsShown = 0;
  }

  _hideBtnShowMore() {
    const allFilmsAreShown = this._filmsShown + FILM_COUNT_PER_STEP >= this._filmsCount;
    this._btnShowMoreComponent.getElement().style.display = allFilmsAreShown ? 'none' : 'block';
  }

  _renderFilmCards(films) {
    const filmsForRender = films.slice(this._filmsShown, this._filmsShown + FILM_COUNT_PER_STEP);
    super._renderFilmCards(filmsForRender);
    this._hideBtnShowMore();
  }

  _renderMainBlock() {
    this._renderFilmCards(this._getFilms());
    this._renderSort();// ?
    if (this._filmsShown + FILM_COUNT_PER_STEP < this._filmsCount) {
      this._renderLoadMoreBtn();
    }
  }


  _handleTypeChangeClick(sortType){
    if (this._sortType === sortType) {
      return;
    }

    this._sortType = sortType;
    this._clearFilmList();
    this._renderMainBlock();
  }

  _handleLoadMoreButtonClick() { // обработчик добавления фильмов на кнопку
    this._filmsShown += FILM_COUNT_PER_STEP;
    this._renderFilmCards(this._getFilms());
  }

  _renderLoadMoreBtn() {
    render(this._filmBlockComponent, this._btnShowMoreComponent, RenderPosition.AFTER_END);
    this._btnShowMoreComponent.setClickHandler(this._handleLoadMoreButtonClick);
  }

  _handleModelEvent(updateType, data) {
    switch(updateType) {
      case UpdateType.PATCH:// комментарии
        this._filmPresenter.get(data.id).init(data);
        // обновить фильмы в других filmlist по data.id
        break;
      case UpdateType.MINOR:// favorite, watchList
        // this._filmPresenter.get(data.id).init(data);
        this._clearFilmList();
        this._renderFilmList();
        // обновить другие filmlist
        // обновить filters
        break;
      case UpdateType.MAJOR:
        // this._filmPresenter.get(data.id).init(data);
        this._clearFilmList();
        this._renderFilmList();
        // обновить другие filmlist
        // обновить filters
        // обновить Profile
        break;
    }
  }

  // const UpdateType = {
  //   PATCH: 'PATCH', // comments            - перерисовка всех филмлистов
  //   MINOR: 'MINOR', // favorite, watchList - перерисовка всех филмлистов и фильтров
  //   MAJOR: 'MAJOR', // history             - перерисовка всех филмлистов и фильтров и профиля
  // };

  _renderFilmList() {
    // this._renderSort();
    super._renderFilmList();
    this._renderMainBlock();
  }
}
