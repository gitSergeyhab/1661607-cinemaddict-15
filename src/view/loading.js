import Abstract from './abstract.js';

export default class Loading extends Abstract {
  constructor(empty = false){
    super();
    this._empty = empty;
  }

  getTemplate() {
    return this._empty ? '' : `<section class="films-list">
    <h2 class="films-list__title">Loading...</h2>
  </section>`;
  }
}
