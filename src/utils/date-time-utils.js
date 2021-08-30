import dayjs from 'dayjs';
import {getRandomInt} from './utils.js';

const MINUTE = 60000;

const getHoursAndMinutes = (minutes) => minutes ? `${Math.floor(minutes/60)}h ${minutes % 60}m` : '';

const getYear = (dateStamp) => dateStamp ? dayjs(dateStamp).format('YYYY') : '';

const getDayMonthYear = (dateStamp) => dateStamp ? dayjs(dateStamp).format('DD MMMM YYYY') : '';

const getRandomDateStamp = () => dayjs((getRandomInt(-(new Date()), new Date()))).format('YYYY-MM-DD');
const getRandomDateStampComment = () => dayjs((getRandomInt(new Date() - 20000000000, new Date()))).format('YYYY-MM-DD');

const humanizeDate = (date) => {
  const diff = dayjs().diff(dayjs(date));
  if (diff < MINUTE * 2) {
    return 'now';
  }
  if (diff < MINUTE * 2 * 60) {
    return `${Math.floor(diff / MINUTE)} minutes ago`;
  }
  if (diff < MINUTE * 60 * 24) {
    return `${Math.floor(diff / MINUTE / 60)} hours ago`;
  }
  if (diff < MINUTE * 2 * 60 * 24) {
    return 'yesterday';
  }
  if (diff < MINUTE * 2 * 60 * 24 * 7) {
    return `${Math.floor(diff / MINUTE / 60 / 24)} days ago`;
  }
  if (diff < MINUTE * 2 * 60 * 24 * 7 * 4) {
    return `${Math.floor(diff / MINUTE / 60 / 24 / 7)} weeks ago`;
  }
  if (diff <  MINUTE * 2 * 60 * 24 * 7 * 4.35 * 12) {
    return `${Math.round(diff / MINUTE / 60 / 24 / 7 / 4.35)} months ago`;
  }
  return `${Math.round(diff / MINUTE / 60 / 24 / 7 / 4.35 / 12)} years ago`;
};


export {
  getHoursAndMinutes,
  getYear,
  getDayMonthYear,
  getRandomDateStamp,
  getRandomDateStampComment,
  humanizeDate
};
