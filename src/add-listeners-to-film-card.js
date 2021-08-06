import {
  openPopup
} from './open-popup.js';


const TITLE_SELECTOR = '.film-card__title';
const POSTER_SELECTOR = '.film-card__poster';
const COMMENTS_SELECTOR = '.film-card__comments';


export const addListenersToFilmCard = (films, element) => {
  const id = element.dataset.filmId;

  const title = element.querySelector(TITLE_SELECTOR);
  const poster = element.querySelector(POSTER_SELECTOR);
  const commentsBlock = element.querySelector(COMMENTS_SELECTOR);

  title.addEventListener('click', () => openPopup(films, id));
  poster.addEventListener('click', () => openPopup(films, id));
  commentsBlock.addEventListener('click', () => openPopup(films, id));
};
