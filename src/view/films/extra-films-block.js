import Abstract from '../abstract.js';

const createExtraFilmsBlock = (name) => `
  <section class="films-list films-list--extra">
    <h2 class="films-list__title">${name}</h2>
    <div class="films-list__container">
    </div>
  </section>`;


export default class ExtraFilmsBlock extends Abstract {
  constructor(name) {
    super();
    this._name = name;
  }

  getTemplate() {
    return createExtraFilmsBlock(this._name);
  }
}
