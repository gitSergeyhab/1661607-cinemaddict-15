import FilmSection from './view/films/films.js';
import FooterStatistic from './view/films/footer-statistic.js';
import Statistic from './view/statistic.js';

import FilmListPresenter from './presenter/film-list.js';
import MostCommentedFilmList from './presenter/most-commented-film.js';
import TopRatedFilmList from './presenter/top-rated-film.js';
import MenuPresenter from './presenter/menu.js';
import ProfilePresenter from './presenter/profile.js';

import FilmsModel from './model/films-model.js';
import FiltersModel from './model/filters-model.js';
import CommentsModel from './model/comments-model.js';

import {render, remove} from './utils/dom-utils.js';
import {notifyNetStatus} from './utils/offline-utils.js';
import {FilterType, UpdateType} from './constants.js';

import Api from './api/api.js';
import Store from './api/store.js';
import Provider from './api/provider.js';


const STORE_PREFIX  = 'cinemadict-localstorage';
const STORE_VER = 'v15';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;
const URL = 'https://15.ecmascript.pages.academy/cinemaddict';
const AUTHORIZATION = 'Basic |,,/_Black_Metal_|../';

const api = new Api(URL, AUTHORIZATION);
const store = new Store(STORE_NAME, localStorage);
const apiWithProvider = new Provider(api, store);

const header = document.querySelector('header.header');
const main = document.querySelector('main.main');
const footer = document.querySelector('footer.footer');
const footerStatistic = footer.querySelector('.footer__statistics');

const filtersModel = new FiltersModel();
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();

// Рендеринг
const profile = new ProfilePresenter(header, filmsModel);

const filmSection = new FilmSection();
render(main, filmSection);

const mainFilmListPresenter = new FilmListPresenter(filmSection, filmsModel, commentsModel, apiWithProvider, filtersModel);

new TopRatedFilmList(filmSection, filmsModel, commentsModel, apiWithProvider);

new MostCommentedFilmList(filmSection, filmsModel, commentsModel, apiWithProvider);

// Переключатель статистики
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

// Загрузка фильмов в модель
apiWithProvider.getFilms()
  .then((films) => filmsModel.setFilms(UpdateType.INIT, films))
  .then(() => render(footerStatistic, new FooterStatistic(filmsModel.films.length)))
  .then(() => profile.init())
  .catch(() => filmsModel.setFilms(UpdateType.INIT, []));

// Offline
// window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));

notifyNetStatus();

window.addEventListener('online', () => {
  notifyNetStatus();
  apiWithProvider.sync();
});

window.addEventListener('offline', () => notifyNetStatus());
