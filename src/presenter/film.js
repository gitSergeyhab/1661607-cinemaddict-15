import dayjs from 'dayjs';

import FilmCard from '../view/films/film-card.js';
import FilmPopup from '../view/popup/film-popup.js';
import CommentBlock from '../view/popup/comment-block.js';

import {render, remove} from '../utils/dom-utils.js';
import {UserAction, UpdateType, Mode} from '../constants.js';


const CLASS_HIDE_SCROLL = 'hide-overflow';
const ESCAPE = 'Escape';
const CARD_CLICK_CLASSES =  ['film-card__title', 'film-card__poster', 'film-card__comments'];

export default class Film {
  constructor(filmsContainer, changeData, commentsModel, api, openedFilmId) {
    this._filmsContainer = filmsContainer;
    this._changeData = changeData;
    this._commentsModel = commentsModel;
    this._api = api;
    this._openedFilmId = openedFilmId;

    this._mode = Mode.DEFAULT; // отслеживает отрендерен ли попап

    this._filmCardComponent = null;
    this._filmPopupComponent = null;
    this._commentBlock = null;

    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
    this._handleClosePopupClick = this._handleClosePopupClick.bind(this);

    this._handleAnyFilmCardClick = this._handleAnyFilmCardClick.bind(this);

    this._handleWatchListClick = this._handleWatchListClick.bind(this);
    this._handleHistoryClick = this._handleHistoryClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);

    this._handleDeleteComment = this._handleDeleteComment.bind(this);
    this._handleAddComment = this._handleAddComment.bind(this);
  }


  init(film, modeRender = Mode.DEFAULT) {
    this._film = film;
    this._modeRender = modeRender;

    this._filmCardComponent = new FilmCard(film);
    this._filmPopupComponent = new FilmPopup(film);

    this._filmCardComponent.setOpenPopupClickHandler(this._handleFilmCardClick);
    this._filmCardComponent.setWatchListClickHandler(this._handleWatchListClick);
    this._filmCardComponent.setHistoryClickHandler(this._handleHistoryClick);
    this._filmCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    this._filmPopupComponent.setClosePopupClickHandler(this._handleClosePopupClick);
    this._filmPopupComponent.setWatchListClickHandler(this._handleWatchListClick);
    this._filmPopupComponent.setHistoryClickHandler(this._handleHistoryClick);
    this._filmPopupComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    switch (this._modeRender) {
      case Mode.ALL: // рендерит и карточку и незакрытый попап
        render(this._filmsContainer, this._filmCardComponent);
        this._renderPopup();
        return;
      case Mode.POPUP: // тоько незакрытый попап
        this._renderPopup();
        return;
      default: // карточки без попапа
        render(this._filmsContainer, this._filmCardComponent);
    }
  }

  destroy() {
    remove(this._filmCardComponent);
    remove(this._filmPopupComponent);
  }


  _getApiComments() {
    this._api.getComments(this._film.id)
      .then((comment) => this._commentsModel.comments = comment)
      .then(() => this._renderCommentBlock());
  }

  _closePopup() {
    remove(this._commentBlock);

    if (this._mode !== Mode.DEFAULT) {
      this._openedFilmId[0] = null;
      document.body.classList.remove(CLASS_HIDE_SCROLL);

      document.removeEventListener('keydown', this._handleEscKeyDown);
      document.removeEventListener('click', this._handleAnyFilmCardClick);

      this._filmPopupComponent.getElement().remove();
      this._mode = Mode.DEFAULT;
    }
  }

  _renderCommentBlock() {
    const commentsContainer = this._filmPopupComponent.getElement().querySelector('.film-details__bottom-container');
    this._commentBlock = new CommentBlock(this._commentsModel.comments);

    this._commentBlock.setDeleteCommentHandler(this._handleDeleteComment);
    this._commentBlock.setAddCommentHandler(this._handleAddComment);

    render(commentsContainer, this._commentBlock);
    this._commentBlock.reset(this._commentsModel.comments);
  }

  _renderPopup() {
    this._openedFilmId[0] = this._film.id;
    this._getApiComments();

    document.addEventListener('keydown', this._handleEscKeyDown);
    document.addEventListener('click', this._handleAnyFilmCardClick);

    document.body.classList.add(CLASS_HIDE_SCROLL);
    render(document.body, this._filmPopupComponent);
    this._mode = Mode.POPUP;
  }


  _handleClosePopupClick() {
    this._closePopup();
  }

  _handleEscKeyDown(evt) {
    if (evt.key === ESCAPE) {
      this._closePopup();
    }
  }

  _handleAnyFilmCardClick(evt) {
    const target = evt.target;
    if (target && CARD_CLICK_CLASSES.some((className) => target.classList.contains(className))) {
      if (this._mode === Mode.POPUP) {
        this._closePopup();
      }
    }
  }

  _handleFilmCardClick() {
    setTimeout(() => this._renderPopup(), 0); // чтоб рендерился после _closePopup()
  }

  _handleWatchListClick() {
    this._changeData(UserAction.UPDATE_FILM, UpdateType.PATCH,
      {...this._film, userDetails: {...this._film.userDetails, watchList: !this._film.userDetails.watchList}},
    );
  }

  _handleHistoryClick() {
    this._changeData(UserAction.UPDATE_FILM, UpdateType.PATCH,
      {...this._film, userDetails: {
        ...this._film.userDetails,
        alreadyWatched: !this._film.userDetails.alreadyWatched,
        watchingDate: this._film.userDetails.alreadyWatched ? null : dayjs().format('YYYY-MM-DD'),
      }},
    );
  }

  _handleFavoriteClick() {
    this._changeData(UserAction.UPDATE_FILM, UpdateType.PATCH,
      {...this._film, userDetails: {...this._film.userDetails, favorite: !this._film.userDetails.favorite}},
    );
  }

  _handleDeleteComment(commentId) {
    this._changeData(UserAction.DELETE_COMMENT, UpdateType.PATCH, commentId, this._film);
  }

  _handleAddComment(value, emotion) {
    const comment = value.trim();
    if (!comment || !emotion) {
      return;
    }

    this._changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      {comment, emotion},
      this._film,
    );
  }
}
