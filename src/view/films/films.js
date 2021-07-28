import {filmList} from './film-list.js';
import {showMoreBtn} from './show-more-btn.js';
import {allFilms, topFilms, mostFilms} from '../../fake-data.js';

const listFeatures = [
  {title: '', hiddenClass: 'visually-hidden', extra: ''},
  {title: 'Top rated', hiddenClass: '', extra: 'films-list--extra'},
  {title: 'Most commented', hiddenClass: '', extra: 'films-list--extra'},
];

export const films = () => `
  <section class="films">
    ${filmList(listFeatures[0], allFilms, showMoreBtn())}
    ${filmList(listFeatures[1], topFilms, '')}
    ${filmList(listFeatures[2], mostFilms, '')}
  </section>`;
