// import Abstract from './view/abstract.js';
import Profile from './view/profile.js';
import Menu from './view/menu.js';
import FilmSection from './view/films/films.js';
import FooterStatistic from './view/films/footer-statistic.js';

import FilmListPresenter from './presenter/film-list.js';
import ExtraFilmListPresenter from './presenter/extra-film-list.js';

import {render} from './utils/dom-utils.js';
import {
  getRandomInt,
  sortAndCut
} from './utils/utils.js';
import {
  COUNTS,
  createMockFilm
} from './mock.js';

const FilmSectionName = {
  TOP_RATED: 'Top rated',
  MOST_COMMENTED: 'Most commented',
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


const header = document.querySelector('header.header');
const main = document.querySelector('main.main');
const footer = document.querySelector('footer.footer');
const statistic = footer.querySelector('.footer__statistics');


//  DATA
const mockFilms = new Array(getRandomInt(COUNTS.FILM.MIN, COUNTS.FILM.MAX)).fill().map((item, i) => createMockFilm(i));
// const mockFilms = new Array(getRandomInt(3, 6)).fill().map((item, i) => createMockFilm(i));



//FUNCTIONS

//фильерует фильмы по значениям в film.userDetails
const filterFilmsByDetailField = (films, field) => films.filter((film) => film.userDetails[field]);

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

render(header, new Profile(getRatingByWatched(history.length)));


//1.2.menu and sort

render(main, new Menu(watchList.length, history.length, favorites.length));


// 1.3.film block

// 1.3.1.рендеринг секции для блоков фильмов

const filmSection = new FilmSection();
render(main, filmSection);

const mainFilmListPresenter = new FilmListPresenter(filmSection, footer);
mainFilmListPresenter.init(mockFilms);


// 1.3.2.рендеринг Top rated, Most commented Film Blocks

const topFilmListPresenter = new ExtraFilmListPresenter(filmSection, footer, FilmSectionName.TOP_RATED);
topFilmListPresenter.init(topFilms);

const popFilmListPresenter = new ExtraFilmListPresenter(filmSection, footer, FilmSectionName.MOST_COMMENTED);
popFilmListPresenter.init(popFilms);


//1.4.footer statistic

render(statistic, new FooterStatistic(mockFilms.length));
