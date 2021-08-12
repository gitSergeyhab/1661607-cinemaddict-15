import Abstract from './view/abstract.js';
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
const SELECTOR_FILM_CONTAINER = '.films-list__container';
const SELECTOR_COMMENT_CONTAINER = '.film-details__comments-list';
const SELECTOR_POPUP = 'section.film-details';
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


//FUNCTIONS

const renderListToContainer = (container, className, list = []) => list.forEach((item) => container.append(new className(item).getElement()));

const closePopup = (popup) => {
  if (popup instanceof Abstract) {
    popup.getElement().remove();
    popup.removeElement();
  } else {
    popup.remove();
  }
  document.body.classList.remove(CLASS_HIDE_SCROLL);
};

const findOpenPopup = () => document.querySelector(SELECTOR_POPUP); //ищет незакрытый попап

const removePopup = () => findOpenPopup() ? closePopup(findOpenPopup()) : null; //удаляет незакрытый попап

const openPopup = (id) => {
  removePopup();
  const mockFilm = mockFilms.find((film) => film.id === +id); // находит тыкнутый
  const filmPopup = new FilmPopup(mockFilm);

  filmPopup.setClickHandler(() => closePopup(filmPopup)); // обработчик закрытия попапа на попап(кнопку)

  document.body.classList.add(CLASS_HIDE_SCROLL);
  render(footer, filmPopup, RenderPosition.AFTER_END);
  const commentContainer = filmPopup.getElement().querySelector(SELECTOR_COMMENT_CONTAINER);
  renderListToContainer(commentContainer, Comment, mockFilm.comments);
};

//фильерует фильмы по значениям в film.userDetails
const filterFilmsByDetailField = (films, field) => films.filter((film) => film.userDetails[field]);

const renderFilmsToContainer = (container, films = []) => {
  films.forEach((film) => {
    const filmCard = new FilmCard(film);

    filmCard.setClickHandler(openPopup); // обработчик открытия попапа на карточку
    container.getElement().querySelector(SELECTOR_FILM_CONTAINER).append(filmCard.getElement());
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

render(header, new Profile(getRatingByWatched(history.length)));


//1.2.menu

render(main, new Menu(watchList.length, history.length, favorites.length));


// 1.3.film block

// 1.3.1.рендеринг секции для блоков фильмов

const filmSection = new FilmSection();

render(main, filmSection);


// 1.3.2.рендеринг Main, Top rated, Most commented Film Blocks

const mainFilmsBlock = new MainFilmsBlock();

render(filmSection, mainFilmsBlock);

const topFilmBlock = new ExtraFilmsBlock(FilmSectionName.TOP_RATED);

render(filmSection, topFilmBlock);

const popFilmBlock = new ExtraFilmsBlock(FilmSectionName.MOST_COMMENTED);

render(filmSection, popFilmBlock);


// //1.3.3.рендеринг фильмов в блоки

//1.3.3.1 Main block and BtnShowMore

// отображения фильмов при нажатии на btnShowMore

const addBtnShowMore = (data) => {
  const btnShowMore = new BtnShowMore(); // ... кнопка

  render(mainFilmsBlock, btnShowMore, RenderPosition.AFTER_END);

  btnShowMore.setClickHandler(() => { // обработчик допавления фильмов на кнопку
    filmsShownIndexes.first += filmsShownIndexes.plus;
    filmsShownIndexes.last += filmsShownIndexes.plus;

    renderMainFilms(mainFilmsBlock, data);

    if (filmsShownIndexes.last >= mockFilms.length) {
      btnShowMore.getElement().style.display = 'none';
    }
  });
};

// ПЕРЕДЕЛАЮ, КОГДА НУЖНО БУДЕТ ВЫВОДИТЬ ФИЛЬМЫ ПО ФИЛЬТРАМ
const showMainBlock = (data = mockFilms, text = EmptyResultMessage.ALL) => {
  if (data.length) { // если есть, что рендерить ...
    renderMainFilms(mainFilmsBlock, data); // ... рендерит первые 5 фильмов в основной блок ...
    addBtnShowMore(data); // ... и показывает кнопку ...
  } else { // ... иначе сообщение:
    const headerFilmsBlock = mainFilmsBlock.getElement().querySelector(SELECTOR_TITLE_FILM_BLOCK);
    headerFilmsBlock.classList.remove(CLASS_HIDDEN);
    headerFilmsBlock.textContent = text;
  }
};

showMainBlock();


//1.3.3.2 TOP_RATED and MOST_COMMENTED blocks

renderFilmsToContainer(topFilmBlock, topFilms);

renderFilmsToContainer(popFilmBlock, popFilms);


//1.4.footer statistic

render(statistic, new FooterStatistic(mockFilms.length));


// обработчик для удаления попапа при ESC

document.addEventListener('keydown', (evt) => evt.keyCode === KEY_CODE_ESC ? removePopup() : null);
