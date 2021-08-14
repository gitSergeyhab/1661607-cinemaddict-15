import Abstract from '../abstract.js';

const EmptyResultMessage = {
  ALL: 'There are no movies in our database',
  WATCH_LIST: 'There are no movies to watch now',
  HISTORY: 'There are no watched movies now',
  FAVORITE: 'There are no favorite movies now',
};

const createNoFilm = (filter) => `
<h2 class="films-list__title">${EmptyResultMessage[filter]}</h2>
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

