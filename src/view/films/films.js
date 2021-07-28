import {createFilmList} from './film-list.js';
import {createShowMoreBtn} from './show-more-btn.js';
import {allFilms, topFilms, mostFilms} from '../../fake-data.js';

const listFeatures = [
  {title: '', hiddenClass: 'visually-hidden', extra: ''},
  {title: 'Top rated', hiddenClass: '', extra: 'films-list--extra'},
  {title: 'Most commented', hiddenClass: '', extra: 'films-list--extra'},
];

export const createFilmsSections = () => `
  <section class="films">
    ${createFilmList(listFeatures[0], allFilms, createShowMoreBtn())}
    ${createFilmList(listFeatures[1], topFilms, '')}
    ${createFilmList(listFeatures[2], mostFilms, '')}
  </section>`;
