import {createProfile} from './view/profile.js';
import {createMenu} from './view/menu/menu.js';
import {createFilmsSections} from './view/films/films.js';
import {createFilmPopup} from './view/popup/film-popup.js';

const Ratings = {
  nobody: '',
  novice: 'Novice',
  fan: 'Fan',
  movieBuff: 'Movie Buff',
};

const RenderPosition = {
  header: document.querySelector('header.header'),
  main: document.querySelector('main.main'),
  footer: document.querySelector('footer.footer'),
};

const render = (container, htmlText, place = 'beforeend') => container.insertAdjacentHTML(place, htmlText);

render(RenderPosition.header, createProfile(Ratings.movieBuff));
render(RenderPosition.main, createMenu());
render(RenderPosition.main, createFilmsSections());
render(RenderPosition.footer, createFilmPopup(), 'afterend');
