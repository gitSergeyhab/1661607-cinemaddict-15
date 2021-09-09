import Abstract from './abstract.js';
import {getNotImplementedError} from '../utils/utils.js';


export default class Smart extends Abstract {
  restoreHandlers() {
    getNotImplementedError('restoreHandlers');
  }

  updateElement() {
    const oldElement = this.getElement();
    const parent = oldElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, oldElement);

    this.restoreHandlers();
  }

  updateState(update, justStateUpdating) {
    if (!update) {
      return;
    }

    this._state = Object.assign({}, this._state, update);

    if (justStateUpdating) {
      return;
    }

    this.updateElement();
  }
}
