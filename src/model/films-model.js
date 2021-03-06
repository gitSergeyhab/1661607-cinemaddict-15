import AbstractObserver from './abstract-observer.js';

export default class FilmsModel extends AbstractObserver{
  constructor() {
    super();
    this._films = [];
  }

  get films() {
    return this._films;
  }


  setFilms(updateType, films) {
    this._films = films.slice();
    this._notify(updateType);
  }

  updateFilm(updateType, update) {
    this._changeOneFilm(update);
    this._notify(updateType, update);
  }


  deleteId(updateType, commentId, filmId) {
    let film = this._films.find((item) => item.id === filmId);
    const setIds = new Set(film.comments);
    setIds.delete(commentId);
    const ids = [...setIds];
    film = { ...film, comments: ids };
    this._changeOneFilm(film);
    this._notify(updateType);
  }


  _changeOneFilm(newFilm) {
    const index = this._films.findIndex((item) => item.id === newFilm.id);
    this._films = index === -1 ? this._films :  [ ...this._films.slice(0, index), newFilm, ...this._films.slice(index + 1) ];
  }


  static adaptToClient(film) {
    const adaptedFilm = {
      ...film,
      userDetails: {
        watchList: film['user_details']['watchlist'],
        alreadyWatched: film['user_details']['already_watched'],
        watchingDate: film['user_details']['watching_date'],
        favorite: film['user_details']['favorite'],
      },
      filmInfo: {
        ...film['film_info'],
        alternativeTitle: film['film_info']['alternative_title'],
        totalRating: film['film_info']['total_rating'],
        ageRating: film['film_info']['age_rating'],
        release: {
          date: film['film_info']['release']['date'],
          releaseCountry: film['film_info']['release']['release_country'],
        },
      }};

    delete adaptedFilm['user_details'];
    delete adaptedFilm['film_info'];
    delete adaptedFilm.filmInfo['alternative_title'];
    delete adaptedFilm.filmInfo['total_rating'];
    delete adaptedFilm.filmInfo['age_rating'];

    return adaptedFilm;
  }

  static adaptToServer(film) {
    const adaptedFilm = {
      ...film,
      'user_details': {
        'favorite': film.userDetails.favorite,
        'watchlist': film.userDetails.watchList,
        'already_watched': film.userDetails.alreadyWatched,
        'watching_date': film.userDetails.watchingDate,
      },
      'film_info': {
        ...film.filmInfo,
        'alternative_title': film.filmInfo.alternativeTitle,
        'total_rating': film.filmInfo.totalRating,
        'age_rating': film.filmInfo.ageRating,
        'release': {
          'date': film.filmInfo.release.date,
          'release_country': film.filmInfo.release.releaseCountry,
        },
      }};

    delete adaptedFilm.userDetails;
    delete adaptedFilm.filmInfo;
    delete adaptedFilm['film_info']['alternativeTitle'];
    delete adaptedFilm['film_info']['totalRating'];
    delete adaptedFilm['film_info']['ageRating'];

    return adaptedFilm;
  }
}
