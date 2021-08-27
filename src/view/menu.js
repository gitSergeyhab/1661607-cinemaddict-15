import Abstract from './abstract.js';
import {FilterType} from '../constants.js';


console.log(FilterType)

const ACTIVE_FILTER_BTN_CLASS = 'main-navigation__item--active';


const createMenu = (watchListLength, historyLength, favoritestLength, currentFilter) => `
  <nav class="main-navigation">

    <div class="main-navigation__items">
      <a href="#all" data-filter="${FilterType.ALL_MOVIES}" class="main-navigation__item ${currentFilter === FilterType.ALL_MOVIES ? ACTIVE_FILTER_BTN_CLASS : ''} ">All movies</a>
      <a href="#watchlist" data-filter="${FilterType.WATCH_LIST}" class="main-navigation__item ${currentFilter === FilterType.WATCH_LIST ? ACTIVE_FILTER_BTN_CLASS : ''}">Watchlist <span class="main-navigation__item-count">${watchListLength}</span></a>
      <a href="#history" data-filter="${FilterType.HISTORY}" class="main-navigation__item ${currentFilter === FilterType.HISTORY ? ACTIVE_FILTER_BTN_CLASS : ''}">History <span class="main-navigation__item-count">${historyLength}</span></a>
      <a href="#favorites" data-filter="${FilterType.FAVORITES}" class="main-navigation__item ${currentFilter === FilterType.FAVORITES ? ACTIVE_FILTER_BTN_CLASS : ''}">Favorites <span class="main-navigation__item-count">${favoritestLength}</span></a>
    </div>

    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;

export default class Menu extends Abstract{
  constructor(watchListLength, historyLength, favoritestLength, filter) {
    super();
    this._watchListLength = watchListLength;
    this._historyLength = historyLength;
    this._favoritestLength = favoritestLength;
    this._filter = filter;

    this._clickFilterHandler = this._clickFilterHandler.bind(this);
  }

  getTemplate() {
    return createMenu(this._watchListLength, this._historyLength, this._favoritestLength, this._filter);
  }

  _clickFilterHandler(evt) {
    evt.preventDefault();
    this._callback.clickFilter(evt.target.dataset.filter);
  }

  setClickFilterHandler(cb) {
    this._callback.clickFilter = cb;
    this.getElement().addEventListener('click', this._clickFilterHandler);
  }
}

