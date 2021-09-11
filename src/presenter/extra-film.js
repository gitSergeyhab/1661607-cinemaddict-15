import AbstractFilmList from './abstract-film-list';
import {getNotImplementedError} from '../utils/utils.js';


export default class ExtraFilmList extends AbstractFilmList {

  _changeDisplayStyle() {
    getNotImplementedError('_changeDisplayStyle');
  }

  _renderFilmList() {
    this._getFilms().length ? this._changeDisplayStyle() : this._renderNoFilms();
    if (this._openedFilmId[0] !== null) {
      this._renderPopup();
    }

    this._renderFilmCards(this._getFilms());
  }
}
