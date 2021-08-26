import FilmCard from '../view/films/film-card.js';
import FilmPopup from '../view/popup/film-popup.js';

import {render, remove, replace} from '../utils/dom-utils.js';
import {UserAction, UpdateType} from '../constants.js';
import { getRandomInt } from '../utils/utils.js';



const SELECTOR_POPUP = 'section.film-details';
const CLASS_HIDE_SCROLL = 'hide-overflow';
const ESCAPE = 'Escape';

const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
  ALL: 'ALL',
};

const CARD_CLICK_CLASSES =  ['film-card__title', 'film-card__poster', 'film-card__comments']



export default class Film {
  constructor(filmsContainer, commentsModel, changeData, openedPopup) {//
    this._filmsContainer = filmsContainer;
    this._commentsModel = commentsModel;
    this._changeData = changeData;
    // this._changeMode = changeMode;//

    this._openedPopup = openedPopup;
    this._mode = Mode.DEFAULT; // отслеживает отрендерин ли попап (можно, наверно, и без него)

    this._filmCardComponent = null;
    this._filmPopupComponent = null;

    // привязать обработчики
    this._handlerFilmCardClick = this._handlerFilmCardClick.bind(this);//открывает попап
    this._handlerEscKeyDown = this._handlerEscKeyDown.bind(this);
    this._handlerClosePopupClick = this._handlerClosePopupClick.bind(this);

    this._handlerAnyFilmcardClick = this._handlerAnyFilmcardClick.bind(this); // закрывает попап при тыке на любую карточку

    this._handleWatchListClick = this._handleWatchListClick.bind(this);
    this._handleHistoryClick = this._handleHistoryClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);

    this._handleDeleteComment = this._handleDeleteComment.bind(this);
    this._handleAddComment = this._handleAddComment.bind(this);

  }

  init(film, modeRender = Mode.DEFAULT) {
    this._film = film;

    this._modeRender = modeRender;// Mode.DEFAULT - рендерит карточки // Mode.POPUP - незакрытый попап

    this._comments = this._getNeedComments();

    const prevFilmCardComponent = this._filmCardComponent;
    const prevFilmPopupComponent = this._filmPopupComponent;

    this._filmCardComponent = new FilmCard(film);

    this._filmPopupComponent = new FilmPopup(film, this._comments);

    // навесить обработчики
    this._filmCardComponent.setOpenPopupClickHandler(this._handlerFilmCardClick); // обработчик открытия попапа на карточку
    this._filmCardComponent.setWatchListClickHandler(this._handleWatchListClick);
    this._filmCardComponent.setHistoryClickHandler(this._handleHistoryClick);
    this._filmCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    this._filmPopupComponent.setClosePopupClickHandler(this._handlerClosePopupClick); // обработчик закрытия попапа на попап(кнопку)
    this._filmPopupComponent.setWatchListClickHandler(this._handleWatchListClick);
    this._filmPopupComponent.setHistoryClickHandler(this._handleHistoryClick);
    this._filmPopupComponent.setFavoriteClickHandler(this._handleFavoriteClick);



    this._filmPopupComponent.setDeleteCommentHandler(this._handleDeleteComment);
    this._filmPopupComponent.setAddCommentHandler(this._handleAddComment);

    //если создается
    if (prevFilmCardComponent === null || prevFilmPopupComponent === null) {
      if (this._modeRender === Mode.DEFAULT) { // если инициализируется для отрисовки списка
        render(this._filmsContainer, this._filmCardComponent);
        return;
      }

      if (this._modeRender === Mode.POPUP) { // если ... для отрисовки одного незакрытого попапа
        this._renderPopup();
        return;
      }
      // если незакрытый попап есть и в отрисоваемом списке
      render(this._filmsContainer, this._filmCardComponent);
      this._renderPopup();
      return;
    }

    //если изменяется
    replace(this._filmCardComponent, prevFilmCardComponent);
    replace(this._filmPopupComponent, prevFilmPopupComponent);

    remove(prevFilmCardComponent);
    remove(prevFilmPopupComponent);
  }

  destroy() {
    remove(this._filmCardComponent);
    remove(this._filmPopupComponent);
  }

  _getComments() {
    return this._commentsModel.comments;
  }

  _getNeedComments() {
    const comments = this._getComments();
    const needComments = comments.filter((comment) =>  this._film.comments.some((filmComment) => filmComment === comment.id));
    return needComments;
  }

  // _closePopup() {
  //   const popup = document.querySelector(SELECTOR_POPUP);
  //   if (popup) {
  //     popup.remove();
  //     document.body.classList.remove(CLASS_HIDE_SCROLL);
  //     document.removeEventListener('keydown', this._handlerEscKeyDown);
  //   }
  // }


  // resetView() {
  //   this._closePopup();
  // }

  _closePopup() {
    if (this._mode !== Mode.DEFAULT) {
      this._openedPopup[0] = null;
      document.body.classList.remove(CLASS_HIDE_SCROLL);
      document.removeEventListener('keydown', this._handlerEscKeyDown);
      document.removeEventListener('click', this._handlerAnyFilmcardClick);

      this._filmPopupComponent.getElement().remove();
      this._mode = Mode.DEFAULT;
    }
  }

  _renderPopup() {

    this._openedPopup[0] = this._film.id;

    document.addEventListener('keydown', this._handlerEscKeyDown);
    document.addEventListener('click', this._handlerAnyFilmcardClick);
    document.body.classList.add(CLASS_HIDE_SCROLL);
    render(document.body, this._filmPopupComponent);
    // this._changeMode()
    this._mode = Mode.POPUP;
    this._filmPopupComponent.reset(this._film); // нужно сбрасывать стэйт здесь: в _closePopup() сбрасывать нельзя - this.updateElement() не работает - ...
    // ... при повторном рендеринге родителя у this._filmPopupComponent.getElement уже нет, так как сам .getElement был удален при первом _closePopup()
  }

  // _renderPopup() {
  //   this._closePopup();
  //   document.addEventListener('keydown', this._handlerEscKeyDown);
  //   document.body.classList.add(CLASS_HIDE_SCROLL);
  //   render(document.body, this._filmPopupComponent);
  //   this._filmPopupComponent.reset(this._film); // нужно сбрасывать стэйт здесь: в _closePopup() сбрасывать нельзя - this.updateElement() не работает - ...
  //   // ... при повторном рендеринге родителя у this._filmPopupComponent.getElement уже нет, так как сам .getElement был удален при первом _closePopup()
  // }

  _handlerClosePopupClick() {
    this._closePopup();
  }

  _handlerEscKeyDown(evt) {
    if (evt.key === ESCAPE) {
      this._closePopup();
    }
  }


  _handlerAnyFilmcardClick(evt) {
    const target = evt.target;
    if (target && CARD_CLICK_CLASSES.some((clas) => target.classList.contains(clas))) {
      this._mode === Mode.POPUP ? this._closePopup() : null;
    }
  }

  _handlerFilmCardClick() {
    setTimeout(() => this._renderPopup(), 0); // чтоб рендерился после _closePopup()

  }

  _handleWatchListClick() {
    this._changeData(UserAction.UPDATE_FILM, UpdateType.MINOR,
      {...this._film, userDetails: {...this._film.userDetails, watchList: !this._film.userDetails.watchList}},
    );
  }

  _handleHistoryClick() {
    this._changeData(UserAction.UPDATE_FILM, UpdateType.MAJOR,
      {...this._film, userDetails: {...this._film.userDetails, alreadyWatched: !this._film.userDetails.alreadyWatched}}
    );
  }

  _handleFavoriteClick() {
    this._changeData(UserAction.UPDATE_FILM, UpdateType.MINOR,
      {...this._film, userDetails: {...this._film.userDetails, favorite: !this._film.userDetails.favorite}}
    );

  }

  _handleDeleteComment(id) {
    const сommentToDel = this._getComments().find((comment) => comment.id === id);
    this._changeData(UserAction.DELETE_COMMENT, UpdateType.PATCH,
      сommentToDel,
    );

    const leftComments = this._film.comments.filter((comment) => comment !== id);
    this._changeData(UserAction.UPDATE_FILM, UpdateType.MINOR,
      {...this._film, comments: leftComments},
    );
    console.log(сommentToDel)
  }


  _handleAddComment(value, emotion) {
    const comment = value.trim();
    if (!comment || !emotion) {
      return;
    }

    const id = Math.random();

    this._changeData(UserAction.ADD_COMMENT, UpdateType.PATCH,
      {id: id, comment, date: new Date(), emotion},
    );

    const comments = [...this._film.comments, id];
    this._changeData(UserAction.UPDATE_FILM, UpdateType.MINOR,
      {...this._film, comments: comments},
    );
    console.log(comment)
  }


}
