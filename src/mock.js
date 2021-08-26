import {
  getRandomBoolean,
  getRandomInt,
  getRandFromList,
  getRandomListNoRepeat
} from './utils/utils.js';
import {getRandomDateStamp} from './utils/date-time-utils.js';


//CONSTANTS

export const COUNTS = {
  COMMENT: {
    MIN: 4,
    MAX: 5,
  },
  FILM: {
    MIN: 15,
    MAX: 20,
  },
  NAMES: {
    MIN: 1,
    MAX: 3,
  },
  RUNTIME: {
    MIN: 10,
    MAX: 300,
  },
  GENRE: {
    MIN: 0,
    MAX: 4,
  },
  RATING: {
    MIN: 0,
    MAX: 10,
    DEV: 10,
  },
};

const FILM_NAMES = [
  'Побег из Шоушенка', 'Крёстный отец', 'Крёстный отец 2', '12 разгневанных мужчин', 'Список Шиндлера',
  'Властелин колец: Возвращение короля', 'Криминальное чтиво', 'Хороший, плохой, злой', 'Властелин колец: Братство Кольца',
  'Бойцовский клуб', 'Форрест Гамп', 'Начало', 'Властелин колец: Две крепости', 'Славные парни',
  'Пролетая над гнездом кукушки', 'Семь самураев', 'Семь', 'Жизнь прекрасна', 'Город Бога', 'Молчание ягнят',
  'Эта прекрасная жизнь', 'Спасти рядового Райана', 'Зелёная миля', 'Унесённые призраками', 'Интерстеллар', 'Паразиты',
  'Леон', 'Доктор Стрейнджлав, или Как я перестал бояться и полюбил бомбу', 'М', '',
];

const POSTERS = [
  './images/posters/made-for-each-other.png',
  './images/posters/popeye-meets-sinbad.png',
  './images/posters/sagebrush-trail.jpg',
  './images/posters/santa-claus-conquers-the-martians.jpg',
  './images/posters/the-dance-of-life.jpg',
  './images/posters/the-great-flamarion.jpg',
  './images/posters/the-man-with-the-golden-arm.jpg',
  '',
];

const AGE_RATINGS = ['0+', '6+', '12+', '16+', '18+', ''];

const EMOTIONS = ['smile', 'sleeping', 'puke', 'angry', ''];

const DESCRIPTION = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus';

const DESCRIPTIONS = DESCRIPTION.split('. ');

const COMMENT_AUTORS = ['', 'Tim Macoveev', 'John Doe', 'Ilya O\'Reilly', 'anonim', 'I', 'Lenin Vladimir Ilyich', 'Pablo Diego José Francisco de Paula Juan Nepomuceno María de los Remedios Cipriano de la Santísima Trinidad Mártir Patricio Ruizy Picasso'];

const NAMES = ['', 'Фрэнсис Форд Коппола', 'Кристофер Нолан', 'Питер Джексон', 'Квентин Тарантино', 'Серджо Леоне', 'Дэвид Финчер', 'Чарли Чаплин'];

const COUNTRIES = ['USA', 'USSR', 'UK', 'France', 'Italy', ''];

const GENRES = ['thriller', 'horror', 'comedy', 'fantasy', 'action', 'animation', ''];


// FUNCTIONS

const createMockComment = (id) => ({
  id,
  author: getRandFromList(COMMENT_AUTORS),
  comment: getRandFromList(DESCRIPTIONS),
  date: new Date(),
  emotion: getRandFromList(EMOTIONS),
});


export const createMockFilm = (id) => ({
  id,
  comments: new Array(getRandomInt(COUNTS.COMMENT.MIN, COUNTS.COMMENT.MAX)).fill().map((item, i) => createMockComment(`${id}-${i}`)),
  filmInfo: {
    // ??? С сервера приходит snake_case. Потом опять переписывать или делать адаптеры, в которых все равно будет snake_case ???
    title: getRandFromList(FILM_NAMES),
    alternativeTitle: getRandFromList(FILM_NAMES),
    totalRating: getRandomInt(COUNTS.RATING.MIN, COUNTS.RATING.MAX * COUNTS.RATING.DEV) / COUNTS.RATING.DEV,
    poster: getRandFromList(POSTERS),
    ageRating: getRandFromList(AGE_RATINGS),
    director: getRandFromList(NAMES),
    writers: getRandomListNoRepeat(getRandomInt(COUNTS.NAMES.MIN, COUNTS.NAMES.MAX), NAMES),
    actors: getRandomListNoRepeat(getRandomInt(COUNTS.NAMES.MIN, COUNTS.NAMES.MAX), NAMES),
    release: {
      date: getRandomDateStamp(),
      releaseCountry: getRandFromList(COUNTRIES),
    },
    runtime: getRandomInt(COUNTS.RUNTIME.MIN, COUNTS.RUNTIME.MAX),
    genre: getRandomListNoRepeat(getRandomInt(COUNTS.GENRE.MIN, COUNTS.GENRE.MAX), GENRES),
    description: getRandomListNoRepeat(getRandomInt(0, DESCRIPTIONS.length - 1), DESCRIPTIONS).join('. '),
  },
  userDetails: {
    watchList: getRandomBoolean(),
    alreadyWatched: getRandomBoolean(),
    watchingDate: getRandomDateStamp(),
    favorite: getRandomBoolean(),
  },
});
