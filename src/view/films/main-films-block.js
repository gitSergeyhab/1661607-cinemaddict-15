import Abstract from '../abstract.js';


const createMainFilmsBlock = () => `
  <section class="films-list">
    <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    <div class="films-list__container">
    </div>
  </section>`;


export default class MainFilmsBlock extends Abstract {
  constructor(name) {
    super();
    this._name = name;
  }

  getTemplate() {
    return createMainFilmsBlock(this._name);
  }
}
