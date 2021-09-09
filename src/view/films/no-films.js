import Abstract from '../abstract.js';


export default class NoFilms extends Abstract{
  constructor(filter) {
    super();
    this._filter = filter;
  }

  getTemplate() {
    return `<h2 class="films-list__title">${this._filter}</h2>`;
  }
}
