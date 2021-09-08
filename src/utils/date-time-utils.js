import dayjs from 'dayjs';


const MINUTE = 60000;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const DAYS_IN_WEEK = 7;
const WEEKS_IN_MONTH = 4.35;
const MONTHS_IN_YEAR = 12;
const PERIOD_DELIMITER = 2;


const getHoursAndMinutes = (minutes) => minutes ? {hour: Math.floor(minutes / MINUTES_IN_HOUR), minute: minutes % MINUTES_IN_HOUR} : {hour: 0, minute: 0};
const getStringTime = (minutes) => {
  const time = getHoursAndMinutes(minutes);
  return `${time.hour}h ${time.minute}m`;
};

const getYear = (dateStamp) => dateStamp ? dayjs(dateStamp).format('YYYY') : '';

const getDayMonthYear = (dateStamp) => dateStamp ? dayjs(dateStamp).format('DD MMMM YYYY') : '';

const humanizeDate = (date) => {
  const diff = dayjs().diff(dayjs(date));
  if (diff < MINUTE * PERIOD_DELIMITER) {
    return 'now';
  }
  if (diff < MINUTE * PERIOD_DELIMITER * MINUTES_IN_HOUR) {
    return `${Math.floor(diff / MINUTE)} minutes ago`;
  }
  if (diff < MINUTE * MINUTES_IN_HOUR * HOURS_IN_DAY) {
    return `${Math.floor(diff / MINUTE / MINUTES_IN_HOUR)} hours ago`;
  }
  if (diff < MINUTE * PERIOD_DELIMITER * MINUTES_IN_HOUR * HOURS_IN_DAY) {
    return 'yesterday';
  }
  if (diff < MINUTE * PERIOD_DELIMITER * MINUTES_IN_HOUR * HOURS_IN_DAY * DAYS_IN_WEEK) {
    return `${Math.floor(diff / MINUTE / MINUTES_IN_HOUR / HOURS_IN_DAY)} days ago`;
  }
  if (diff < MINUTE * PERIOD_DELIMITER * MINUTES_IN_HOUR * HOURS_IN_DAY * DAYS_IN_WEEK * WEEKS_IN_MONTH) {
    return `${Math.floor(diff / MINUTE / MINUTES_IN_HOUR / HOURS_IN_DAY / DAYS_IN_WEEK)} weeks ago`;
  }
  if (diff <  MINUTE * PERIOD_DELIMITER * MINUTES_IN_HOUR * HOURS_IN_DAY * DAYS_IN_WEEK * WEEKS_IN_MONTH * MONTHS_IN_YEAR) {
    return `${Math.round(diff / MINUTE / MINUTES_IN_HOUR / HOURS_IN_DAY / DAYS_IN_WEEK / WEEKS_IN_MONTH)} months ago`;
  }
  return `${Math.round(diff / MINUTE / MINUTES_IN_HOUR / HOURS_IN_DAY / DAYS_IN_WEEK / WEEKS_IN_MONTH / MONTHS_IN_YEAR)} years ago`;
};


export {
  getHoursAndMinutes,
  getYear,
  getDayMonthYear,
  humanizeDate,
  getStringTime
};
