const MESSAGE_OFFLINE_SHOW_TIME = 3000;
const MESSAGE_OFFLINE_IN_BODY = 'Y O U _ A R E _ O F F L I N E';
const TITLE_OFFLINE_INDICATOR = ' [offline]';
const LOGO_TEXT = 'Cinemaddict';
const LOGO_OFFLINE_INDICATOR = '# OFFLINE #';

const logo = document.querySelector('.header__logo.logo');
const messageOffline = `<div class="toast-item"><b>${MESSAGE_OFFLINE_IN_BODY}</b></div>`;
const containerOffline = document.createElement('div');
containerOffline.classList.add('toast-container');
containerOffline.innerHTML = messageOffline;


const showOfflineMessage = () => {
  document.body.append(containerOffline);
  setTimeout(() => {
    containerOffline.remove();
  }, MESSAGE_OFFLINE_SHOW_TIME);
};

const notifyOnline = () => {
  document.title = document.title.replace(TITLE_OFFLINE_INDICATOR, '');
  logo.innerHTML = LOGO_TEXT;
};

const notifyOffline = () => {
  document.title += TITLE_OFFLINE_INDICATOR;
  logo.innerHTML = `${LOGO_TEXT} <span style="color: red">${LOGO_OFFLINE_INDICATOR}</span>`;
  showOfflineMessage();
};

const isOnline = () => window.navigator.onLine;


export {
  notifyOnline,
  notifyOffline,
  isOnline,
  showOfflineMessage
};
