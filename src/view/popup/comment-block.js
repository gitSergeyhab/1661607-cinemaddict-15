import Smart from '../smart.js';
import he from 'he';
import {humanizeDate} from '../../utils/date-time-utils.js';


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
  `;

const createCommentsBlock = ({hasComments, addedEmoji, addedComment, comments}) => `
  <section class="film-details__comments-wrap">
    <h3 class="film-details__comments-title ${hasComments ? '' : 'visually-hidden'}">
      Comments <span class="film-details__comments-count">${comments.length}</span>
    </h3>

    <ul class="film-details__comments-list">
      ${comments.map(createComment).join('\n')}
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
  </section>`;


export default class CommentBlock extends Smart {
  constructor(comments = []) {
    super();
    this._state = CommentBlock.parseCommentsToState(comments);

    this._clickEmojiHandler = this._clickEmojiHandler.bind(this);
    this._commentInputHandler = this._commentInputHandler.bind(this);

    this._deleteCommentHandler = this._deleteCommentHandler.bind(this);
    this._keyDownCtrlEnterHandler = this._keyDownCtrlEnterHandler.bind(this);

    this._setEmojiListener();
    this._setCommentListener();
  }

  getTemplate() {
    return createCommentsBlock(this._state);
  }

  updateElement() {
    const scrollTop = this.getElement().scrollTop;
    super.updateElement();
    this.getElement().scrollTop = scrollTop;
  }

  reset(comment) {
    this.updateState(CommentBlock.parseCommentsToState(comment));
  }

  _restoreHandlers() {
    this._setCommentListener();
    this._setEmojiListener();

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


  _deleteCommentHandler(evt) {
    evt.preventDefault();
    evt.target.disabled = true;
    evt.target.textContent = 'Deleting...';
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
      this.updateState({}); // без этого повторное добавление оффлайн не работает
      document.querySelector('.film-details__comment-input').disabled = true;
    }
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


  static parseCommentsToState(comments) {
    return {comments, addedComment: null, addedEmoji: null, hasComments: comments.length > 0};
  }

  static parseStateToComments(state) {
    delete state.addedComment;
    delete state.addedEmoji;
    delete state.hasComments;
    return state;
  }
}
