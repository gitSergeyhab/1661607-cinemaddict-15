import Smart from './smart.js';

import dayjs from 'dayjs';

import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const YEARS = 120;

import {  getRandomInt,
  getRandFromList,
  sortAndCut,
  getTopFilms,
  getMostCommentedFilms,
  getRandomListNoRepeat,
  getRandomBoolean,
  getListWithoutNull,
  sortDate,
  sortRating,
  getNotImplementedError,
  getRatingByWatched} from '../utils/utils.js';
import {  render,
  createElement,
  renderAll,
  remove,
  replace} from '../utils/dom-utils.js';
import {  getHoursAndMinutes,
  getYear,
  getDayMonthYear,
  getRandomDateStamp,
  getRandomDateStampComment,
  humanizeDate} from '../utils/date-time-utils.js';

import {getSortingCountGenres, getTotalDuration} from '../utils/stats-utils.js';

import {filter} from '../utils/filter.js';
import {  ActiveClass,
  DEFAULT_POSTER,
  RenderPosition,
  SortType,
  UserAction,
  UpdateType,
  FilterType,
  Mode,
  FilmSectionName,
  EmptyResultMessage,
  Rating} from '../constants.js';


// Обязательно рассчитайте высоту canvas, она зависит от количества элементов диаграммы

const renderChart = (statisticCtx, films) => {
  // const BAR_HEIGHT = 50;
  // const statisticCtx = document.querySelector('.statistic__chart');
  // statisticCtx.height = BAR_HEIGHT * 5;
  const calculatedGenres = getSortingCountGenres(films);
  const genres = calculatedGenres.genre;
  const counts = calculatedGenres.count;
  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: genres,
      datasets: [{
        data: counts,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 24,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};


const createStatistic = ({films}) => {
  const filmsWatchedCount = filter[FilterType.HISTORY](films).length;
  const rank = getRatingByWatched(filmsWatchedCount);
  const totalDuration = getTotalDuration(films);
  const topGenre = getSortingCountGenres(films).genre[0];
  return `
<section class="statistic">
  <p class="statistic__rank">
    Your rank
    <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    <span class="statistic__rank-label">${rank}</span>
  </p>

  <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
    <label for="statistic-all-time" class="statistic__filters-label">All time</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
    <label for="statistic-today" class="statistic__filters-label">Today</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
    <label for="statistic-week" class="statistic__filters-label">Week</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
    <label for="statistic-month" class="statistic__filters-label">Month</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
    <label for="statistic-year" class="statistic__filters-label">Year</label>
  </form>

  <ul class="statistic__text-list">
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text">${filmsWatchedCount} <span class="statistic__item-description">movies</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
      <p class="statistic__item-text">${totalDuration.hour} <span class="statistic__item-description">h</span> ${totalDuration.minute} <span class="statistic__item-description">m</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${topGenre}</p>
    </li>
  </ul>

  <div class="statistic__chart-wrap">
    <canvas class="statistic__chart" width="1000"></canvas>
  </div>

</section>`;};

export default class Statistic extends Smart {
  constructor(films) {
    super();
    this._state = {films, date: {
      from: dayjs().subtract(YEARS, 'year').toDate(),
      to: dayjs().toDate(),
    }};
    this._statisticCtx = this.getElement().querySelector('.statistic__chart');
    this._renderChart();
  }

  getTemplate() {
    console.log(this._state.date)
    return createStatistic(this._state);
  }

  _renderChart() {
    renderChart(this._statisticCtx, this._state.films);
  }


}