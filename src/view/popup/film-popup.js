import {createBlockFilmInfo} from './block-film-info.js';
import {createBlockControls} from './block-controls.js';
import {createBlockComments} from './block-comments.js';
import {allFilms} from '../../fake-data.js';


export const createFilmPopup = () => `
  <section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        ${createBlockFilmInfo(allFilms[0])}
        ${createBlockControls()}
      </div>
      ${createBlockComments()}
    </form>
  </section>`;
