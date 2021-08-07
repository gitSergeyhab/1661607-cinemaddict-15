import Profile from './view/profile.js';
import Menu from './view/menu.js';
import FilmSection from './view/films/films.js';
import MainFilmsBlock from './view/films/main-films-block.js';
import ExtraFilmsBlock from './view/films/extra-films-block.js';
import BtnShowMore from './view/films/show-more-btn.js';
import FilmCard from './view/films/film-card.js';
import FooterStatistic from './view/films/footer-statistic.js';
import FilmPopup from './view/popup/film-popup.js';
import Comment from './view/popup/comment.js';

import {render} from './utils/dom-utils.js';
import {
  getRandomInt,
  sortAndCut
} from './utils/utils.js';
import {
  COUNTS,
  createMockFilm
} from './mock.js';
import {
  RenderPosition,
  filmsShownIndexes
} from './constants.js';


// CONSTANTS

const SELECTOR_POPUP = 'section.film-details';
const SELECTOR_CLOSE_POPUP = '.film-details__close-btn';
const SELECTOR_TITLE_FILM_CARD = '.film-card__title';
const SELECTOR_POSTER = '.film-card__poster';
const SELECTOR_COMMENTS = '.film-card__comments';
const SELECTOR_TITLE_FILM_BLOCK = '.films-list__title';
const CLASS_HIDE_SCROLL = 'hide-overflow';
const CLASS_HIDDEN = 'visually-hidden';

const KEY_CODE_ESC = 27;

const EmptyResultMessage = {
  ALL: 'There are no movies in our database',
  WATCH_LIST: 'There are no movies to watch now',
  HISTORY: 'There are no watched movies now',
  FAVORITE: 'There are no favorite movies now',
};

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
// const mockFilms = new Array(getRandomInt(0, 0)).fill().map((item, i) => createMockFilm(i));


//FUNCTIONS

const renderListToContainer = (container, className, list = []) => list.forEach((item) => container.append(new className(item).getElement()));

const closePopup = (popup) => {
  popup.remove();
  document.body.classList.remove(CLASS_HIDE_SCROLL);
};

const findOpenPopup = () => document.querySelector(SELECTOR_POPUP); //ищет незакрытый попап

const removePopup = () => findOpenPopup() ? closePopup(findOpenPopup()) : null; //удаляет незакрытый попап

const openPopup = (id) => {

  removePopup();

  const mockFilm = mockFilms.find((film) => film.id === +id);
  const filmPopup = new FilmPopup(mockFilm);
  const filmPopupElement = filmPopup.getElement();

  const btnClose = filmPopupElement.querySelector(SELECTOR_CLOSE_POPUP);
  btnClose.addEventListener('click', () => closePopup(filmPopupElement));
  document.body.classList.add(CLASS_HIDE_SCROLL);

  render(footer, filmPopupElement, RenderPosition.AFTER_END);

  renderListToContainer(filmPopup.getContainer(), Comment, mockFilm.comments);
};

const addListenersToFilmCard = (element) => {
  const id = element.dataset.filmId;

  const title = element.querySelector(SELECTOR_TITLE_FILM_CARD);
  const poster = element.querySelector(SELECTOR_POSTER);
  const commentsBlock = element.querySelector(SELECTOR_COMMENTS);

  title.addEventListener('click', () => openPopup(id));
  poster.addEventListener('click', () => openPopup(id));
  commentsBlock.addEventListener('click', () => openPopup(id));
};

//фильерует фильмы по значениям в film.userDetails
const filterFilmsByDetailField = (films, field) => films.filter((film) => film.userDetails[field]);

const renderFilmsToContainer = (container, films = []) => {
  films.forEach((film) => {
    const filmCardElement = new FilmCard(film).getElement();
    addListenersToFilmCard(filmCardElement); // навешивает обработчики открытия попапа
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

const popFilmBlock = new ExtraFilmsBlock(FilmSectionName.MOST_COMMENTED);

render(filmSection.getElement(), popFilmBlock.getElement());


// //1.3.3.рендеринг фильмов в блоки

//1.3.3.1 Main block and BtnShowMore

// отображения фильмов при нажатии на btnShowMore
const addBtnShowMore = (data) => {
  const btnShowMoreElement = new BtnShowMore().getElement(); // ... кнопка

  render(mainFilmsBlock.getElement(), btnShowMoreElement, RenderPosition.AFTER_END);

  btnShowMoreElement.addEventListener('click', () => {
    filmsShownIndexes.first += filmsShownIndexes.plus;
    filmsShownIndexes.last += filmsShownIndexes.plus;

    renderMainFilms(mainFilmsBlock.getContainer(), data);

    if (filmsShownIndexes.last >= mockFilms.length) {
      btnShowMoreElement.style.display = 'none';
    }
  });
};

const showMainBlock = (data = mockFilms, filter = 'ALL') => {
  if (data.length) { // если есть, что рендерить ...
    renderMainFilms(mainFilmsBlock.getContainer(), data); // ... рендерит первые 5 фильмов в основной блок ...
    addBtnShowMore(data); // ... и показывает кнопку ...
  } else { // ... иначе сообщение:
    const headerFilmsBlock = mainFilmsBlock.getElement().querySelector(SELECTOR_TITLE_FILM_BLOCK);
    headerFilmsBlock.classList.remove(CLASS_HIDDEN);
    headerFilmsBlock.textContent = EmptyResultMessage[filter];
  }
};

showMainBlock();


//1.3.3.2 TOP_RATED and MOST_COMMENTED blocks

renderFilmsToContainer(topFilmBlock.getContainer(), topFilms);

renderFilmsToContainer(popFilmBlock.getContainer(), popFilms);


//1.4.footer statistic

render(statistic, new FooterStatistic(mockFilms.length).getElement());


// обработчик для удаления попапа при ESC

document.addEventListener('keydown', (evt) => evt.keyCode === KEY_CODE_ESC ? removePopup() : null);
