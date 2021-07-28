import {createFilmsListTitle} from './films-list-title.js';
import {createFilmCard} from './film-card.js';
import {renderAll} from '../../util.js';

export const createFilmList = (listFeatures, dataFilms, btn) => `
  <section class="films-list ${listFeatures.extra}">
    ${createFilmsListTitle(listFeatures)}
    <div class="films-list__container">
    ${renderAll(dataFilms, createFilmCard)}
    </div>
    ${btn}
  </section>`;
