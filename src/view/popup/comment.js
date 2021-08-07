import {getFullDate} from '../../utils/date-time-utils.js';
import {createElement} from '../../utils/dom-utils.js';

const createComment = ({id,author,comment,date,emotion}) => `
  <li class="film-details__comment" data-comment-id=${id}>

    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emotion || 'smile'}.png" width="55" height="55" alt="emoji-smile">
    </span>

    <div>
      <p class="film-details__comment-text">${comment || ''}</p>

      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author || ''}</span>
        <span class="film-details__comment-day">${getFullDate(date)}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`;


export default class Comment {
  constructor(data) {
    this._data = data;
    this._element = null;
  }

  getTemplate() {
    return createComment(this._data);
  }

  getElement() {
    if(!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
