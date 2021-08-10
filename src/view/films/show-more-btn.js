import Abstract from '../abstract.js';


export default class BtnShowMore extends Abstract {
  constructor() {
    super();
    this._ckickHandler = this._ckickHandler.bind(this);
  }

  getTemplate() {
    return '<button class="films-list__show-more">Show more</button>';
  }

  _ckickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setClickHandler(cb) {
    this._callback.click = cb;
    this.getElement().addEventListener('click', this._ckickHandler);
  }
}
