import Menu from '../view/menu.js';


import {render, remove} from '../utils/dom-utils.js';
import {RenderPosition, UpdateType} from '../constants.js';
import {filter} from  '../utils/filter.js';


export default class MenuPresenter {
  constructor(container, filmsModel, filtersModel, handleSiteMenuClick) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._filtersModel = filtersModel;

    this._menuComponent = null;

    this._handleSiteMenuClick = handleSiteMenuClick;

    this._handleFilterClick = this._handleFilterClick.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filtersModel.addObserver(this._handleModelEvent);
    this._filmsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderFilter();
    this._menuComponent.setClickFilterHandler(this._handleFilterClick);
    this._menuComponent.setClickNavigationHandler(this._handleSiteMenuClick);
  }

  _removeFilter() {
    remove(this._menuComponent);
  }

  _getFilmCountByFilter() {
    const films = this._filmsModel.films;
    return Object.entries(filter).slice(1).map((item) => item[1](films).length);
  }

  _renderFilter() {
    this._menuComponent = new Menu(...this._getFilmCountByFilter(), this._filtersModel.getFilter());
    render(this._container, this._menuComponent, RenderPosition.AFTER_BEGIN);
  }

  _handleFilterClick(filterName) { // он же _handleViewAction
    this._filtersModel.setFilter(UpdateType.MINOR, filterName);
  }

  _handleModelEvent() {
    remove(this._menuComponent);
    this.init();
  }
}
