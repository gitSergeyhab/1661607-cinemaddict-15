import {createProfile} from './view/profile.js';

import {createMenu} from './view/menu.js';
import {createFilmsSections} from './view/films/films.js';
import {createMainFilmsBlock} from './view/films/main-films-block.js';
import {createExtraFilmsBlock} from './view/films/extra-films-block.js';
import {createFilmCard} from './view/films/film-card.js';
import {createShowMoreBtn} from './view/films/show-more-btn.js';

// import {createFilmPopup} from './view/popup/film-popup.js';
// import {createBlockFilmInfo} from './view/popup/block-film-info.js';
// import {createBlockComments} from './view/popup/block-comments.js';
// import {createComment} from './view/popup/comment.js';

// import {allFilms, topFilms, popFilms, comments, menuData} from './fake-data.js';
// import {menuData} from './fake-data.js';

import {renderAll} from './util.js';

import {mockFilms} from './mock.js';

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
// const footer = document.querySelector('footer.footer');

const filmCounts = {
  first: 0,
  last: 5,
  plus: 5,
};

// header
render(header, createProfile(Rating.MOVIE_BUFF));

//menu
const menuData = {
  watchlistLength: mockFilms.filter((film) => film.user_details.watchlist).length,
  historyLength: mockFilms.filter((film) => film.user_details.already_watched).length,
  favoritestLength: mockFilms.filter((film) => film.user_details.favorite).length,
};

render(main, createMenu(menuData));

// film block
render(main, createFilmsSections());
const filmSection = main.querySelector('.films');
render(filmSection, createMainFilmsBlock());
render(filmSection, createExtraFilmsBlock('Top rated'));
render(filmSection, createExtraFilmsBlock('Most commented'));
const [allFilmsContainer, topFilmsContainer, popFilmsContainer] = filmSection.querySelectorAll('.films-list__container');
const renderMainFilms = () => render(allFilmsContainer, renderAll(mockFilms.slice(filmCounts.first, filmCounts.last), createFilmCard));
renderMainFilms();
render(allFilmsContainer, createShowMoreBtn(), RenderPosition.AFTER_END);
const topFilms = mockFilms.slice().sort((a, b) => (b.film_info.total_rating || 0) - (a.film_info.total_rating || 0)).slice(0, 2);
render(topFilmsContainer, renderAll(topFilms, createFilmCard));
const popFilms = mockFilms.slice().sort((a, b) => b.comments.length - a.comments.length).slice(0, 2);
render(popFilmsContainer, renderAll(popFilms, createFilmCard));

//popup
// render(footer, createFilmPopup(), RenderPosition.AFTER_END);
// const popup = document.querySelector('.film-details');
// const controls = popup.querySelector('.film-details__controls');
// const filmPopupContainer = popup.querySelector('.film-details__top-container');
// render(controls, createBlockFilmInfo(allFilms[0]), RenderPosition.BEFORE_BEGIN);

// render(filmPopupContainer, createBlockComments(comments.length));
// const commentsList = popup.querySelector('.film-details__comments-list');
// render(commentsList, renderAll(comments, createComment));


const btnShowMore = filmSection.querySelector('.films-list__show-more');
btnShowMore.addEventListener('click', () => {
  filmCounts.first += filmCounts.plus;
  filmCounts.last += filmCounts.plus;
  renderMainFilms();
  if (filmCounts.last >= mockFilms.length) {
    btnShowMore.style.display = 'none';
  }
});
