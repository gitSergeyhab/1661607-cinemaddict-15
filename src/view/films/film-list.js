import {filmsListTitle} from './films-list-title.js';
import {filmCard} from './film-card.js';
import {connectElements} from '../../util.js';

export const filmList = (listFeatures, dataFilms, btn) => `
  <section class="films-list ${listFeatures.extra}">
    ${filmsListTitle(listFeatures)}
    <div class="films-list__container">
    ${connectElements(dataFilms, filmCard)}
    </div>
    ${btn}
  </section>`;
