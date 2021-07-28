import {blockFilmInfo} from './block-film-info.js';
import {blockControls} from './block-controls.js';
import {blockComments} from './block-comments.js';
import {allFilms} from '../../fake-data.js';


export const popup = () => `
  <section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        ${blockFilmInfo(allFilms[0])}
        ${blockControls()}
      </div>
      ${blockComments()}
    </form>
  </section>`;
