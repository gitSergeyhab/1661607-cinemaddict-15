import FilmsModel from '../model/films-model.js';
import {isOnline, showOfflineMessage} from '../utils/offline-utils.js';


// const getSyncedItems = (items) => items.filter(({success}) => success).map(({payload}) => payload.film);
// ??? у меня в респонсе нет ни success, ни payload - это мой косяк или все так и задумано ???


const createStoreStructure = (items) => items.reduce((acc, current) => ( { ...acc, [current.id]: current } ), {});


export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getFilms(){
    if (isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          const items = createStoreStructure(films.map(FilmsModel.adaptToServer));
          this._store.setItems(items);
          return films;
        });
    }

    const storeFilms = Object.values(this._store.getItems());
    return Promise.resolve(storeFilms.map(FilmsModel.adaptToClient));
  }

  updateFilm(film) {
    if (isOnline()) {
      return this._api.updateFilm(film)
        .then((update) => {
          this._store.setItem(update.id, FilmsModel.adaptToServer(update));
          return update;
        });
    }

    this._store.setItem(film.id, FilmsModel.adaptToServer({ ...film }));
    return Promise.resolve(film);
  }

  getComments(filmId){
    if (!isOnline()) {
      showOfflineMessage();
    }
    return this._api.getComments(filmId);
  }

  addComment(comment, filmId) {
    if (!isOnline()) {
      showOfflineMessage();
    }
    return this._api.addComment(comment, filmId);
  }

  deleteComment(commentId) {
    if (!isOnline()) {
      showOfflineMessage();
    }
    return this._api.deleteComment(commentId);
  }

  sync() {
    if (isOnline()) {
      const storeFilms = Object.values(this._store.getItems());
      return this._api.sync(storeFilms);
    }

    return Promise.reject(new Error('Sync data failed'));
  }
}
