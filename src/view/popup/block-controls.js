import {control} from './control.js';
import {connectElements} from '../../util.js';

const dataControls = [
  {classActive: '', id: 'watchlist', content: 'Add to watchlist'},
  {classActive: 'film-details__control-button--active', id: 'watched', content: 'Already watched'},
  {classActive: '', id: 'favorite', content: 'Add to favorites'},
];

export const blockControls = () => `
  <section class="film-details__controls">
    ${connectElements(dataControls, control)}
  </section>`;
