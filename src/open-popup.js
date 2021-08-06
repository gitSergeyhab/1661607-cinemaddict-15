import FilmPopup from './view/popup/film-popup.js';
import Comment from './view/popup/comment.js';

import {
  render
} from './utils/dom-utils.js';

import {
  RenderPosition
} from './constants.js';
import {
  mockFilms
} from './main.js';
import {
  footer
} from './dom-elements.js';


const renderListToContainer = (container, className, list = []) => list.forEach((item) => container.append(new className(item).getElement()));

const closePopup = (popup) => popup.remove();

const findOpenPopup = () => document.querySelector('section.film-details'); //ищет незакрытый попап

export const openPopup = (id, evt) => {
  evt.preventDefault();

  if (findOpenPopup()) {
    closePopup(findOpenPopup()); //удаляет незакрытый попап
  }

  const mockFilm = mockFilms.find((film) => film.id === +id);
  const filmPopup = new FilmPopup(mockFilm);
  const filmPopupElement = filmPopup.getElement();

  const btnClose = filmPopupElement.querySelector('.film-details__close-btn');
  btnClose.addEventListener('click', () => closePopup(filmPopupElement));

  render(footer, filmPopupElement, RenderPosition.AFTER_END);
  renderListToContainer(filmPopup.getContainer(), Comment, mockFilm.comments);
};
