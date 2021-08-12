import Abstract from './abstract.js';


const createProfileTemplate = (rating) => `
  <section class="header__profile profile">
    <p class="profile__rating">${rating}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;

export default class Profile extends Abstract{
  constructor(rating) {
    super();
    this._rating = rating;
  }

  getTemplate() {
    return createProfileTemplate(this._rating);
  }
}
