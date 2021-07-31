import dayjs from 'dayjs';


const renderAll = (data = [], templateFunction = () => '') => data.map((item) => templateFunction(item || '')).join('\n').trim();

const getRandomInt = (min, max) => {
  [min, max] = [Math.min(min, max), Math.max(min, max)];
  return Math.round(Math.random()*(max - min) + min);
};

const getRandFromList= (arr) => arr[getRandomInt(0, arr.length - 1)];

const getRandomListNoRepeat = (num, list) => {
  num = num > list.length ? list.length : num;
  const offers = [];
  while (offers.length < num){
    const offer = getRandFromList(list);
    if (! offers.some((off) => off === offer)) {
      offers.push(offer);
    }
  }
  return offers;
};


const getHoursAndMinutes = (minutes) => minutes ? `${Math.floor(minutes/60)}h ${minutes % 60}m` : '';

const getYear = (dateStamp) => dateStamp ? dayjs(dateStamp).format('YYYY') : '';

const getDayMonthYear = (dateStamp) => dateStamp ? dayjs(dateStamp).format('DD MMMM YYYY') : '';

const getFullDate = (dateStamp) => dateStamp ? dayjs(dateStamp).format('YYYY/MM/DD hh:mm') : '';


const makeActivatingFunc = (classActive) => (param) => param ? classActive : '';


export {renderAll, getRandomInt, getRandFromList, getRandomListNoRepeat,
  getHoursAndMinutes, getYear, getDayMonthYear, getFullDate,
  makeActivatingFunc};
