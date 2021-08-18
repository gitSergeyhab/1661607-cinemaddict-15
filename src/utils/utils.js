import dayjs from 'dayjs';

const ADDITIONAL_BLOCK_LENGTH = 2;
const MIN_DATE = dayjs('0000-00-00');

const getRandomInt = (min, max) => {
  [min, max] = [Math.min(min, max), Math.max(min, max)];
  return Math.round(Math.random() * (max - min) + min);
};

const getRandFromList = (arr) => arr[getRandomInt(0, arr.length - 1)];

const getRandomListNoRepeat = (num, list) => {
  for (let i = 0; i < list.length; i++) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = list[j];
    list[j] = list[i];
    list[i] = temp;
  }
  return list.slice(0, num);
};

const getRandomBoolean = () => Math.random() > 0.5;

const getListWithoutNull = (list) => list ? list.filter(Boolean).join(', ') : '';

const sortAndCut = (list, sortFunction, length = ADDITIONAL_BLOCK_LENGTH) => list.slice().sort(sortFunction).slice(0, length);


const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);
  return index === -1 ? items : [...items.slice(0, index), update, ...items.slice(index + 1)];
};

const sortDate = (a, b) => dayjs(b.filmInfo.release.date || MIN_DATE).diff(dayjs(a.filmInfo.release.date || MIN_DATE));
const sortRating = (a, b) => (b.filmInfo.totalRating || 0) - (a.filmInfo.totalRating || 0);

export {
  getRandomInt,
  getRandFromList,
  sortAndCut,
  getRandomListNoRepeat,
  getRandomBoolean,
  getListWithoutNull,
  updateItem,
  sortDate,
  sortRating
};
