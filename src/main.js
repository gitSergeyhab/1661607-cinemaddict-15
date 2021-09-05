import FilmSection from './view/films/films.js';
import FooterStatistic from './view/films/footer-statistic.js';
import Statistic from './view/statistic.js';

import FilmListPresenter from './presenter/film-list.js';
import ExtraFilmListPresenter from './presenter/extra-film-list.js';
import MenuPresenter from './presenter/menu.js';
import ProfilePresenter from './presenter/profile.js';

import FilmsModel from './model/films-model.js';
import FiltersModel from './model/filters-model.js';
import CommentsModel from './model/comments-model.js';

import {render, remove, notifyOffline, notifyOnline} from './utils/dom-utils.js';
import { isOnline } from './utils/utils.js';

import {FilmSectionName, FilterType, UpdateType} from './constants.js';

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
const footerStatistic= footer.querySelector('.footer__statistics');


// MODELS
const filtersModel = new FiltersModel();
const filmsModel = new FilmsModel();

/**
 * Эта модель должна создаваться там же, где и модель для фильмов, т.к. в один момент времени мы работаем с одним набором комментариев
 */
// ??? переместил, но связи не уловил - при чем здесь работа с одним набором комментариев?  ???
const commentsModel = new CommentsModel();

//РЕНДЕРИНГ
const profile = new ProfilePresenter(header, filmsModel); // инит после загрузки данных

const filmSection = new FilmSection();
render(main, filmSection);

const mainFilmListPresenter = new FilmListPresenter(filmSection, filmsModel, commentsModel, apiWithProvider, filtersModel);

new ExtraFilmListPresenter(filmSection, filmsModel, commentsModel, apiWithProvider, FilmSectionName.TOP_RATED);

new ExtraFilmListPresenter(filmSection, filmsModel, commentsModel, apiWithProvider, FilmSectionName.MOST_COMMENTED);


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

apiWithProvider.getFilms()
  .then((films) => filmsModel.setFilms(UpdateType.INIT, films))
  .then(() => render(footerStatistic, new FooterStatistic(filmsModel.films.length)))
  .then(() => profile.init())
  .catch(() => filmsModel.setFilms(UpdateType.INIT, []));


window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));

isOnline() ? notifyOnline() : notifyOffline(); //для показа статуса сети при перезагрузке страницы
window.addEventListener('online', notifyOnline);
window.addEventListener('offline', notifyOffline);
