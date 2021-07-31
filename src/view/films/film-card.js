/* eslint-disable camelcase*/ // в тз написано, что данные с сервера будут приходить в snake_case, так что  вот...
import dayjs from 'dayjs';

const CLASS_CONTROL_ACTIVE = 'film-card__controls-item--active';
const DEFAULT_POSTER = 'https://cdn.fishki.net/upload/post/2017/04/09/2263249/8-10.jpg';

const getHoursAndMinutes = (minutes) => minutes ? `${Math.floor(minutes/60)}h ${minutes % 60}m` : '';

const getYear = (dateStamp) => dateStamp ? dayjs(dateStamp).format('YYYY') : '';

const makeActive = (param) => param ? CLASS_CONTROL_ACTIVE : '';

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
  <p class="film-card__description">${description || ''}</p>
  <a class="film-card__comments">${comments.length} comments</a>
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${makeActive(watchlist)}" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${makeActive(already_watched)}" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite ${makeActive(favorite)}" type="button">Mark as favorite</button>
  </div>
</article>`;
