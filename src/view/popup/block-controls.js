import {createControl} from './control.js';
import {renderAll} from '../../util.js';

const dataControls = [
  {classActive: '', id: 'watchlist', content: 'Add to watchlist'},
  {classActive: 'film-details__control-button--active', id: 'watched', content: 'Already watched'},
  {classActive: '', id: 'favorite', content: 'Add to favorites'},
];

export const createBlockControls = () => `
  <section class="film-details__controls">
    ${renderAll(dataControls, createControl)}
  </section>`;
