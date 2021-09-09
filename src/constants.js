const ActiveClass = {
  CARD: 'film-card__controls-item--active',
  POPUP: 'film-details__control-button--active',
};

const DEFAULT_POSTER = 'https://www.kino-teatr.ru/movie/posters/big/9/85159.jpg';

const RenderPosition = {
  BEFORE_BEGIN: 'beforebegin',
  BEFORE_END: 'beforeend',
  AFTER_BEGIN: 'afterbegin',
  AFTER_END: 'afterend',
};

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
  CHANGE_FILTER: 'CHANGE_FILTER',
};

const UpdateType = {
  NONE: 'NONE', // ничего не перерисовывать - когда выполняется совместно с другим UpdateType и он обновляет вьюху
  PATCH: 'PATCH', // comments,  favorite, watchList  - перерисовка всех филмлистов
  MINOR: 'MINOR', // menu-filter / stats - перерисовка всех филмлистов и фильтров
  INIT: 'INIT',
};

const FilterType = {
  ALL_MOVIES: 'All movies',
  WATCH_LIST: 'Watchlist',
  HISTORY: 'History',
  FAVORITES: 'Favorites',
  STATS: 'stats',
};

const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
  ALL: 'ALL',
};

const FilmSectionName = {
  TOP_RATED: 'Top rated',
  MOST_COMMENTED: 'Most commented',
};

const EmptyResultMessage = {
  [FilterType.ALL_MOVIES]: 'There are no movies in our database',
  [FilterType.WATCH_LIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const Rating = {
  NOVICE: {
    name: 'Novice',
    count: 1,
  },
  FAN: {
    name: 'Fan',
    count: 11,
  },
  MOVIE_BUFF: {
    name: 'Movie Buff',
    count: 21,
  },
};

const Period = {
  ALL: 'all',
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};


export {
  ActiveClass,
  DEFAULT_POSTER,
  RenderPosition,
  SortType,
  UserAction,
  UpdateType,
  FilterType,
  Mode,
  FilmSectionName,
  EmptyResultMessage,
  Rating,
  Period
};
