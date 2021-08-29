import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
// import getHoursAndMinutes from '../utils/date-time-utils.js';

dayjs.extend(isBetween);

const getCountItemInArray = (item, arr) => arr.filter((arrItem) => item === arrItem).length;

const sortGenresByCount = (genreA, genreB) => genreB.count - genreA.count;

const filterWatchedFilmsByTime = (films, from, to) => films.filter((film) => dayjs(film.userDetails.watchingDate).isBetween(from, to));

const getAllGenres = (films) => films.reduce((acc, film) => ([...acc, ...film.filmInfo.genre]), []);
const getGenres = (films) => ([...new Set(getAllGenres(films))]);

const getSortingCountGenres = (films) => {
  const allGenres = getAllGenres(films);
  const genresByCount = getGenres(films).map((genre) => ({genre, count: getCountItemInArray(genre, allGenres)}));
  genresByCount.sort(sortGenresByCount);
  return {
    genre: genresByCount.map((item) => item.genre),
    count: genresByCount.map((item) => item.count),
  };
};

const getHoursAndMinutes = (minutes) => minutes ? {hour: Math.floor(minutes/60), minute: minutes % 60} : {hour: 0, minute: 0};

const getTotalDuration = (films) => getHoursAndMinutes(films.reduce((acc, film) => acc + film.filmInfo.runtime, 0));

export {
  filterWatchedFilmsByTime,
  getTotalDuration,
  getSortingCountGenres
};
