export const profile = ({rating, srcAvatar}) => `
  <section class="header__profile profile">
    <p class="profile__rating">${rating}</p>
    <img class="profile__avatar" src=${srcAvatar} alt="Avatar" width="35" height="35">
  </section>`;
