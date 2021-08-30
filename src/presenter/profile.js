import Profile from '../view/profile.js';

import {getRatingByWatched} from '../utils/utils.js';
import {render, remove} from '../utils/dom-utils.js';
import {filter} from '../utils/filter.js';
import {FilterType, UpdateType} from '../constants.js';


export default class ProfilePresenter {
  constructor (container, filmsModel) {
    this._container = container;
    this._profileComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filmsModel = filmsModel;
    this._filmsModel.addObserver(this._handleModelEvent);
  }

  init() {
    if (this._profileComponent !== null) {
      remove(this._profileComponent);
    }

    const watchedFilmsCount = filter[FilterType.HISTORY](this._filmsModel.films).length;
    this._profileComponent = new Profile(getRatingByWatched(watchedFilmsCount));
    render(this._container, this._profileComponent);
  }

  _handleModelEvent(updateType) {
    if (updateType === UpdateType.MAJOR) {
      this.init();
    }
  }
}
