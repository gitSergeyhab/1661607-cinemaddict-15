import Abstract from './abstract';
import {SortType} from '../constants.js';


const ACTIVE_SORT_BTN_CLASS = 'sort__button--active';


const createSort = () => `<ul class="sort">
<li><a href="#" class="sort__button sort__button--active" data-sort-Type=${SortType.DEFAULT}>Sort by default</a></li>
<li><a href="#" class="sort__button" data-sort-Type=${SortType.DATE}>Sort by date</a></li>
<li><a href="#" class="sort__button" data-sort-Type=${SortType.RATING}>Sort by rating</a></li>
</ul>`;


export default class Sort extends Abstract {
  constructor() {
    super();
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSort();
  }

  _markChosenSort(target){
    const sorts = this.getElement().querySelectorAll('.sort__button');
    sorts.forEach((sort) => sort.classList.remove(ACTIVE_SORT_BTN_CLASS));
    target.classList.add(ACTIVE_SORT_BTN_CLASS);
  }

  _sortTypeChangeHandler(evt) {
    evt.preventDefault();
    const sortType = evt.target.dataset.sortType;
    if (!sortType) {
      return;
    }
    this._callback.clickSort(sortType);
    this._markChosenSort(evt.target);
  }

  setSortTypeChangeHandler(cb) {
    this._callback.clickSort = cb;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }

}
