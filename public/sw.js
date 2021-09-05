const CACHE_PREFIX = 'cinemadict-cache';
const CACHE_VER = 'v15';
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VER}`;

const HTTP_STATUS_OK = 200;
const RESPONSE_SAFE_TYPE = 'basic';

const handleInstall = (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll([
        '/',
        '/index.html',
        '/bundle.js',
        '/css/normalize.css',
        '/css/main.css',

        '/fonts/OpenSans-Regular.woff2',
        '/fonts/OpenSans-ExtraBold.woff2',
        '/fonts/OpenSans-Bold.woff2',

        '/images/emoji/angry.png',
        '/images/emoji/puke.png',
        '/images/emoji/sleeping.png',
        '/images/emoji/smile.png',

        '/images/icons/icon-favorite-active.svg',
        '/images/icons/icon-favorite.svg',
        '/images/icons/icon-watched-active.svg',
        '/images/icons/icon-watched.svg',
        '/images/icons/icon-watchlist-active.svg',
        '/images/icons/icon-watchlist.svg',

        '/images/posters/made-for-each-other.png',
        '/images/posters/popeye-meets-sinbad.png',
        '/images/posters/sagebrush-trail.jpg',
        '/images/posters/santa-claus-conquers-the-martians.jpg',
        '/images/posters/the-dance-of-life.jpg',
        '/images/posters/the-great-flamarion.jpg',
        '/images/posters/the-man-with-the-golden-arm.jpg',

        '/images/background.png',
        '/images/bitmap@3x.png',
        '/images/bitmap@2x.png',
        '/images/bitmap.png',
      ])),
  );
};

const handleActivate = (evt) => {
  evt.waitUntil(caches.keys()
    .then((keys) => Promise.all( //Удаляем только те кэши, которые начинаются с нашего префикса, которые начинаются с нашего префикса
      keys.map((key) => (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) ? caches.delete(key) : null)
        .filter((key) => key !== null))), // Остальные не обрабатываем
  );
};

const handleFetch = (evt) => {
  const {request} = evt;

  evt.respondWith(
    caches.match(request)
      .then((cacheResponse) => {
        if (cacheResponse) { //Если в кэше нашёлся ответ на запрос (request) ...
          return cacheResponse; // ... возвращаем его (cacheResponse) вместо запроса к серверу
        }

        // Если в кэше не нашёлся ответ ...
        return fetch(request) // ... повторно вызываем  fetch  с тем же запросом (request) и возвращаем его
          .then((response) => {
            if (!response || response.status !== HTTP_STATUS_OK || response.type !== RESPONSE_SAFE_TYPE) {
            // Если ответа нет, или ответ со статусом отличным от 200 OK,  или ответ небезопасного типа (не basic) ...
              return response; // ... , тогда просто передаём  ответ дальше, никак не обрабатываем
            }

            const clonedResponse = response.clone(); // А если ответ удовлетворяет всем условиям, клонируем его

            caches.open(CACHE_NAME)
              .then((cache) => cache.put(request, clonedResponse)); // Копию кладём в кэш

            return response; // Оригинал передаём дальше
          });
      }),
  );
};

self.addEventListener('install', handleInstall);
self.addEventListener('activate', handleActivate);
self.addEventListener('fetch', handleFetch);
