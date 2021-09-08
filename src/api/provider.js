import FilmsModel from '../model/films-model.js';
import {isOnline} from '../utils/offline-utils.js';
import {showOfflineMessage} from '../utils/show-offline-message.js';


const createStoreStructure = (items) => items.reduce((acc, current) => ({ ...acc, [current.id]: current }), {});
const rejectRequest = (typeRequest) => Promise.reject(new Error(`${typeRequest} failed`));


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
    if (isOnline()) {
      return this._api.getComments(filmId);
    }

    showOfflineMessage();
    return rejectRequest('get Comments');
  }

  addComment(comment, filmId) {
    if (isOnline()) {
      return this._api.addComment(comment, filmId);
    }

    showOfflineMessage();
    return rejectRequest('add Comment');
  }

  deleteComment(commentId) {
    if (isOnline()) {
      return this._api.deleteComment(commentId);
    }

    showOfflineMessage();
    return rejectRequest('deleteComment');
  }

  sync() {
    if (isOnline()) {
      const storeFilms = Object.values(this._store.getItems());
      return this._api.sync(storeFilms)
        .then((response) => {
          const updatedFilms = createStoreStructure(response.updated);
          this._store.setItems(updatedFilms);
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }
}
