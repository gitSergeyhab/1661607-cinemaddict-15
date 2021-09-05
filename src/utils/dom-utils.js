import {RenderPosition} from '../constants.js';
import Abstract from '../view/abstract.js';

const logo = document.querySelector('.header__logo.logo');

const renderAll = (data = [], templateFunction = () => '') => data.map((item) => templateFunction(item || '')).join('\n').trim();


const render = (container, element, place = RenderPosition.BEFORE_END) => {
  container = (container instanceof Abstract) ? container.getElement() : container;
  element = (element instanceof Abstract) ? element.getElement() : element;

  switch (place) {
    case RenderPosition.AFTER_BEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFORE_END:
      container.append(element);
      break;
    case RenderPosition.AFTER_END:
      container.after(element);
      break;
    case RenderPosition.BEFORE_BEGIN:
      container.before(element);
      break;
  }
};

const createElement = (template) => {
  const element = document.createElement('div');
  element.innerHTML = template;
  return element.firstElementChild;
};

const remove = (component) => {
  if (component === null) {
    return;
  }

  if (!(component instanceof Abstract)) {
    throw new Error('Can remove only components');
  }

  component.getElement().remove();
  component.removeElement();
};

const replace = (newChild, oldChild) => {
  if (oldChild instanceof Abstract) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof Abstract) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (parent === null || oldChild === null || newChild === null) {
    throw new Error('Can\'t replace unexisting elements');
  }

  parent.replaceChild(newChild, oldChild);
};

const notifyOnline = () => {
  document.title = document.title.replace(' [offline]', '');
  // apiWithProvider.sync();
  logo.innerHTML = 'Cinemaddict';
};

const notifyOffline = () => {
  document.title += ' [offline]';
  logo.innerHTML = 'Cinemaddict <span style="color: red"># OFFLINE #</span>';
};

export {
  render,
  createElement,
  renderAll,
  remove,
  replace,
  notifyOnline,
  notifyOffline
};
