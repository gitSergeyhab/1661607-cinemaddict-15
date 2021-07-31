import {getFullDate} from '../../util.js';

export const createComment = ({id, author, comment, date, emotion}) => `
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
