import {
  filmsShownIndexes
} from './constants.js';


export const showMoreFilms = (films, btn, renderFunction, container) => {
  btn.addEventListener('click', () => {
    filmsShownIndexes.first += filmsShownIndexes.plus;
    filmsShownIndexes.last += filmsShownIndexes.plus;

    renderFunction(container, films);

    if (filmsShownIndexes.last >= films.length) {
      btn.style.display = 'none';
    }
  });
};
