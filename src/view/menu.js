import {createElement} from '../utils/dom-utils.js';

const createMenu = (watchListLength, historyLength, favoritestLength) => `
  <nav class="main-navigation">

    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchListLength}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${historyLength}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favoritestLength}</span></a>
    </div>

    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>
  <ul class="sort">
    <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" class="sort__button">Sort by date</a></li>
    <li><a href="#" class="sort__button">Sort by rating</a></li>
  </ul>`;

export default class Menu {
  constructor(watchListLength, historyLength, favoritestLength) {
    this._watchListLength = watchListLength;
    this._historyLength = historyLength;
    this._favoritestLength = favoritestLength;
    this._element = null;
  }

  getTemplate() {
    return createMenu(this._watchListLength, this._historyLength, this._favoritestLength);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
