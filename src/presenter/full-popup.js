import FilmPopup from '../view/popup/film-popup.js';
import Comment from '../view/popup/comment.js';

import {render} from '../utils/dom-utils.js';


const SELECTOR_COMMENT_CONTAINER = '.film-details__comments-list';

// хотя, это, наверно, все-таки не совсем презентер...
export default class FullPopup {
  constructor(film) {
    this._film = film;
    this._filmPopupComponent = new FilmPopup(film);
  }

  getPopupWithComments() {
    const commentContainer = this._filmPopupComponent.getElement().querySelector(SELECTOR_COMMENT_CONTAINER);
    this._renderComments(commentContainer, this._film.comments);
    return this._filmPopupComponent;
  }

  _renderComment(container, comment) {
    const commentItem = new Comment(comment);
    render(container, commentItem);
  }

  _renderComments(container, comments) {
    comments.forEach((comment) => this._renderComment(container, comment));
  }
}
