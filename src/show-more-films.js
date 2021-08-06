
import {
  mockFilms,
  renderMainFilms
} from './main.js';
import {
  filmsShownIndexes
} from './constants.js';


export const showMoreFilms = (btn, container) => {
  btn.addEventListener('click', () => {
    filmsShownIndexes.first += filmsShownIndexes.plus;
    filmsShownIndexes.last += filmsShownIndexes.plus;

    renderMainFilms(container, mockFilms);

    if (filmsShownIndexes.last >= mockFilms.length) {
      btn.style.display = 'none';
    }
  });
};
