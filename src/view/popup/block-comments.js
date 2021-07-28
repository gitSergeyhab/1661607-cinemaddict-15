import {commentsTitle} from './comments-title.js';
import {comment} from './comment.js';
import {connectElements} from '../../util.js';
import {comments} from '../../fake-data.js';
import { newComment } from './new-comment.js';


export const blockComments = () => `
  <div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
      ${commentsTitle(comments.length)}
      <ul class="film-details__comments-list">
        ${connectElements(comments, comment)}
      </ul>
      ${newComment()}
    </section>
  </div>`;

