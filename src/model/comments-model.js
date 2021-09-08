import AbstractObserver from './abstract-observer.js';

export default class CommentsModel extends AbstractObserver{
  constructor() {
    super();
    this._comments = [];
  }

  set comments(commentList) {
    this._comments = commentList.slice();
  }

  get comments() {
    return this._comments;
  }

  addComment(updateType, update) {
    this._comments = [ ...this._comments, update ];
    this._notify(updateType, update);
  }

  deleteComment(updateType, id) {
    const index = this._comments.findIndex((comment) => comment.id === id);
    this._comments = index === -1 ? this._comments : [ ...this._comments.slice(0, index), ...this._comments.slice(index + 1) ];
    this._notify(updateType);
  }
}
