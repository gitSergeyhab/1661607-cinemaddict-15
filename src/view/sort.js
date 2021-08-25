import Abstract from './abstract';
import {SortType} from '../constants.js';


const ACTIVE_SORT_BTN_CLASS = 'sort__button--active';


const createSort = (sortType) => `<ul class="sort">
<li><a href="#" class="sort__button ${sortType === SortType.DEFAULT ? ACTIVE_SORT_BTN_CLASS : ''}" data-sort-Type=${SortType.DEFAULT}>Sort by default</a></li>
<li><a href="#" class="sort__button ${sortType === SortType.DATE ? ACTIVE_SORT_BTN_CLASS : ''}" data-sort-Type=${SortType.DATE}>Sort by date</a></li>
<li><a href="#" class="sort__button ${sortType === SortType.RATING ? ACTIVE_SORT_BTN_CLASS : ''}" data-sort-Type=${SortType.RATING}>Sort by rating</a></li>
</ul>`;


export default class Sort extends Abstract {
  constructor(sortType) {
    super();
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._sortType = sortType;
  }

  getTemplate() {
    return createSort(this._sortType);
  }

  _sortTypeChangeHandler(evt) {
    evt.preventDefault();
    const sortType = evt.target.dataset.sortType;
    if (!sortType) {
      return;
    }
    this._callback.clickSort(sortType);
  }

  setSortTypeChangeHandler(cb) {
    this._callback.clickSort = cb;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }

}
