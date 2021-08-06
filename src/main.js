import Profile from './view/profile.js';
import Menu from './view/menu.js';
import FilmSection from './view/films/films.js';
import MainFilmsBlock from './view/films/main-films-block.js';
import ExtraFilmsBlock from './view/films/extra-films-block.js';
import BtnShowMore from './view/films/show-more-btn.js';
import FilmCard from './view/films/film-card.js';
import FooterStatistic from './view/films/footer-statistic.js';

import {
  getRandomInt,
  sortAndCut
} from './utils/utils.js';
import {
  render
} from './utils/dom-utils.js';
import {
  COUNTS,
  createMockFilm
} from './mock.js';
import {
  RenderPosition,
  filmsShownIndexes
} from './constants.js';
import {
  addListenersToFilmCard
} from './add-listeners-to-film-card.js';
import {
  showMoreFilms
} from './show-more-films.js';
import {
  header,
  main,
  statistic
} from './dom-elements.js';


// CONSTANTS

const FilmSectionName = {
  TOP_RATED: 'Top rated',
  POP_RATED: 'Most commented',
};

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

const UserDetailFields = {
  WATCH_LIST: 'watchList',
  HISTORY: 'alreadyWatched',
  FAVORITE: 'favorite',
};


//  DATA
const mockFilms = new Array(getRandomInt(COUNTS.FILM.MIN, COUNTS.FILM.MAX)).fill().map((item, i) => createMockFilm(i));


//FUNCTIONS

//фильерует фильмы по значениям в film.userDetails
const filterFilmsByDetailField = (films, field) => films.filter((film) => film.userDetails[field]);

const renderFilmsToContainer = (container, films = []) => {
  films.forEach((film) => {
    const filmCardElement = new FilmCard(film).getElement();
    addListenersToFilmCard(mockFilms, filmCardElement); // навешивает обработчики открытия попапа
    container.append(filmCardElement);
  });
};

// функция для рендеринга списка фильмов в Main Block по частям:
const renderMainFilms = (container, films) => renderFilmsToContainer(container, films.slice(filmsShownIndexes.first, filmsShownIndexes.last));


const getRatingByWatched = (count) => {
  if (count >= Rating.MOVIE_BUFF.count) {
    return Rating.MOVIE_BUFF.name;
  }
  if (count >= Rating.FAN.count) {
    return Rating.FAN.name;
  }
  if (count >= Rating.NOVICE.count) {
    return Rating.NOVICE.name;
  }
  return '';
};


//. START

// отсортированные и отрезаные куски фильмов для блока Top rated и Most commented
const topFilms = sortAndCut(mockFilms, (a, b) => (b.filmInfo.totalRating || 0) - (a.filmInfo.totalRating || 0));

const popFilms = sortAndCut(mockFilms, (a, b) => b.comments.length - a.comments.length);

// списки фильмов по фильтрам
const watchList = filterFilmsByDetailField(mockFilms, UserDetailFields.WATCH_LIST);

const history = filterFilmsByDetailField(mockFilms, UserDetailFields.HISTORY);

const favorites = filterFilmsByDetailField(mockFilms, UserDetailFields.FAVORITE);


//1.РЕНДЕРИНГ

// 1.1.header

render(header, new Profile(getRatingByWatched(history.length)).getElement());


//1.2.menu

render(main, new Menu(watchList.length, history.length, favorites.length).getElement());


// 1.3.film block

// 1.3.1.рендеринг секции для блоков фильмов

const filmSection = new FilmSection();

render(main, filmSection.getElement());


// 1.3.2.рендеринг Main, Top rated, Most commented Film Blocks

const mainFilmsBlock = new MainFilmsBlock();

render(filmSection.getElement(), mainFilmsBlock.getElement());

const topFilmBlock = new ExtraFilmsBlock(FilmSectionName.TOP_RATED);

render(filmSection.getElement(), topFilmBlock.getElement());

const popFilmBlock = new ExtraFilmsBlock(FilmSectionName.POP_RATED);

render(filmSection.getElement(), popFilmBlock.getElement());


// //1.3.3.рендеринг фильмов в блоки

renderMainFilms(mainFilmsBlock.getContainer(), mockFilms); // рендерит первые 5 фильмов в основной блок

renderFilmsToContainer(topFilmBlock.getContainer(), topFilms);

renderFilmsToContainer(popFilmBlock.getContainer(), popFilms);


//1.4.footer statistic

render(statistic, new FooterStatistic(mockFilms.length).getElement());


// отображения фильмов при нажатии на btnShowMore

const btnShowMoreElement = new BtnShowMore().getElement(); // ... кнопк

render(mainFilmsBlock.getElement(), btnShowMoreElement, RenderPosition.AFTER_END);

showMoreFilms(mockFilms, btnShowMoreElement, renderMainFilms, mainFilmsBlock.getContainer());
