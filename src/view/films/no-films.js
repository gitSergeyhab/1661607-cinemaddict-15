import Abstract from '../abstract.js';


const createNoFilm = (message) => `
<h2 class="films-list__title">${message}</h2>
`;

export default class NoFilms extends Abstract{
  constructor(filter) {
    super();
    this._filter = filter;
  }

  getTemplate() {
    return createNoFilm(this._filter);
  }
}

