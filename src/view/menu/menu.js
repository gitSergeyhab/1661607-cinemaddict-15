import {createNavigationItem} from './navigation-item.js';
import {createNavigationItemAll} from './navigation-item-all.js';
import {createStats} from './stats.js';
import {createSort} from './sort.js';
import {renderAll} from '../../util.js';

const dataNavItems = [
  {href: '#watchlist', name: 'Watchlist', count: 13},
  {href: '#history', name: 'History', count: 4},
  {href: '#favorites', name: 'Favorites', count: 8},
];

export const createMenu = () => `
  <nav class="main-navigation">
    <div class="main-navigation__items">
      ${createNavigationItemAll()}
      ${renderAll(dataNavItems, createNavigationItem)}
    </div>
    ${createStats()}
  </nav>
  ${createSort()}`;


