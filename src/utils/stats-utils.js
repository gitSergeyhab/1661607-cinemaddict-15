import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

import {Period} from '../constants.js';


const MAX_PERIOD_IN_YEARS = 120;


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
    genres: genresByCount.map((item) => item.genre),
    counts: genresByCount.map((item) => item.count),
  };
};

const getHoursAndMinutes = (minutes) => minutes ? {hour: Math.floor(minutes / 60), minute: minutes % 60} : {hour: 0, minute: 0};

const getTotalDuration = (films) => getHoursAndMinutes(films.reduce((acc, film) => acc + film.filmInfo.runtime, 0));

const getDatePeriod = (period) => {
  const to = dayjs().toDate();
  switch (period) {
    case Period.YEAR:
      return {from: dayjs().subtract(1, Period.YEAR).toDate(), to};
    case Period.MONTH:
      return {from: dayjs().subtract(1, Period.MONTH).toDate(), to};
    case Period.WEEK:
      return {from: dayjs().subtract(1, Period.WEEK).toDate(), to};
    case Period.DAY:
      return {from: dayjs().subtract(1, Period.DAY).toDate(), to};
    default:
      return {from: dayjs().subtract(MAX_PERIOD_IN_YEARS, Period.YEAR).toDate(), to};
  }
};

export {
  filterWatchedFilmsByTime,
  getTotalDuration,
  getSortingCountGenres,
  getDatePeriod,
  getGenres
};
