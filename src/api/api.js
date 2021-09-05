import FilmsModel from '../model/films-model';

const Method = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};


export default class Api {
  constructor(url, authorization) {
    this._url = url;
    this._authorization = authorization;
  }

  getFilms(){
    return this._load({url: 'movies'})
      .then(Api.toJSON)
      .then((films) => films.map(FilmsModel.adaptToClient));
  }

  updateFilm(film) {
    return this._load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(FilmsModel.adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then(FilmsModel.adaptToClient);
  }

  getComments(filmId){
    return this._load({url: `comments/${filmId}`})
      .then(Api.toJSON);
  }

  addComment(comment, filmId) {
    return this._load({
      url: `comments/${filmId}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON);
  }

  deleteComment(commentId) {
    return this._load({
      url: `comments/${commentId}`,
      method: Method.DELETE,
    });
  }

  sync(film) {
    this._load({
      url: '/movies/sync',
      method: Method.POST,
      body: JSON.stringify(film),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON);
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append('Authorization', this._authorization);

    return fetch(`${this._url}/${url}`, {method, body, headers})
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (response.ok) {
      return response;
    }

    throw new Error(`${response.status}: ${response.statusText}`);
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
