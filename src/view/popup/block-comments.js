import {createCommentsTitle} from './comments-title.js';
import {createComment} from './comment.js';
import {renderAll} from '../../util.js';
import {comments} from '../../fake-data.js';
import {createNewComment} from './new-comment.js';


export const createBlockComments = () => `
  <div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
      ${createCommentsTitle(comments.length)}
      <ul class="film-details__comments-list">
        ${renderAll(comments, createComment)}
      </ul>
      ${createNewComment()}
    </section>
  </div>`;

