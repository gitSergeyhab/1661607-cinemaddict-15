import FilmPopup from './view/popup/film-popup.js';
import Comment from './view/popup/comment.js';

import {
  render
} from './utils/dom-utils.js';
import {
  RenderPosition
} from './constants.js';
import {
  footer
} from './dom-elements.js';


const SELECTOR_POPUP = 'section.film-details';
const SELECTOR_CLOSE_POPUP = '.film-details__close-btn';


const renderListToContainer = (container, className, list = []) => list.forEach((item) => container.append(new className(item).getElement()));

const closePopup = (popup) => {
  popup.remove();
  document.body.classList.remove('hide-overflow');
};

const findOpenPopup = () => document.querySelector(SELECTOR_POPUP); //ищет незакрытый попап

export const openPopup = (films, id) => {

  if (findOpenPopup()) {
    closePopup(findOpenPopup()); //удаляет незакрытый попап
  }

  const mockFilm = films.find((film) => film.id === +id);
  const filmPopup = new FilmPopup(mockFilm);
  const filmPopupElement = filmPopup.getElement();

  const btnClose = filmPopupElement.querySelector(SELECTOR_CLOSE_POPUP);
  btnClose.addEventListener('click', () => closePopup(filmPopupElement));
  document.body.classList.add('hide-overflow');

  render(footer, filmPopupElement, RenderPosition.AFTER_END);

  renderListToContainer(filmPopup.getContainer(), Comment, mockFilm.comments);
};
