import Abstract from '../abstract.js';
import {
  getHoursAndMinutes,
  getDayMonthYear
} from '../../utils/date-time-utils.js';
import {
  DEFAULT_POSTER,
  ActiveClass
} from '../../constants.js';
import {getListWithoutNull} from '../../utils/utils.js';
import {renderAll} from '../../utils/dom-utils.js';


const makeButtonActive = (value) => value ? ActiveClass.POPUP : '';

const getGenre = (genre) => `<span class="film-details__genre">${genre}</span>`;


const createFilmPopup = ({
  id,
  comments,
  filmInfo: {
    title, alternativeTitle, ageRating, director, writers, actors, totalRating, poster, runtime, genre, description,
    release: {date, releaseCountry},
  },
  userDetails: {
    watchList, alreadyWatched, favorite,
  },
}) => `
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
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director || ''}</td>
              </tr>

              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${getListWithoutNull(writers)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${getListWithoutNull(actors)}</td>
              </tr>

              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${getDayMonthYear(date)}</td>
              </tr>

              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${getHoursAndMinutes(runtime)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${releaseCountry || ''}</td>
              </tr>

              <tr class="film-details__row">
                <td class="film-details__term"> ${genre && genre.length > 1 ? 'Genres' : 'Genre' }</td>
                <td class="film-details__cell js-genres">${renderAll(genre, getGenre)}
                </td>
              </tr>
            </table>

            <p class="film-details__film-description">
              ${description || ''}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          <button type="button" class="film-details__control-button film-details__control-button--watchlist ${makeButtonActive(watchList)}" id="watchlist" name="watchlist">Add to watchlist</button>
          <button type="button" class="film-details__control-button film-details__control-button--watched ${makeButtonActive(alreadyWatched)}" id="watched" name="watched">Already watched</button>
          <button type="button" class="film-details__control-button film-details__control-button--favorite ${makeButtonActive(favorite)}" id="favorite" name="favorite">Add to favorites</button>
        </section>
      </div>

      <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">
          Comments <span class="film-details__comments-count">${comments.length}</span>
        </h3>

        <ul class="film-details__comments-list">
        </ul>
        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label"></div>
          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>
          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`;


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
    return createFilmPopup(this._film);
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
}
