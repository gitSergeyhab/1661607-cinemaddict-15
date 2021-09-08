import dayjs from 'dayjs';
import {Rating} from '../constants.js';


const ADDITIONAL_BLOCK_LENGTH = 2;

const minDate = dayjs('0000-00-00');


const getListWithoutNull = (list) => list ? list.filter(Boolean).join(', ') : '';

const sortAndCut = (list, sortFunction, length = ADDITIONAL_BLOCK_LENGTH) => list.slice().sort(sortFunction).slice(0, length);

const getTopFilms = (films) => sortAndCut(films, (a, b) => (b.filmInfo.totalRating || 0) - (a.filmInfo.totalRating || 0));
const getMostCommentedFilms = (films) => sortAndCut(films, (a, b) => b.comments.length - a.comments.length);

const sortDate = (a, b) => dayjs(b.filmInfo.release.date || minDate).diff(dayjs(a.filmInfo.release.date || minDate));
const sortRating = (a, b) => (b.filmInfo.totalRating || 0) - (a.filmInfo.totalRating || 0);

const getNotImplementedError = (method) => {
  throw new Error(`Abstract method not implemented: ${method}`);
};

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


export {
  sortAndCut,
  getTopFilms,
  getMostCommentedFilms,
  getListWithoutNull,
  sortDate,
  sortRating,
  getNotImplementedError,
  getRatingByWatched
};
