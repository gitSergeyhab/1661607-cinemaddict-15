
import MainFilmsBlock from '../view/films/main-films-block.js';
import BtnShowMore from '../view/films/show-more-btn.js';
import Sort from '../view/sort.js';
import NoFilms from '../view/films/no-films.js';
import FilmPresenter from './film.js';

import {render} from '../utils/dom-utils.js';
import {updateItem} from '../utils/utils.js';

import {RenderPosition} from '../constants.js';


const SELECTOR_FILM_CONTAINER = '.films-list__container';
const FILM_COUNT_PER_STEP = 5;

export default class FilmList {
  constructor(container, footer) {
    this._container = container;
    this._footer = footer;
    this._filmPresenter = new Map(); // Мапа с FilmPresenter по ключу id

    this._sortComponent = new Sort();
    this._filmBlockComponent = new MainFilmsBlock();
    this._btnShowMoreComponent = new BtnShowMore();

    this._filmsShownIndexes = {
      first: 0, // индекс 1-го вновь отрисовываемого фильма
      last: FILM_COUNT_PER_STEP, // индекс фильма до которого нужно отрисовывать
      plus: FILM_COUNT_PER_STEP, // на сколько нужно увеличить предыдущие значения
    };

    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
  }

  init(films){
    this._films = films.slice();
    render(this._container, this._filmBlockComponent);
    this._renderFilmList();
  }

  _renderSort() {
    render(this._container, this._sortComponent);
  }

  _renderFilmCard(film) {
    const filmCardPresenter = new FilmPresenter(this._filmBlockComponent.getElement().querySelector(SELECTOR_FILM_CONTAINER), this._footer, this._handleFilmChange);
    filmCardPresenter.init(film, this._films);
    this._filmPresenter.set(film.id, filmCardPresenter); // добавляет каждый созданный FilmPresenter в Мапу
  }

  _clearFilmList() {
    this._filmPresenter.forEach((presenter) => presenter.destroy()); // удаляет все FilmPresenter в Мапе
    this._filmPresenter.clear(); // очищает Мапу
    this._filmsShownIndexes.first = 0; //возвращает счетчики в начало
    this._filmsShownIndexes.last = FILM_COUNT_PER_STEP;
  }

  _renderFilmCards() {
    this._films
      .slice(this._filmsShownIndexes.first, this._filmsShownIndexes.last)
      .forEach((film) => this._renderFilmCard(film));
  }

  _renderMainBlock() {
    this._renderFilmCards();
    if (this._filmsShownIndexes.last < this._films.length) {
      this._renderLoadMoreBtn();
    }
  }

  _renderNoFilms() {
    render(this._filmBlockComponent, new NoFilms('ALL'));
  }

  _handleLoadMoreButtonClick() { // обработчик добавления фильмов на кнопку
    this._filmsShownIndexes.first += this._filmsShownIndexes.plus;
    this._filmsShownIndexes.last += this._filmsShownIndexes.plus;

    this._renderFilmCards();

    if (this._filmsShownIndexes.last >= this._films.length) {
      this._btnShowMoreComponent.getElement().style.display = 'none';
    }
  }

  _handleFilmChange(updateFilm) {
    this._films = updateItem(this._films, updateFilm); // обновляет данные -> вставляет новый фильм вместо старого
    this._filmPresenter.get(updateFilm.id).init(updateFilm); //После обновления данных повторно инициализируем FilmPresenter уже с новыми данными
  }

  _renderLoadMoreBtn() {
    render(this._filmBlockComponent, this._btnShowMoreComponent, RenderPosition.AFTER_END);
    this._btnShowMoreComponent.setClickHandler(this._handleLoadMoreButtonClick);
  }

  _renderFilmList() {
    if (!this._films.length) {
      this._renderNoFilms();
      return 0;
    }

    this._renderMainBlock();
  }
}
