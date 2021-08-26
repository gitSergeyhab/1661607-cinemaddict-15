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
    // console.log(this._comments)
    this._comments = [...this._comments, update];
    // console.log(this._comments)

    this._notify(updateType, update);
  }

  delComment(updateType, update) {
    const index = this._comments.findIndex((item) => item.id === update.id);
    this._comments = index === -1 ? this._comments : [...this._comments.slice(0, index), ...this._comments.slice(index + 1)];
    this._notify(updateType/*, update*/);
  }
}
