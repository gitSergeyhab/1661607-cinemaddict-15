import Abstract from './abstract.js';
import {FilterType} from '../constants.js';


const ACTIVE_FILTER_BTN_CLASS = 'main-navigation__item--active';


const createCountsSpan = (count) => `<span class="main-navigation__item-count">${count}</span>`;

const createMenuItem = (currentFilter, filterType, filmCounts) =>`
<a href="#${filterType}"
  data-filter="${filterType}"
  class="main-navigation__item ${currentFilter === filterType ? ACTIVE_FILTER_BTN_CLASS : ''}">
  ${filterType}
  ${filmCounts[filterType] ? createCountsSpan(filmCounts[filterType]) : ''}
</a>`;


const createMenuTemplate = (filmCounts, currentFilter) => `
  <nav class="main-navigation">
    <div class="main-navigation__items">
      ${Object.values(FilterType).map((filterType) => {
    if (filterType !== FilterType.STATS) {
      return createMenuItem(currentFilter, filterType, filmCounts);
    }
  }).join('\n')}
    </div>
    <a href="#stats" data-filter="${FilterType.STATS}" class="main-navigation__additional">${FilterType.STATS}</a>
  </nav>`;

export default class Menu extends Abstract{
  constructor(watchListLength, historyLength, favoritesLength, filter) {
    super();
    this._filter = filter;
    this._filmCounts = {
      [FilterType.WATCH_LIST]: watchListLength,
      [FilterType.HISTORY]: historyLength,
      [FilterType.FAVORITES]: favoritesLength,
    };

    this._statsElement = this.getElement().querySelector('.main-navigation__additional');

    this._clickFilterHandler = this._clickFilterHandler.bind(this);
    this._clickNavigationHandler = this._clickNavigationHandler.bind(this);

    this._markOnlyStats();
  }

  getTemplate() {
    return createMenuTemplate(this._filmCounts, this._filter);
  }


  setClickFilterHandler(cb) {
    this._callback.clickFilter = cb;
    this.getElement().querySelector('.main-navigation__items').addEventListener('click', this._clickFilterHandler);
  }

  setClickNavigationHandler(cb) {
    this._callback.clickNavigation = cb;
    this.getElement().addEventListener('click', this._clickNavigationHandler);
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
}

