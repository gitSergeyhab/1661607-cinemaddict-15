import {createProfile} from './view/profile.js';

import {createMenu} from './view/menu.js';
import {createFilmsSections} from './view/films/films.js';
import {createMainFilmsBlock} from './view/films/main-films-block.js';
import {createExtraFilmsBlock} from './view/films/extra-films-block.js';
import {createFilmCard} from './view/films/film-card.js';
import {createShowMoreBtn} from './view/films/show-more-btn.js';

import {createFilmPopup} from './view/popup/film-popup.js';
import {createComment} from './view/popup/comment.js';

import {renderAll} from './util.js';
import {Counts, getMockDataArr, createMockFilm, crippleData} from './mock.js';
import {LEN_ADDITIONAL_BLOCK} from './setup.js';


const Rating = {
  NOBODY: {name: '', count: -1},
  NOTICE: {name: 'Novice', count: 0},
  FAN: {name: 'Fan', count: 10},
  MOVIE_BUFF: {name: 'Movie Buff', count: 20},
};

const RenderPosition = {
  BEFORE_BEGIN: 'beforebegin',
  BEFORE_END: 'beforeend',
  AFTER_BEGIN: 'afterbegin',
  AFTER_END: 'afterend',
};

const filmCounts = {
  first: 0,
  last: 5,
  plus: 5,
};


const render = (container, htmlText, place = RenderPosition.BEFORE_END) => container.insertAdjacentHTML(place, htmlText);

const getRatingByWatched = (count) => {
  if (count > Rating.MOVIE_BUFF.count) {
    return Rating.MOVIE_BUFF.name;
  } else if (count > Rating.FAN.count) {
    return Rating.FAN.name;
  } else if (count > Rating.NOTICE.count) {
    return Rating.NOTICE.name;
  }
  return Rating.NOBODY.name;
};


const header = document.querySelector('header.header');
const main = document.querySelector('main.main');
const footer = document.querySelector('footer.footer');

const mockFilms = getMockDataArr(createMockFilm, Counts.FILM.MAX, Counts.FILM.MIN);

const useDetails = { // или это тоже перечисление ?
  watchlistLength: mockFilms.filter((film) => film.user_details.watchlist).length,
  historyLength: mockFilms.filter((film) => film.user_details.already_watched).length,
  favoritestLength: mockFilms.filter((film) => film.user_details.favorite).length,
};

for (let i=0; i<mockFilms.length; i++) {
  crippleData(mockFilms[i]); // испортить данные мэпом или фор-офом почему-то не получается
}

// header
render(header, createProfile(getRatingByWatched(useDetails.historyLength)));

//menu
render(main, createMenu(useDetails));

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
const popFilms = mockFilms.slice().sort((a, b) => b.comments.length - a.comments.length).slice(0, LEN_ADDITIONAL_BLOCK);
render(popFilmsContainer, renderAll(popFilms, createFilmCard));

//popup
render(footer, createFilmPopup(mockFilms[0]), RenderPosition.AFTER_END);
const commentsList = document.querySelector('.film-details__comments-list');
render(commentsList, renderAll(mockFilms[0].comments, createComment));

const statistic = footer.querySelector('.footer__statistics');
statistic.textContent = `${mockFilms.length} movies inside`;


const btnShowMore = filmSection.querySelector('.films-list__show-more');
btnShowMore.addEventListener('click', () => {
  filmCounts.first += filmCounts.plus;
  filmCounts.last += filmCounts.plus;
  renderMainFilms();
  if (filmCounts.last >= mockFilms.length) {
    btnShowMore.style.display = 'none';
  }
});
