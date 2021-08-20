import Abstract from './abstract.js';
import {getNotImplementedError} from '../utils/utils.js';


export default class Smart extends Abstract {
  _restoreHandlers() {
    getNotImplementedError('_restoreHandlers');
  }

  updateElement() {
    const oldElement = this.getElement();
    console.log(oldElement)
    const parent = oldElement.parentElement;
    console.log(parent)

    this.removeElement();
    const newElement = this.getElement();

    parent.replaceChild(newElement, oldElement);

    this._restoreHandlers();
  }

  updateState(update, justStateUpdating) {
    // console.log(this._state)
    if (!update) {
      return;
    }
    this._state = Object.assign({}, this._state, update);
    // this._state = {...this._state, update};
    if (justStateUpdating) {
      return;
    }

    this.updateElement();
    // console.log(this._state)
  }
}
