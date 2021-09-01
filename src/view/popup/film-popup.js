import Smart from '../smart.js';

import he from 'he';

import {getHoursAndMinutes, getDayMonthYear, humanizeDate} from '../../utils/date-time-utils.js';
import {DEFAULT_POSTER, ActiveClass} from '../../constants.js';
import {getListWithoutNull} from '../../utils/utils.js';
import {renderAll} from '../../utils/dom-utils.js';


const makeButtonActive = (value) => value ? ActiveClass.POPUP : '';

const getGenre = (genre) => `<span class="film-details__genre">${genre}</span>`;

const createComment = ({id,author,comment,date,emotion}) => `
  <li class="film-details__comment" data-comment-id=${id}>
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emotion || 'smile'}.png" width="55" height="55" alt="emoji-smile">
    </span>
    <div>
      <p class="film-details__comment-text">${he.encode(comment) || ''}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author || ''}</span>
        <span class="film-details__comment-day">${humanizeDate(date)}</span>
        <button class="film-details__comment-delete" data-id=${id}>Delete</button>
      </p>
    </div>
  </li>`;


const showEmoji = (emoji) => `
  <img src="images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">
  <input class="visually-hidden" name="selected-emoji" type="text" id="selected-emoji" value="${emoji}">
  `;  // не нашел в верстке никакого скрытого поля ввода, добавил от балды


const createFilmPopup = ({
  id,
  filmInfo: {
    title, alternativeTitle, ageRating, director, writers, actors, totalRating, poster, runtime, genre, description,
    release: {date, releaseCountry},
  },
  userDetails: {
    watchList, alreadyWatched, favorite,
  },
  hasComments, addedEmoji, addedComment,
}, comments) => `
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
        <h3 class="film-details__comments-title ${hasComments ? '' : 'visually-hidden'}">
          Comments <span class="film-details__comments-count">${comments.length}</span>
        </h3>

        <ul class="film-details__comments-list">
          ${comments.map((comment) => createComment(comment)).join('\n')}
        </ul>
        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">${addedEmoji ? showEmoji(addedEmoji) : ''}</div>
          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${addedComment || ''}</textarea>
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


export default class FilmPopup extends Smart {
  constructor(film, comments=[]) {
    super();
    this._state = FilmPopup.parseFilmToState(film);
    this._comments = comments;

    this._closePopupClickHandler = this._closePopupClickHandler.bind(this);
    this._watchListClickHandler = this._watchListClickHandler.bind(this);
    this._historyClickHandler = this._historyClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);

    this._clickEmojiHandler = this._clickEmojiHandler.bind(this);
    this._commentInputHandler = this._commentInputHandler.bind(this);

    this._deleteCommentHandler = this._deleteCommentHandler.bind(this);
    this._keyDownCtrlEnterHandler = this._keyDownCtrlEnterHandler.bind(this);

    this._setEmojiListener();
    this._setCommentListener();
  }

  getTemplate() {
    return createFilmPopup(this._state, this._comments);
  }

  updateElement() {
    const scrollTop = this.getElement().scrollTop;
    super.updateElement();
    this.getElement().scrollTop = scrollTop;
  }

  reset(film) {
    this.updateState(FilmPopup.parseFilmToState(film));
  }

  _restoreHandlers() {
    this._setCommentListener();
    this._setEmojiListener();

    this.setClosePopupClickHandler(this._callback.closePopupClick);
    this.setWatchListClickHandler(this._callback.watchListClick);
    this.setHistoryClickHandler(this._callback.historyClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);

    this.setDeleteCommentHandler(this._callback.deleteCommentClick);
    this.setAddCommentHandler(this._callback.addCommentSend);
  }

  _setCommentListener() {
    this.getElement().querySelector('.film-details__comment-input').addEventListener('input', this._commentInputHandler);
  }

  _setEmojiListener(){
    const emojiInputs = this.getElement().querySelectorAll('.film-details__emoji-item');
    emojiInputs.forEach((input) => input.addEventListener('click', this._clickEmojiHandler));
  }

  _clickEmojiHandler(evt) {
    evt.preventDefault();
    this.updateState({addedEmoji: evt.target.id.split('-')[1]});
  }

  _commentInputHandler(evt) {
    evt.preventDefault();
    this.updateState({addedComment: evt.target.value}, true);
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

  _deleteCommentHandler(evt) {
    evt.preventDefault();
    const id = evt.target.dataset.id;
    this._callback.deleteCommentClick(id);
  }

  _keyDownCtrlEnterHandler(evt) {
    const commentArea = this.getElement().querySelector('.film-details__comment-input');
    const emotion = this.getElement().querySelector('#selected-emoji');
    const value = commentArea.value.trim();
    if (evt.ctrlKey && evt.key === 'Enter' && value && commentArea === document.activeElement && emotion) {
      this._callback.addCommentSend(value, emotion.value);
      document.removeEventListener('keydown', this._keyDownCtrlEnterHandler);
    }
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

  setDeleteCommentHandler(cb) {
    this._callback.deleteCommentClick = cb;
    this.getElement().querySelectorAll('.film-details__comment-delete').forEach((delBtn) => {
      delBtn.addEventListener('click', this._deleteCommentHandler);
    });
  }

  setAddCommentHandler(cb) {
    this._callback.addCommentSend = cb;
    document.addEventListener('keydown', this._keyDownCtrlEnterHandler);
  }


  static parseFilmToState(film) {
    return {...film, addedComment: null, addedEmoji: null, hasComments: film.comments.length > 0};
  }

  static parseStateToFilm(state) {
    delete state.addedComment;
    delete state.addedEmoji;
    delete state.hasComments;
    return state;
  }
}
