import Abstract from './abstract.js';

export default class Loading extends Abstract {
  constructor(isLoading = false){
    super();
    this._isLoading = isLoading;
  }

  getTemplate() {
    return this._isLoading ? '' : '<section class="films-list"> <h2 class="films-list__title">Loading...</h2></section>';
  }
}
