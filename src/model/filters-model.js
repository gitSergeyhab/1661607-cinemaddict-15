import AbstractObserver from './abstract-observer';
import {FilterType} from '../constants.js';


export default class FiltersModel extends AbstractObserver {
  constructor() {
    super();
    this._filter = FilterType.ALL_MOVIES;
  }

  setFilter(updateType, filter) {
    this._filter = filter;
    this._notify(updateType, filter);
  }

  getFilter() {
    return this._filter;
  }
}
