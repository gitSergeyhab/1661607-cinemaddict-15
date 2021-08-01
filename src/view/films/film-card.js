/* eslint-disable camelcase*/ // с сервера данные приходят в snake_case, так что  вот...
import {getHoursAndMinutes, getYear, makeActivatingFunc} from '../../util.js';
import {DEFAULT_POSTER, MAX_LEN_DESCRIPTION, ActiveClasses} from '../../setup.js';


const makeItemActive = makeActivatingFunc(ActiveClasses.CARD);

const cutOffDescription = (description) => {
  if (!description) {
    return '';
  } else if (description.length > MAX_LEN_DESCRIPTION) {
    return `${description.slice(0, MAX_LEN_DESCRIPTION - 1)}...`;
  }
  return description;
};

export const createFilmCard = ({
  id, comments,
  film_info: {title, total_rating, poster, release: {date}, runtime, genre, description},
  user_details: {watchlist, already_watched, favorite},
}) => `
<article class="film-card" data-id=${id}>
  <h3 class="film-card__title">${title || ''}</h3>
  <p class="film-card__rating">${total_rating || ''}</p>
  <p class="film-card__info">
    <span class="film-card__year">${getYear(date)}</span>
    <span class="film-card__duration">${getHoursAndMinutes(runtime)}</span>
    <span class="film-card__genre">${genre[0] || ''}</span>
  </p>
  <img src=${poster || DEFAULT_POSTER} alt="" class="film-card__poster">
  <p class="film-card__description">${cutOffDescription(description)}</p>
  <a class="film-card__comments">${comments.length} comments</a>
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${makeItemActive(watchlist)}" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${makeItemActive(already_watched)}" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite ${makeItemActive(favorite)}" type="button">Mark as favorite</button>
  </div>
</article>`;
