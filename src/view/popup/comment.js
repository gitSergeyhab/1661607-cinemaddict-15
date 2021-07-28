export const createComment = ({srcEmoji, content, username, date}) => `
  <li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src=${srcEmoji} width="55" height="55" alt="emoji-smile">
    </span>
    <div>
      <p class="film-details__comment-text">${content}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${username}</span>
        <span class="film-details__comment-day">${date}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`;
