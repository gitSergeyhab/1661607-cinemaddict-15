import {navigationItem} from './navigation-item.js';
import {navigationItemAll} from './navigation-item-all.js';
import {stats} from './stats.js';
import {connectElements} from '../../util.js';

const dataNavItems = [
  {href: '#watchlist', name: 'Watchlist', count: 13},
  {href: '#history', name: 'History', count: 4},
  {href: '#favorites', name: 'Favorites', count: 8},
];

export const navigation = () => `
<nav class="main-navigation">
<div class="main-navigation__items">
  ${navigationItemAll()}
  ${connectElements(dataNavItems, navigationItem)}
</div>
  ${stats()}
</nav>`;
