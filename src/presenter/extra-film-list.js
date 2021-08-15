
import ExtraFilmsBlock from '../view/films/extra-films-block.js';
import NoFilms from '../view/films/no-films.js';
import FilmPresenter from './film.js';

import {render} from '../utils/dom-utils.js';


const SELECTOR_FILM_CONTAINER = '.films-list__container';

export default class ExtraFilmList {
  constructor(container, footer, name) {
    this._container = container;
    this._footer = footer;

    this._filmBlockComponent = new ExtraFilmsBlock(name);
  }

  init(films){
    this._films = films;
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
    this._films.forEach((film) => this._renderFilmCard(film));
  }

  _renderNoFilms() {
    render(this._filmBlockComponent, new NoFilms('ALL'));
  }

  _renderFilmList() {
    if (!this._films.length) {
      this._renderNoFilms();
      return 0;
    }

    this._renderFilmCards();
  }
}
