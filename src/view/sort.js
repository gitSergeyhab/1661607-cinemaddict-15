import Abstract from './abstract';
import {SortType} from '../constants.js';


const ACTIVE_SORT_BTN_CLASS = 'sort__button--active';


const createSort = (sortType, sortTypeFromEnum) => `<li>
  <a href="#" class="sort__button ${sortType === sortTypeFromEnum ? ACTIVE_SORT_BTN_CLASS : ''}"data-sort-Type="${sortTypeFromEnum}">
    Sort by ${sortTypeFromEnum}
  </a>
</li>`;


const createSortTemplate = (sortType) => `<ul class="sort">
  ${Object.values(SortType).map((typeFromEnum) => createSort(sortType, typeFromEnum)).join('\n')}
</ul>`;

export default class Sort extends Abstract {
  constructor(sortType) {
    super();
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._sortType = sortType;
  }

  getTemplate() {
    return createSortTemplate(this._sortType);
  }


  setSortTypeChangeHandler(cb) {
    this._callback.clickSort = cb;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }


  _sortTypeChangeHandler(evt) {
    evt.preventDefault();
    const sortType = evt.target.dataset.sortType;
    if (!sortType) {
      return;
    }

    this._callback.clickSort(sortType);
  }
}
