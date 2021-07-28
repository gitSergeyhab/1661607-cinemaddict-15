import {profile} from './view/profile.js';
import {menu} from './view/menu/menu.js';
import {films} from './view/films/films.js';
import {popup} from './view/popup/popup.js';

const header = document.querySelector('header.header');
const main = document.querySelector('main.main');
const footer = document.querySelector('footer.footer');

const render = (container, htmlText, place = 'beforeend') => container.insertAdjacentHTML(place, htmlText);

render(header, profile({rating: 'Movie Buff', srcAvatar: 'images/bitmap@2x.png'}));
render(main, menu());
render(main, films());
render(footer, popup(), 'afterend');
