
import NoFilms from '../view/films/no-films.js';
import FilmPresenter from './film.js';

import {render} from '../utils/dom-utils.js';
import {updateItem} from '../utils/utils.js';
import {NoFilmMessageKey} from '../constants.js';


const SELECTOR_FILM_CONTAINER = '.films-list__container';

// ??? может, не делать вообще абстрактный сласс, а сразу относледовать FilmList от ExtraFilmList ???
export default class abstractfilmList {
  constructor(container) {
    this._container = container;
    this._filmPresenter = new Map();

    this._filmBlockComponent = null;

    this._handleFilmChange = this._handleFilmChange.bind(this);
  }

  init(films){
    this._films = films.slice();
    render(this._container, this._filmBlockComponent);
    this._renderFilmList();
  }

  _renderFilmCard(film) {
    const filmCardContainer = this._filmBlockComponent.getElement().querySelector(SELECTOR_FILM_CONTAINER);
    const filmCardPresenter = new FilmPresenter(filmCardContainer, this._handleFilmChange);
    filmCardPresenter.init(film);
    this._filmPresenter.set(film.id, filmCardPresenter); // добавляет каждый созданный FilmPresenter в Мапу
  }

  _clearFilmList() {
    this._filmPresenter.forEach((presenter) => presenter.destroy()); // удаляет все FilmPresenter в Мапе
    this._filmPresenter.clear(); // очищает Мапу
  }

  _renderFilmCards() {
    this._films.forEach((film) => this._renderFilmCard(film));
  }

  _renderNoFilms() {
    render(this._filmBlockComponent, new NoFilms(NoFilmMessageKey.ALL));
  }

  _handleFilmChange(updateFilm) {
    this._films = updateItem(this._films, updateFilm); // обновляет данные -> вставляет новый фильм вместо старого
    this._filmPresenter.get(updateFilm.id).init(updateFilm); //После обновления данных повторно инициализируем FilmPresenter уже с новыми данными
  }

  _renderFilmList() {
    if (!this._films.length) {
      this._renderNoFilms();
      return;
    }

    this._renderFilmCards();
  }
}
