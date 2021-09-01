import FilmSection from './view/films/films.js';
import FooterStatistic from './view/films/footer-statistic.js';
import Statistic from './view/statistic.js';

import FilmListPresenter from './presenter/film-list.js';
import ExtraFilmListPresenter from './presenter/extra-film-list.js';
import MenuPresenter from './presenter/menu.js';
import ProfilePresenter from './presenter/profile.js';

import FilmsModel from './model/films-model.js';
import FiltersModel from './model/filters-model.js';

import {render, remove} from './utils/dom-utils.js';
import {FilmSectionName, FilterType, UpdateType} from './constants.js';

import Api from './api.js';


const URL = 'https://15.ecmascript.pages.academy/cinemaddict';
const AUTHORIZATION = 'Basic |,,/_Black_Metal';

const api = new Api(URL, AUTHORIZATION);

const header = document.querySelector('header.header');
const main = document.querySelector('main.main');
const footer = document.querySelector('footer.footer');
const footerStatistic= footer.querySelector('.footer__statistics');


// MODELS
const filtersModel = new FiltersModel();
const filmsModel = new FilmsModel();


//РЕНДЕРИНГ
const profile = new ProfilePresenter(header, filmsModel); // инит после загрузки данных

const filmSection = new FilmSection();
render(main, filmSection);

const mainFilmListPresenter = new FilmListPresenter(filmSection, filmsModel, filtersModel, api);

new ExtraFilmListPresenter(filmSection, filmsModel, api, FilmSectionName.TOP_RATED);

new ExtraFilmListPresenter(filmSection, filmsModel, api, FilmSectionName.MOST_COMMENTED);


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

api.getFilms()
  .then((films) => filmsModel.setFilms(UpdateType.INIT, films))
  .then(() => render(footerStatistic, new FooterStatistic(filmsModel.films.length)))
  .then(() => profile.init())
  .catch(() => filmsModel.setFilms(UpdateType.INIT, []));
