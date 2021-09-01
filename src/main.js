import FilmSection from './view/films/films.js';
import FooterStatistic from './view/films/footer-statistic.js';
import Statistic from './view/statistic.js';

import FilmListPresenter from './presenter/film-list.js';
import ExtraFilmListPresenter from './presenter/extra-film-list.js';
import MenuPresenter from './presenter/menu.js';
import ProfilePresenter from './presenter/profile.js';

import FilmsModel from './model/films-model.js';
import CommentsModel from './model/comments-model.js';
import FiltersModel from './model/filters-model.js';

import {render, remove} from './utils/dom-utils.js';
import {getRandomInt} from './utils/utils.js';
import {FilmSectionName, FilterType, UpdateType} from './constants.js';

import {COUNTS, createMockFilm} from './mock.js';

import Api from './api.js';


const URL = 'https://15.ecmascript.pages.academy/cinemaddict';
const AUTHORIZATION = 'Basic |,,/_Black_Metal';
// const AUTHORIZATION = 'Basic ...........11';


const api = new Api(URL, AUTHORIZATION);
// api.getFilms()
//   .then((films) => console.log(films))

// api.getComments(1)
//   .then((films) => console.log(films))

const header = document.querySelector('header.header');
const main = document.querySelector('main.main');
const footer = document.querySelector('footer.footer');
const footerStatistic= footer.querySelector('.footer__statistics');


//  DATA
const oldMockFilms = new Array(getRandomInt(COUNTS.FILM.MIN, COUNTS.FILM.MAX)).fill().map((item, i) => createMockFilm(i));

// const mockFilms = [];
// oldMockFilms.forEach((film) => {
//   const comments = film.comments;
//   const newComments = comments.map((comment) => comment.id);
//   const newFilm = {...film, comments: newComments};
//   mockFilms.push(newFilm);
// });

const mockComments = oldMockFilms.reduce((acc, elem) => ([...acc, ...elem.comments]), []);


// MODELS
const filtersModel = new FiltersModel();

const filmsModel = new FilmsModel();
// filmsModel.films = mockFilms;

const commentsModel = new CommentsModel();
commentsModel.comments = mockComments;


//РЕНДЕРИНГ
const profile = new ProfilePresenter(header, filmsModel);
profile.init();

const filmSection = new FilmSection();
render(main, filmSection);

const mainFilmListPresenter = new FilmListPresenter(filmSection, filmsModel, commentsModel, filtersModel, api);
// mainFilmListPresenter.init();

const topFilmListPresenter = new ExtraFilmListPresenter(filmSection, filmsModel, commentsModel, api, FilmSectionName.TOP_RATED);
// topFilmListPresenter.init();

const mostCommentedFilmListPresenter = new ExtraFilmListPresenter(filmSection, filmsModel, commentsModel, api, FilmSectionName.MOST_COMMENTED);
// mostCommentedFilmListPresenter.init();

// render(footerStatistic, new FooterStatistic(filmsModel.films.length));


// menu to FilmBlocks toggle
let statisticsComponent = null;
const handleSiteMenuClick = (target) => {
  if (target === FilterType.STATS) {
    filmSection.getElement().style.display = 'none';
    mainFilmListPresenter.hideSort();
    statisticsComponent = new Statistic(filmsModel.films);
    render(main, statisticsComponent);
    return;
  }

  filmSection.getElement().style.display = 'flex';
  mainFilmListPresenter.showSort();
  remove(statisticsComponent);
};

const menuPresenter = new MenuPresenter(main, filmsModel, filtersModel, handleSiteMenuClick);
menuPresenter.init();

api.getFilms()//.then((i) => console.log(i))
  .then((films) => filmsModel.setFilms(UpdateType.INIT, films))
  .then(() => render(footerStatistic, new FooterStatistic(filmsModel.films.length)))
  .catch(() => filmsModel.setFilms(UpdateType.INIT, []));

api.getFilms().then((i) => console.log(i))
