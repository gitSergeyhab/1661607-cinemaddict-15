import {showOfflineMessage} from './show-offline-message.js';


const TITLE_OFFLINE_INDICATOR = ' [offline]';
const LOGO_TEXT = 'Cinemaddict';
const LOGO_OFFLINE_INDICATOR = '# OFFLINE #';


export const isOnline = () => window.navigator.onLine;

export const notifyNetStatus = () => {
  const logo = document.querySelector('.header__logo.logo');
  if (isOnline()) {
    document.title = document.title.replace(TITLE_OFFLINE_INDICATOR, '');
    logo.innerHTML = LOGO_TEXT;
    return;
  }
  document.title += TITLE_OFFLINE_INDICATOR;
  logo.innerHTML = `${LOGO_TEXT} <span style="color: red">${LOGO_OFFLINE_INDICATOR}</span>`;
  showOfflineMessage();
};
