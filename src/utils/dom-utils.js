import {RenderPosition} from '../constants.js';
import Abstract from '../view/abstract.js';


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
  }
};

const createElement = (template) => {
  const element = document.createElement('div');
  element.innerHTML = template;
  return element.firstElementChild;
};


export {
  render,
  createElement,
  renderAll
};
