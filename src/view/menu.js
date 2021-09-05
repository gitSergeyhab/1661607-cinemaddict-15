import Abstract from './abstract.js';
import {FilterType} from '../constants.js';


const ACTIVE_FILTER_BTN_CLASS = 'main-navigation__item--active';


const createMenu = (watchListLength, historyLength, favoritestLength, currentFilter) => `
  <nav class="main-navigation">

    <div class="main-navigation__items">
      <a href="#all" data-filter="${FilterType.ALL_MOVIES}" class="main-navigation__item ${currentFilter === FilterType.ALL_MOVIES ? ACTIVE_FILTER_BTN_CLASS : ''} ">All movies</a>
      <a href="#watchlist" data-filter="${FilterType.WATCH_LIST}" class="main-navigation__item ${currentFilter === FilterType.WATCH_LIST ? ACTIVE_FILTER_BTN_CLASS : ''}">Watchlist <span class="main-navigation__item-count">${watchListLength}</span></a>
      <a href="#history" data-filter="${FilterType.HISTORY}" class="main-navigation__item ${currentFilter === FilterType.HISTORY ? ACTIVE_FILTER_BTN_CLASS : ''}">History <span class="main-navigation__item-count">${historyLength}</span></a>
      <a href="#favorites" data-filter="${FilterType.FAVORITES}" class="main-navigation__item ${currentFilter === FilterType.FAVORITES ? ACTIVE_FILTER_BTN_CLASS : ''}">Favorites <span class="main-navigation__item-count">${favoritestLength}</span></a>
    </div>

    <a href="#stats" data-filter="${FilterType.STATS}" class="main-navigation__additional">Stats</a>
  </nav>`;

export default class Menu extends Abstract{
  constructor(watchListLength, historyLength, favoritesLength, filter) {
    super();
    this._watchListLength = watchListLength;
    this._historyLength = historyLength;
    this._favoritesLength = favoritesLength;
    this._filter = filter;

    this._statsElement = this.getElement().querySelector('.main-navigation__additional');

    this._clickFilterHandler = this._clickFilterHandler.bind(this);
    this._clickNavigationHandler = this._clickNavigationHandler.bind(this);

    this._markOnlyStats();
  }

  getTemplate() {
    return createMenu(this._watchListLength, this._historyLength, this._favoritesLength, this._filter);
  }

  _markOnlyStats() {
    const filters = this.getElement().querySelectorAll('.main-navigation__item');
    this._statsElement.addEventListener('click', () => {
      filters.forEach((filter) => filter.classList.remove(ACTIVE_FILTER_BTN_CLASS));
      this._statsElement.classList.add(ACTIVE_FILTER_BTN_CLASS);
    });
  }

  _clickFilterHandler(evt) {
    evt.preventDefault();
    this._statsElement.classList.remove(ACTIVE_FILTER_BTN_CLASS);
    const filter = evt.target.dataset.filter;
    if (filter) {
      this._callback.clickFilter(filter);
    }
  }

  _clickNavigationHandler(evt) {
    evt.preventDefault();
    const filter = evt.target.dataset.filter;
    if (filter) {
      this._callback.clickNavigation(filter);
    }
  }

  setClickFilterHandler(cb) {
    this._callback.clickFilter = cb;
    this.getElement().querySelector('.main-navigation__items').addEventListener('click', this._clickFilterHandler);
  }

  setClickNavigationHandler(cb) {
    this._callback.clickNavigation = cb;
    this.getElement().addEventListener('click', this._clickNavigationHandler);
  }
}

