import dayjs from 'dayjs';
import {getRandomInt} from './utils.js';


const getHoursAndMinutes = (minutes) => minutes ? `${Math.floor(minutes/60)}h ${minutes % 60}m` : '';

const getYear = (dateStamp) => dateStamp ? dayjs(dateStamp).format('YYYY') : '';

const getDayMonthYear = (dateStamp) => dateStamp ? dayjs(dateStamp).format('DD MMMM YYYY') : '';

const getFullDate = (dateStamp) => dateStamp ? dayjs(dateStamp).format('YYYY/MM/DD hh:mm') : '';

const getRandomDateStamp = () => dayjs((getRandomInt(-(new Date()), new Date()))).format('YYYY-MM-DD');


export {
  getHoursAndMinutes,
  getYear,
  getDayMonthYear,
  getFullDate,
  getRandomDateStamp
};
