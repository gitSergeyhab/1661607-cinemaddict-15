const MESSAGE_OFFLINE_SHOW_TIME = 3000;
const MESSAGE_OFFLINE_IN_BODY = 'Y O U _ A R E _ O F F L I N E';

const containerOffline = document.createElement('div');
containerOffline.classList.add('toast-container');
containerOffline.innerHTML = `<div class="toast-item"><b>${MESSAGE_OFFLINE_IN_BODY}</b></div>`;

export const showOfflineMessage = () => {
  document.body.append(containerOffline);
  setTimeout(() => containerOffline.remove(), MESSAGE_OFFLINE_SHOW_TIME);
};
