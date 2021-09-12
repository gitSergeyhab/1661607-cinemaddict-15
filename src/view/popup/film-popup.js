import Abstract from '../abstract.js';

import {getStringTime, getDayMonthYear} from '../../utils/date-time-utils.js';
import {DEFAULT_POSTER, ActiveClass} from '../../constants.js';
import {getListWithoutNull} from '../../utils/utils.js';
import {renderAll} from '../../utils/dom-utils.js';


const makeButtonActive = (value) => value ? ActiveClass.POPUP : '';


const createPopupButton = (btn) =>`
<button type="button"
  class="film-details__control-button film-details__control-button--${btn.name} ${makeButtonActive(btn.active)}"
  id="${btn.name}" name="${btn.name}">
  ${btn.shownTitle}
</button>`;


const createPopupRow = (field) => `
<tr class="film-details__row">
  <td class="film-details__term">${field.name}</td>
  <td class="film-details__cell">${field.value}</td>
</tr>`;


const getGenre = (genre) => `<span class="film-details__genre">${genre}</span>`;

const createFilmPopup = ({
  id,
  filmInfo: {
    title, alternativeTitle, ageRating, director, writers, actors, totalRating, poster, runtime, genre, description,
    release: {date, releaseCountry},
  },
  userDetails: {
    watchList, alreadyWatched, favorite,
  },
}) => {

  const tableValues = { // думаю, это уже нельзя назвать перечислением...
    DIRECTOR: {name: 'Director', value: director || ''},
    WRITERS: {name: 'Writers', value: getListWithoutNull(writers)},
    ACTORS: {name: 'Actors', value: getListWithoutNull(actors)},
    RELEASE_DATE: {name: 'Release Date', value: getDayMonthYear(date)},
    RUNTIME: {name: 'Runtime', value: getStringTime(runtime)},
    COUNTRY: {name: 'Country', value: releaseCountry || ''},
    GENRE: {name: genre && genre.length > 1 ? 'Genres' : 'Genre', value: renderAll(genre, getGenre)},
  };

  const buttonValues = {
    WATCH_LIST: {name: 'watchlist', shownTitle: 'Add to watchlist', active: watchList} ,
    WATCHED: {name: 'watched', shownTitle: 'Already watched', active: alreadyWatched},
    FAVORITE: {name: 'favorite', shownTitle: 'Add to favorites', active: favorite},
  };


  return `
  <section class="film-details data-film-id="${id}">
    <form class="film-details__inner" action="" method="get">

      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>

        <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src=${poster || DEFAULT_POSTER} alt=${title}>
              <p class="film-details__age">${ageRating || ''}</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title || ''}</h3>
                  <p class="film-details__title-original">Original: ${alternativeTitle || ''}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${totalRating || ''}</p>
                </div>

              </div>
              <table class="film-details__table">
                ${Object.values(tableValues).map(createPopupRow).join('\n')}
              </table>

              <p class="film-details__film-description">
                ${description || ''}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            ${Object.values(buttonValues).map(createPopupButton).join('\n')}
          </section>
        </div>

        <div class="film-details__bottom-container">
      </div>
    </form>
  </section>`;
};


export default class FilmPopup extends Abstract {
  constructor(film) {
    super();
    this._film = film;

    this._closePopupClickHandler = this._closePopupClickHandler.bind(this);
    this._watchListClickHandler = this._watchListClickHandler.bind(this);
    this._historyClickHandler = this._historyClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmPopup(this._film, this._comments);
  }


  setClosePopupClickHandler(cb) {
    this._callback.closePopupClick = cb;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closePopupClickHandler);
  }

  setWatchListClickHandler(cb) {
    this._callback.watchListClick = cb;
    this.getElement().querySelector('.film-details__control-button--watchlist').addEventListener('click', this._watchListClickHandler);
  }

  setHistoryClickHandler(cb) {
    this._callback.historyClick = cb;
    this.getElement().querySelector('.film-details__control-button--watched').addEventListener('click', this._historyClickHandler);
  }

  setFavoriteClickHandler(cb) {
    this._callback.favoriteClick = cb;
    this.getElement().querySelector('.film-details__control-button--favorite').addEventListener('click', this._favoriteClickHandler);
  }


  _closePopupClickHandler(evt) {
    evt.preventDefault();
    this._callback.closePopupClick();
  }

  _watchListClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchListClick();
  }

  _historyClickHandler(evt) {
    evt.preventDefault();
    this._callback.historyClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }
}
