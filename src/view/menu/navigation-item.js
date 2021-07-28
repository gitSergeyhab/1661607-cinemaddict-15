export const createNavigationItem = ({href, name, count}) => `
  <a href="${href}" class="main-navigation__item">${name}
    <span class="main-navigation__item-count">${count}</span>
  </a>`;
