import {createProfile} from './view/profile.js';

import {createMenu} from './view/menu.js';
import {createFilmsSections} from './view/films/films.js';
import {createMainFilmsBlock} from './view/films/main-films-block.js';
import {createExtraFilmsBlock} from './view/films/extra-films-block.js';
import {createFilmCard} from './view/films/film-card.js';
import {createShowMoreBtn} from './view/films/show-more-btn.js';

import {createFilmPopup} from './view/popup/film-popup.js';
import {createBlockFilmInfo} from './view/popup/block-film-info.js';
import {createBlockComments} from './view/popup/block-comments.js';
import {createComment} from './view/popup/comment.js';

import {allFilms, topFilms, popFilms, comments, menuData} from './fake-data.js';
import {renderAll} from './util.js';

// НИЧЕГО НЕ ИЗМЕНИЛОСЬ
const Rating = {
  NOBODY: '',
  NOTICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie Buff',
};

const RenderPosition = {
  BEFORE_BEGIN: 'beforebegin',
  BEFORE_END: 'beforeend',
  AFTER_BEGIN: 'afterbegin',
  AFTER_END: 'afterend',
};


const render = (container, htmlText, place = RenderPosition.BEFORE_END) => container.insertAdjacentHTML(place, htmlText);


const header = document.querySelector('header.header');
const main = document.querySelector('main.main');
const footer = document.querySelector('footer.footer');

// header
render(header, createProfile(Rating.MOVIE_BUFF));

//menu
render(main, createMenu(menuData));

// film block
render(main, createFilmsSections());
const filmSection = main.querySelector('.films');
render(filmSection, createMainFilmsBlock());
render(filmSection, createExtraFilmsBlock('Top rated'));
render(filmSection, createExtraFilmsBlock('Most commented'));
const [allFilmsContainer, topFilmsContainer, popFilmsContainer] = filmSection.querySelectorAll('.films-list__container');
render(allFilmsContainer, renderAll(allFilms, createFilmCard));
render(allFilmsContainer, createShowMoreBtn(), RenderPosition.AFTER_END);
render(topFilmsContainer, renderAll(topFilms, createFilmCard));
render(popFilmsContainer, renderAll(popFilms, createFilmCard));

//popup
render(footer, createFilmPopup(), RenderPosition.AFTER_END);
const popup = document.querySelector('.film-details');
const controls = popup.querySelector('.film-details__controls');
const filmPopupContainer = popup.querySelector('.film-details__top-container');
render(controls, createBlockFilmInfo(allFilms[0]), RenderPosition.BEFORE_BEGIN);

render(filmPopupContainer, createBlockComments(comments.length));
const commentsList = popup.querySelector('.film-details__comments-list');
render(commentsList, renderAll(comments, createComment));
