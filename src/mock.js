/* eslint-disable camelcase*/ // с сервера данные приходят в snake_case, так что  вот...
import {getRandomInt, getRandFromList, getRandomListNoRepeat} from './util.js';

export const Counts = {
  COMMENT: {MIN: 0, MAX: 5},
  FILM: {MIN: 15, MAX: 20},
  NAMES: {MIN: 0, MAX: 3},
  RUNTIME: {MIN: 10, MAX: 300},
  GENRE: {MIN: 0, MAX: 4},
};

const REJECT_PERCENTAGE = 0.2;
const messValue = (value) => [value, undefined][+(Math.random() < REJECT_PERCENTAGE)];

const filmNames = [
  'Побег из Шоушенка','Крёстный отец', 'Крёстный отец 2', '12 разгневанных мужчин', 'Список Шиндлера',
  'Властелин колец: Возвращение короля','Криминальное чтиво','Хороший, плохой, злой','Властелин колец: Братство Кольца',
  'Бойцовский клуб', 'Форрест Гамп', 'Начало', 'Властелин колец: Две крепости', 'Славные парни',
  'Пролетая над гнездом кукушки', 'Семь самураев', 'Семь', 'Жизнь прекрасна', 'Город Бога', 'Молчание ягнят',
  'Эта прекрасная жизнь', 'Спасти рядового Райана', 'Зелёная миля', 'Унесённые призраками', 'Интерстеллар', 'Паразиты',
  'Леон', 'Доктор Стрейнджлав, или Как я перестал бояться и полюбил бомбу', 'М',
];

const posters = [
  './images/posters/made-for-each-other.png',
  './images/posters/popeye-meets-sinbad.png',
  './images/posters/sagebrush-trail.jpg',
  './images/posters/santa-claus-conquers-the-martians.jpg',
  './images/posters/the-dance-of-life.jpg',
  './images/posters/the-great-flamarion.jpg',
  './images/posters/the-man-with-the-golden-arm.jpg',
];

const ageRatings = ['0+', '6+', '12+', '16+', '18+'];

const emotions = ['smile', 'sleeping', 'puke', 'angry'];

const description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus';
const descriptions = description.split('. ');
const commentAutors = ['Tim Macoveev', 'John Doe', 'Ilya O\'Reilly', 'anonim', 'I', 'Lenin Vladimir Ilyich', 'Pablo Diego José Francisco de Paula Juan Nepomuceno María de los Remedios Cipriano de la Santísima Trinidad Mártir Patricio Ruizy Picasso'];

const names = ['Фрэнсис Форд Коппола', 'Кристофер Нолан', 'Питер Джексон', 'Квентин Тарантино', 'Серджо Леоне', 'Дэвид Финчер', 'Чарли Чаплин'];
const countries = ['USA', 'USSR', 'UK', 'France', 'Italy'];
const genres = ['thriller', 'horror', 'comedy', 'fantasy', 'action', 'animation'];

const tossCoin = () => Math.random() > 0.5;

const getGetId = () => {
  let id = 0;
  return () => {
    id++;
    return id;
  };
};

const getFilmId = getGetId();
const getCommentId = getGetId();

const getRandDateStamp = () => getRandomInt(-(new Date()), new Date());

export const getMockDataArr = (cteateObjFunc, maxLen, minLen = 0) => new Array(getRandomInt(minLen, maxLen)).fill().map(cteateObjFunc);

const createMockComment = () => ({
  id: getCommentId(),
  author: getRandFromList(commentAutors),
  comment: getRandFromList(descriptions),
  date: new Date() - 0,
  emotion: getRandFromList(emotions),
});


export const createMockFilm = () => ({
  id: getFilmId(),
  comments: getMockDataArr(createMockComment, Counts.COMMENT.MAX),
  film_info: {
    title: getRandFromList(filmNames),
    alternative_title: getRandFromList(filmNames),
    total_rating: getRandomInt(0, 100) / 10,
    poster: getRandFromList(posters),
    age_rating: getRandFromList(ageRatings),
    director: getRandFromList(names),
    writers: getRandomListNoRepeat(getRandomInt(Counts.NAMES.MIN, Counts.NAMES.MAX), names),
    actors: getRandomListNoRepeat(getRandomInt(Counts.NAMES.MIN, Counts.NAMES.MAX), names),
    release: {
      date: getRandDateStamp(),
      release_country: getRandFromList(countries),
    },
    runtime: getRandomInt(Counts.RUNTIME.MIN, Counts.RUNTIME.MAX),
    genre: getRandomListNoRepeat(getRandomInt(Counts.GENRE.MIN, Counts.GENRE.MAX), genres),
    description: getRandomListNoRepeat(getRandomInt(0, 7), descriptions).join('. '),
  },
  user_details: {
    watchlist: tossCoin(),
    already_watched: tossCoin(),
    watching_date: getRandDateStamp(),
    favorite: tossCoin(),
  },
});


// портим данные
export const crippleData = (data) => {
  for (const key of Object.keys(data)) {
    if (data[key] instanceof Object) {
      crippleData(data[key]);
    } else {
      data[key] = messValue(data[key]);
    }
  }
};
