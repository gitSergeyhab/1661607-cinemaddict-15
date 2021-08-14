import {
  getHoursAndMinutes,
  getYear
} from '../../utils/date-time-utils.js';
import {
  DEFAULT_POSTER,
  ActiveClass
} from '../../constants.js';
import Abstract from '../abstract.js';


const MAX_DESCRIPTION_LENGTH = 140;

const makeItemActive = (value) => value ? ActiveClass.CARD : '';

const cutOffDescription = (description) => {
  if (!description) {
    return '';
  }
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return `${description.slice(0, MAX_DESCRIPTION_LENGTH - 1)}...`;
  }
  return description;
};


const createFilmCard = ({
  id,
  comments,
  filmInfo: {title, totalRating, poster, release: {date}, runtime, genre, description},
  userDetails: {watchList, alreadyWatched, favorite},
}) => `
<article class="film-card" data-film-id=${id}>
  <h3 class="film-card__title">${title || ''}</h3>
  <p class="film-card__rating">${totalRating || ''}</p>

  <p class="film-card__info">
    <span class="film-card__year">${getYear(date)}</span>
    <span class="film-card__duration">${getHoursAndMinutes(runtime)}</span>
    <span class="film-card__genre">${genre[0] || ''}</span>
  </p>

  <img src=${poster || DEFAULT_POSTER} alt="" class="film-card__poster">
  <p class="film-card__description">${cutOffDescription(description)}</p>
  <a class="film-card__comments">${comments.length} comments</a>

  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${makeItemActive(watchList)}" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${makeItemActive(alreadyWatched)}" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite ${makeItemActive(favorite)}" type="button">Mark as favorite</button>
  </div>
</article>`;

export default class FilmCard extends Abstract {
  constructor(film) {
    super();
    this._film = film;
    this._clickHandler = this._clickHandler.bind(this);
    this._id = null;
  }

  getTemplate() {
    return createFilmCard(this._film);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  _getId() {
    return this.getElement().dataset.filmId;
  }

  setClickHandler(cb) {
    this._callback.click = () => cb(this._getId());
    this.getElement().querySelector('.film-card__title').addEventListener('click', this._clickHandler);
    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._clickHandler);
    this.getElement().querySelector('.film-card__comments').addEventListener('click', this._clickHandler);
  }
}
