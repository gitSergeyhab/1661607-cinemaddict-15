
import MainFilmsBlock from '../view/films/main-films-block.js';
import BtnShowMore from '../view/films/show-more-btn.js';
import Sort from '../view/sort.js';
import NoFilms from '../view/films/no-films.js';
import FilmPresenter from './film.js';
import {render} from '../utils/dom-utils.js';
import {RenderPosition} from '../constants.js';


const SELECTOR_FILM_CONTAINER = '.films-list__container';

export default class FilmList {
  constructor(container, footer) {
    this._container = container;
    this._footer = footer;

    this._sortComponent = new Sort();
    this._filmBlockComponent = new MainFilmsBlock();
    this._btnShowMoreComponent = new BtnShowMore();

    this._filmsShownIndexes = {
      first: 0, // индекс 1-го вновь отрисовываемого фильма
      last: 5, // индекс фильма до которого нужно отрисовывать
      plus: 5, // на сколько нужно увеличить предыдущие значения
    };

    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
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
    const filmCard = new FilmPresenter(this._filmBlockComponent.getElement().querySelector(SELECTOR_FILM_CONTAINER), this._footer);
    filmCard.init(film, this._films);
  }

  _renderFilmCards() {
    this._films
      .slice(this._filmsShownIndexes.first, this._filmsShownIndexes.last)
      .forEach((film) => this._renderFilmCard(film));
  }

  _renderNoFilms() {
    render(this._filmBlockComponent, new NoFilms('ALL'));
  }

  _handleLoadMoreButtonClick() { // обработчик добавления фильмов на кнопку
    this._filmsShownIndexes.first += this._filmsShownIndexes.plus;
    this._filmsShownIndexes.last += this._filmsShownIndexes.plus;
    console.log('!!!')

    this._renderFilmCards();

    if (this._filmsShownIndexes.last >= this._films.length) {
      this._btnShowMoreComponent.getElement().style.display = 'none';
    }
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

    this._renderFilmCards();
    this._renderLoadMoreBtn();
  }
}
