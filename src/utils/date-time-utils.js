import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';


dayjs.extend(relativeTime);


const MINUTES_IN_HOUR = 60;

const getHoursAndMinutes = (minutes) => minutes ? {hour: Math.floor(minutes / MINUTES_IN_HOUR), minute: minutes % MINUTES_IN_HOUR} : {hour: 0, minute: 0};

const getStringTime = (minutes) => {
  const time = getHoursAndMinutes(minutes);
  return `${time.hour}h ${time.minute}m`;
};

const getYear = (dateStamp) => dateStamp ? dayjs(dateStamp).format('YYYY') : '';

const getDayMonthYear = (dateStamp) => dateStamp ? dayjs(dateStamp).format('DD MMMM YYYY') : '';

const humanizeDate = (date) => dayjs(date).toNow();


export {
  getHoursAndMinutes,
  getYear,
  getDayMonthYear,
  humanizeDate,
  getStringTime
};
