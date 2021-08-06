import {
  getHoursAndMinutes,
  getYear
} from '../../utils/date-time-utils.js';
import {
  DEFAULT_POSTER,
  ActiveClass
} from '../../constants.js';
import {
  createElement
} from '../../utils/dom-utils.js';


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
  filmInfo: {
    title,
    totalRating,
    poster,
    release: {
      date,
    },
    runtime,
    genre,
    description,
  },
  userDetails: {
    watchList,
    alreadyWatched,
    favorite,
  },
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

export default class FilmCard {
  constructor(data) {
    this._data = data;
    this._element = null;
  }

  getTemplate() {
    return createFilmCard(this._data);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate(this._data));
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
