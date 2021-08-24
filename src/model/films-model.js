import AbstractObserver from './abstract-observer.js';

export default class FilmsModel extends AbstractObserver{
  constructor() {
    super();
    this._films = [];
  }

  set films(filmList) {
    this._films = filmList.slice();
  }

  get films() {
    return this._films;
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((item) => item.id === update.id);
    this._films = index === -1 ? this._films :  [...this._films.slice(0, index), update, ...this._films.slice(index + 1)];

    this._notify(updateType, update);
  }
}
