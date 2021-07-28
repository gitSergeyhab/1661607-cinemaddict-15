import {createSortButton} from './sort-button.js';
import {renderAll} from '../../util.js';

const dataSortItems = ['Sort by default', 'Sort by date', 'Sort by rating'];

export const createSort = () => `<ul class="sort">${renderAll(dataSortItems, createSortButton)}</ul>`;
