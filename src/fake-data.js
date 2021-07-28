const filmMock = {
  title: 'The Dance of Life',
  originalTitle: 'The Dance of Life',
  director: 'Anthony Mann',
  writers: ['Anne Wigton', 'Heinz Herald', 'Richard Weil'],
  actors: ['Erich von Stroheim', 'Mary Beth Hughes', 'Dan Duryea'],
  rating: 8.3,
  date: '30 March 1945',
  country: 'USA',
  duration: '1h 55m',
  genres: ['Drama', 'Film-Noir', 'Mystery'],
  description: 'Burlesque comic Ralph "Skid" Johnson (Skelly), and specialty dancer Bonny Lee King (Carroll), end up together on a cold, rainy night at a tr…',
  commentCount: 5,
  srcPoster: './images/posters/the-man-with-the-golden-arm.jpg',
  ageRaring: '18+',
};

const commentMock = {
  srcEmoji: './images/emoji/smile.png',
  content: 'Interesting setting and a good cast',
  username: 'Tim Macoveev',
  date: '2019/12/31 23:59',
};

const comments = [commentMock, commentMock, commentMock, commentMock];

const allFilms = [filmMock, filmMock, filmMock, filmMock, filmMock];
const topFilms = [filmMock, filmMock];
const mostFilms = [filmMock, filmMock];

export {allFilms, topFilms, mostFilms, comments};
