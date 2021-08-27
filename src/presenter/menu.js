import Menu from '../view/menu.js';


import {render, remove, replace} from '../utils/dom-utils.js';
import {RenderPosition, SortType, FilterType, UserAction, UpdateType} from '../constants.js';
import {filter} from  '../utils/filter.js';


export default class MenuPresenter {
  constructor(container, filmsModel, filtersModel) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._filtersModel = filtersModel;
  }

  init() {
    console.log(FilterType.ALL_MOVIES)
    this._renderFilter( ...this._getFilterFilms(), FilterType.ALL_MOVIES);
  }

  _getFilterFilms() {
    const films = this._filmsModel.films;
    return Object.entries(filter).map((item) => item[1](films).length);
  }

  _renderFilter( watch, history, favorites, type) {
    render(this._container, new Menu(watch, history, favorites, type));
  }
}
