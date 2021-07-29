import {createProfile} from './view/profile.js';

import {createMenu} from './view/menu/menu.js';
import {createNavigationItem} from './view/menu/navigation-item.js';
import {createSortButton} from './view/menu/sort-button.js';
import {createFilmsSections} from './view/films/films.js';
import {createFilmCard} from './view/films/film-card.js';
import {createShowMoreBtn} from './view/films/show-more-btn.js';

import {createFilmPopup} from './view/popup/film-popup.js';
import {createBlockFilmInfo} from './view/popup/block-film-info.js';
import {createGenreBlock} from './view/popup/popup-genre.js';
import {createBlockComments} from './view/popup/block-comments.js';
import {createControl} from './view/popup/control.js';
import {createComment} from './view/popup/comment.js';

import {allFilms, topFilms, mostFilms, comments} from './fake-data.js';
import {renderAll} from './util.js';


const Ratings = {
  nobody: '',
  novice: 'Novice',
  fan: 'Fan',
  movieBuff: 'Movie Buff',
};

const dataSortItems = ['Sort by default', 'Sort by date', 'Sort by rating'];

const dataNavItems = [
  {href: '#watchlist', name: 'Watchlist', count: 13},
  {href: '#history', name: 'History', count: 4},
  {href: '#favorites', name: 'Favorites', count: 8},
];

const dataControls = [
  {classActive: '', id: 'watchlist', content: 'Add to watchlist'},
  {classActive: 'film-details__control-button--active', id: 'watched', content: 'Already watched'},
  {classActive: '', id: 'favorite', content: 'Add to favorites'},
];

const RenderPosition = {
  header: document.querySelector('header.header'),
  main: document.querySelector('main.main'),
  footer: document.querySelector('footer.footer'),
};

const render = (container, htmlText, place = 'beforeend') => container.insertAdjacentHTML(place, htmlText);

// header
render(RenderPosition.header, createProfile(Ratings.movieBuff));

//main
//menu
render(RenderPosition.main, createMenu());
const mainNavigationItems = RenderPosition.main.querySelector('.main-navigation__items');
render(mainNavigationItems, renderAll(dataNavItems, createNavigationItem));
const sort = RenderPosition.main.querySelector('.sort');
render(sort, renderAll(dataSortItems, createSortButton));

// film block
render(RenderPosition.main, createFilmsSections());
const [allFilmsContainer, topFilmsContainer, mostFilmsContainer] = RenderPosition.main.querySelectorAll('.films-list__container');
render(allFilmsContainer, renderAll(allFilms, createFilmCard));
render(allFilmsContainer, createShowMoreBtn(), 'afterend');
render(topFilmsContainer, renderAll(topFilms, createFilmCard));
render(mostFilmsContainer, renderAll(mostFilms, createFilmCard));

//popup
render(RenderPosition.footer, createFilmPopup(), 'afterend');
const popup = document.querySelector('.film-details');
const controls = popup.querySelector('.film-details__controls');
const filmPopupContainer = popup.querySelector('.film-details__top-container');
render(controls, createBlockFilmInfo(allFilms[0]), 'beforebegin');
const genreBlock = filmPopupContainer.querySelector('.js-genres');
render(genreBlock, renderAll(allFilms[0].genres, createGenreBlock));
render(controls, renderAll(dataControls, createControl));

render(filmPopupContainer, createBlockComments(comments.length));
const commentsList = popup.querySelector('.film-details__comments-list');
render(commentsList, renderAll(comments, createComment));
