import Profile from './view/profile.js';
import FilmSection from './view/films/films.js';
import FooterStatistic from './view/films/footer-statistic.js';

import FilmListPresenter from './presenter/film-list.js';
import ExtraFilmListPresenter from './presenter/extra-film-list.js';
import MenuPresenter from './presenter/menu.js';

import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';
import FiltersModel from './model/filters-model.js';

import {render} from './utils/dom-utils.js';
import {getRandomInt} from './utils/utils.js';
import {FilmSectionName} from './constants.js';

import {COUNTS,createMockFilm} from './mock.js';


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
const oldMockFilms = new Array(getRandomInt(COUNTS.FILM.MIN, COUNTS.FILM.MAX)).fill().map((item, i) => createMockFilm(i));
const mockFilms = [];
oldMockFilms.forEach((film) => {
  const comments = film.comments;
  const newComments = comments.map((comment) => comment.id);
  const newFilm = {...film, comments: newComments};
  mockFilms.push(newFilm);
});


const filmsModel = new FilmsModel();
filmsModel.films = mockFilms;

const mockComments = oldMockFilms.reduce((acc, elem) => ([...acc, ...elem.comments]) ,[]);
const commentsModel = new CommentsModel();
commentsModel.comments = mockComments;


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
// списки фильмов по фильтрам

const history = filterFilmsByDetailField(mockFilms, UserDetailFields.HISTORY);

//1.РЕНДЕРИНГ
// 1.1.header
render(header, new Profile(getRatingByWatched(history.length)));


//1.2.menu
const filtersModel = new FiltersModel();
const menuPresenter = new MenuPresenter(main, filmsModel, filtersModel);
menuPresenter.init();


// 1.3.film block
// 1.3.1.рендеринг секции для блоков фильмов
const filmSection = new FilmSection();
render(main, filmSection);

const mainFilmListPresenter = new FilmListPresenter(filmSection, filmsModel, commentsModel, filtersModel);
mainFilmListPresenter.init();

// 1.3.2.рендеринг Top rated, Most commented Film Blocks

const topFilmListPresenter = new ExtraFilmListPresenter(filmSection, filmsModel, commentsModel, FilmSectionName.TOP_RATED);
topFilmListPresenter.init();

const mostCommentedFilmListPresenter = new ExtraFilmListPresenter(filmSection, filmsModel, commentsModel, FilmSectionName.MOST_COMMENTED);
mostCommentedFilmListPresenter.init();


//1.4.footer statistic
render(statistic, new FooterStatistic(mockFilms.length));
