import FilmsModel from '../model/films-model';
import CommentsModel from '../model/comments-model';
import { isOnline } from '../utils/utils';

const getSyncedItems = (items) => items.filter(({success}) => success).map(({payload}) => payload.task);

const createStoreStructure = (items) => items.reduce((acc, current) => Object.assign({}, acc, {[current.id]: current}), {});
// const createStoreStructure = (items) => items.reduce((acc, current) => ( { ...acc, [current.id]: current } ), {});


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

    return this._api.updateFilm(film);
  }

  getComments(filmId){
    console.log('provider getComments')
    return this._api.getComments(filmId);
  }

  addComment(comment, filmId) {
    return this._api.addComment(comment, filmId);
  }

  deleteComment(commentId) {
    return this._api.deleteComment(commentId);
  }

  // sync(film) {
  //   this._load({
  //     url: '/movies/sync',
  //     method: Method.POST,
  //     body: JSON.stringify(film),
  //     headers: new Headers({'Content-Type': 'application/json'}),
  //   })
  //     .then(Api.toJSON);
  // }

  // _load({url, method = Method.GET, body = null, headers = new Headers()}) {
  //   headers.append('Authorization', this._authorization);

  //   return fetch(`${this._url}/${url}`, {method, body, headers})
  //     .then(Api.checkStatus)
  //     .catch(Api.catchError);
  // }

  // static checkStatus(response) {
  //   if (response.ok) {
  //     return response;
  //   }

  //   throw new Error(`${response.status}: ${response.statusText}`);
  // }

  // static toJSON(response) {
  //   return response.json();
  // }

  // static catchError(err) {
  //   throw err;
  // }
}
