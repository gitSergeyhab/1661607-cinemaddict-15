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

const FILM_CONTAINER_SELECTOR = '.films-list__container';

const filmsShownIndexes = {
  first: 0, // индекс 1-го вновь отрисовываемого фильма
  last: 5, // индекс фильма до которого нужно отрисовывать
  plus: 5, // на сколько нужно увеличить предыдущие значения
};

export {
  ActiveClass,
  DEFAULT_POSTER,
  RenderPosition,
  FILM_CONTAINER_SELECTOR,
  filmsShownIndexes
};
