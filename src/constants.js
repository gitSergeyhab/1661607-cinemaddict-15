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
};

const UpdateType = {
  NONE: 'NONE', // ничего не перерисовывать - когда выполняется совместно с другим UpdateType и он обновляет вьюху
  PATCH: 'PATCH', // comments            - перерисовка всех филмлистов
  MINOR: 'MINOR', // favorite, watchList - перерисовка всех филмлистов и фильтров
  MAJOR: 'MAJOR', // history             - перерисовка всех филмлистов и фильтров и профиля
};

const FilterType = {
  ALL_MOVIES: 'All movies',
  WATCH_LIST: 'Watchlist',
  HISTORY: 'History',
  FAVORITES: 'Favorites',
};


export {
  ActiveClass,
  DEFAULT_POSTER,
  RenderPosition,
  SortType,
  UserAction,
  UpdateType,
  FilterType
};
