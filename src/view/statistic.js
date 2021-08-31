import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import Smart from './smart.js';

import {getRatingByWatched} from '../utils/utils.js';
import {getSortingCountGenres, getTotalDuration, getDatePeriod, filterWatchedFilmsByTime, getGenres} from '../utils/stats-utils.js';
import {filter} from '../utils/filter.js';
import {FilterType, Period} from '../constants.js';


const BAR_HEIGHT = 50;


const renderChart = (statisticCtx, {films, date: {from, to}}) => {
  const filteredFilms = filterWatchedFilmsByTime(filter[FilterType.HISTORY](films), from, to);
  const {genres, counts} = getSortingCountGenres(filteredFilms);

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

const createStatistic = ({films, date: {from, to}}) => {
  const rank = getRatingByWatched(filter[FilterType.HISTORY](films).length);

  const watchedFilmsByTime = filter[FilterType.HISTORY](filterWatchedFilmsByTime(films, from, to));
  const totalDuration = getTotalDuration(watchedFilmsByTime);
  const topGenre = getSortingCountGenres(watchedFilmsByTime).genres[0] || '';

  const height = getGenres(watchedFilmsByTime).length * BAR_HEIGHT || BAR_HEIGHT;

  return `
<section class="statistic">
  <p class="statistic__rank">
    Your rank
    <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    <span class="statistic__rank-label">${rank}</span>
  </p>

  <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all" checked>
    <label for="statistic-all-time" class="statistic__filters-label">All time</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="day">
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
      <p class="statistic__item-text">${watchedFilmsByTime.length} <span class="statistic__item-description">movies</span></p>
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
    <canvas class="statistic__chart" width="1000" height=${height}></canvas>
  </div>
</section>`;};

export default class Statistic extends Smart {
  constructor(films) {
    super();
    this._state = {films, date: getDatePeriod()};
    this._chart = null;
    this._setChart();
    this._changePeriod();
    this._radioValue = Period.ALL;
  }

  _restoreHandlers() {
    this._changePeriod();
    this._setChart();
  }

  _getRadioPeriod() {
    return this.getElement().querySelector('.statistic__filters');
  }

  _changePeriod() {
    this._getRadioPeriod().addEventListener('change', (evt) => {
      this._radioValue = evt.target.value;
      this.updateState({date: getDatePeriod(this._radioValue)});
      this._checkRadioValue();
    });
  }

  _checkRadioValue() {
    this._getRadioPeriod().querySelectorAll('input').forEach((input) => {
      input.checked = input.value === this._radioValue;
    });
  }

  getTemplate() {
    return createStatistic(this._state);
  }

  _setChart() {
    if (this._chart !== null) {
      this._chart = null;
    }

    const statisticCtx = this.getElement().querySelector('.statistic__chart');
    this._chart = renderChart(statisticCtx, this._state);
  }
}
