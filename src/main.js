import {
  createProfile
} from './view/profile.js';

import {
  createMenu
} from './view/menu.js';
import {
  createFilmsSections
} from './view/films/films.js';
import {
  createMainFilmsBlock
} from './view/films/main-films-block.js';
import {
  createExtraFilmsBlock
} from './view/films/extra-films-block.js';
import {
  createFilmCard
} from './view/films/film-card.js';
import {
  createShowMoreBtn
} from './view/films/show-more-btn.js';

import {
  createFilmPopup
} from './view/popup/film-popup.js';
import {
  createComment
} from './view/popup/comment.js';
import {
  createFooterStatistic
} from './view/films/footer-statistic.js';

import {
  getRandomInt
} from './utils/utils.js';
import {
  renderAll
} from './utils/dom-utils.js';
import {
  COUNTS,
  createMockFilm
} from './mock.js';


// CONSTANTS

const ADDITIONAL_BLOCK_LENGTH = 2;

const Rating = {
  NOVICE: {
    name: 'Novice',
    count: 1,
  },
  FAN: {
    name: 'Fan',
    count: 11,
  },
  MOVIE_BUFF: {
    name: 'Movie Buff',
    count: 21,
  },
};

const RenderPosition = {
  BEFORE_BEGIN: 'beforebegin',
  BEFORE_END: 'beforeend',
  AFTER_BEGIN: 'afterbegin',
  AFTER_END: 'afterend',
};

const UserDetailFields = {
  WATCH_LIST: 'watchList',
  HISTORY: 'alreadyWatched',
  FAVORITE: 'favorite',
};


// VARIABLES

const filmsShownIndexes = {
  first: 0, // индекс 1-го вновь отрисовываемого фильма
  last: 5, // индекс фильма до которого нужно отрисовывать
  plus: 5, // на сколько нужно увеличить предыдущие значения
};

const header = document.querySelector('header.header');

const main = document.querySelector('main.main');

const footer = document.querySelector('footer.footer');

const statistic = footer.querySelector('.footer__statistics');


//FUNCTIONS

//фильерует фильмы по значениям в film.userDetails
const filterFilmsByDetailField = (films, field) => films.filter((film) => film.userDetails[field]);

const render = (container, htmlText, place = RenderPosition.BEFORE_END) => container.insertAdjacentHTML(place, htmlText);

// функция для рендеринга списка фильмов в Main Block по частям:
const renderMainFilms = (container, films) => render(container, renderAll(films.slice(filmsShownIndexes.first, filmsShownIndexes.last), createFilmCard));

const sortAndCut = (films, sortFunction, length = ADDITIONAL_BLOCK_LENGTH) => films.slice().sort(sortFunction).slice(0, length);

const getRatingByWatched = (count) => {
  if (count >= Rating.MOVIE_BUFF.count) {
    return Rating.MOVIE_BUFF.name;
  } else if (count >= Rating.FAN.count) {
    return Rating.FAN.name;
  } else if (count >= Rating.NOVICE.count) {
    return Rating.NOVICE.name;
  }
  return '';
};


//. START

const mockFilms = new Array(getRandomInt(COUNTS.FILM.MIN, COUNTS.FILM.MAX)).fill().map((item, i) => createMockFilm(i));
// отсортированные и отрезаные куски фильмов для блока Top rated и Most commented
const topFilms = sortAndCut(mockFilms, (a, b) => (b.filmInfo.totalRating || 0) - (a.filmInfo.totalRating || 0));

const popFilms = sortAndCut(mockFilms, (a, b) => b.comments.length - a.comments.length);


const watchList = filterFilmsByDetailField(mockFilms, UserDetailFields.WATCH_LIST);

const history = filterFilmsByDetailField(mockFilms, UserDetailFields.HISTORY);

const favorites = filterFilmsByDetailField(mockFilms, UserDetailFields.FAVORITE);


//1.РЕНДЕРИНГ

// 1.1.header

render(header, createProfile(getRatingByWatched(history.length)));


//1.2.menu

render(main, createMenu(watchList.length, history.length, favorites.length));


// 1.3.film block

// 1.3.1.рендеринг секций для всех блоков фильмов

render(main, createFilmsSections());


// 1.3.2.рендеринг Main, Top rated, Most commented Film Blocks

const filmSection = main.querySelector('.films');

render(filmSection, createMainFilmsBlock());

render(filmSection, createExtraFilmsBlock('Top rated'));

render(filmSection, createExtraFilmsBlock('Most commented'));


//1.3.3.рендеринг фильмов в блоки

// Main, Top rated, Most commented Film Blocks:
const [allFilmsContainer, topFilmsContainer, popFilmsContainer] = filmSection.querySelectorAll('.films-list__container');

renderMainFilms(allFilmsContainer, mockFilms); // рендерит первые 5 фильмов в основной блок

render(allFilmsContainer, createShowMoreBtn(), RenderPosition.AFTER_END); // ... кнопка


//  рендеринг фильмов в блоки Top rated и Most commented и их рендеринг

render(topFilmsContainer, renderAll(topFilms, createFilmCard));

render(popFilmsContainer, renderAll(popFilms, createFilmCard));


//1.4.footer statistic

render(statistic, createFooterStatistic(mockFilms.length));


//1.5.popup

render(footer, createFilmPopup(mockFilms[0]), RenderPosition.AFTER_END);

const commentsList = document.querySelector('.film-details__comments-list');

render(commentsList, renderAll(mockFilms[0].comments, createComment));


//2. СОБЫТИЯ

//2.1 отображения фильмов при нажатии на btnShowMore

const btnShowMore = filmSection.querySelector('.films-list__show-more');

btnShowMore.addEventListener('click', () => {
  filmsShownIndexes.first += filmsShownIndexes.plus;
  filmsShownIndexes.last += filmsShownIndexes.plus;

  renderMainFilms(allFilmsContainer, mockFilms);

  if (filmsShownIndexes.last >= mockFilms.length) {
    btnShowMore.style.display = 'none';
  }
});
