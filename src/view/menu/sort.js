import {sortButton} from './sort-button.js';
import {connectElements} from '../../util.js';

const dataSortItems = ['Sort by default', 'Sort by date', 'Sort by rating'];

export const sort = () => `<ul class="sort">${connectElements(dataSortItems, sortButton)}</ul>`;
