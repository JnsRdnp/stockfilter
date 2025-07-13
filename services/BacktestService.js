const _ = require('lodash');
const StockFilterService = require('./StockFilterService.js');
const stockFilterService = new StockFilterService();

class BacktestService {
  constructor() {}

  async getBacktestRestricted(maxNegRatio = 0.1, minStockCount = 2, binsize = 10) {
    const stocks = await stockFilterService.getMomentumAndPullbackSummaryMVXWeeksAgo(4);
    return this.analyzeStocksForSingleMonth(stocks, { weeksAgo: 4, maxNegRatio, minStockCount, binsize });
  }

  async getBacktest(maxNegRatio = 0.1, minStockCount = 2, binsize = 10) {
    const stocks = await stockFilterService.getMomentumAndPullbackSummaryMVXWeeksAgo(4);
    return this.analyzeStocksForSingleMonth(stocks, { weeksAgo: 4, maxNegRatio, minStockCount, binsize });
  }

  async getBacktest6mRestricted(maxNegRatio = 0.1, minStockCount = 2, binsize = 10) {
    const stocks = await stockFilterService.getMomentumAndPullbackSummaryMV24WeeksAgo();
    return this.analyzeStocksForSingleMonth(stocks, { weeksAgo: 24, maxNegRatio, minStockCount, binsize });
  }

  async getBacktest6m(maxNegRatio = 0.1, minStockCount = 2, binsize = 10) {
    const stocks = await stockFilterService.getMomentumAndPullbackSummaryMV24WeeksAgoNONRESTRICTED();
    return this.analyzeStocksForSingleMonth(stocks, { weeksAgo: 24, maxNegRatio, minStockCount, binsize });
  }

  async getMomentumAndPullbackSummaryMVXWeeksAgo(xWeeksAgo) {
    return await stockFilterService.getMomentumAndPullbackSummaryByXWeeksAgo(xWeeksAgo);
  }

async getYearlyBacktest(maxNegRatio = 0.1, minStockCount = 2, binsize = 10, useVolatility = true) {
  const allGroups = [];

  for (let weeksAgo = 52; weeksAgo >= 4; weeksAgo -= 4) {
    const stocks = await this.getMomentumAndPullbackSummaryMVXWeeksAgo(weeksAgo);

    if (!stocks || stocks.length === 0) {
      console.warn(`No stock data found for weeksAgo=${weeksAgo}`);
      continue;
    }

    const monthlyGroups = this.analyzeStocksForSingleMonth(stocks, {
      weeksAgo,
      maxNegRatio,
      minStockCount,
      binsize,
      useVolatility
    });

    if (!monthlyGroups || monthlyGroups.length === 0) {
      console.warn(`No valid stock groups found for weeksAgo=${weeksAgo}`);
      continue;
    }

    allGroups.push(...monthlyGroups);
    console.log(`Processed weeksAgo=${weeksAgo}, got ${monthlyGroups.length} groups`);
  }

  // Aggregate all the monthly groups into yearly performance groups
  const results = this.analyzeStocksAcrossYear(allGroups, { useVolatility });

  // Filter and sort to find strong performers
  return results
    .filter(group =>
      group.totalCount >= minStockCount * 3 && group.avgNegRatio <= maxNegRatio
    )
    .sort((a, b) => b.avgProfit - a.avgProfit)
    .slice(0, 10);
}

analyzeStocksForSingleMonth(stocks, {
  weeksAgo,
  binsize = 10,
  useVolatility = true,
  sortBySharpe = false,
  minStockCount = 2,
  maxNegRatio = 1.0
}) {
  if (!stocks.length) return [];

  const momentumValues = stocks.map(s => s.momentum_score);
  const pullbackValues = stocks.map(s => s[`pullback_${weeksAgo}w_ago`]);
  const volValues = useVolatility ? stocks.map(s => s.avg_weekly_volatility) : [];

  const { bins: momentumBins } = this.getQuartileBins(momentumValues, binsize);
  const { bins: pullbackBins } = this.getQuartileBins(pullbackValues, binsize);
  const { bins: volBins } = useVolatility
    ? this.getQuartileBins(volValues, binsize)
    : { bins: [] };

  const enriched = stocks.map((s, i) => ({
    ...s,
    momentum_bin: momentumBins[i],
    pullback_bin: pullbackBins[i],
    ...(useVolatility ? { volatility_bin: volBins[i] } : {})
  }));

  const groupKeyFn = s => useVolatility
    ? `${s.momentum_bin}-${s.pullback_bin}-${s.volatility_bin}`
    : `${s.momentum_bin}-${s.pullback_bin}`;

  const grouped = _.groupBy(enriched, groupKeyFn);
  const profitKey = 'profit_4w_later_percent';

  const groups = Object.entries(grouped).map(([key, group]) => {
    const profits = group
      .map(s => s[profitKey])
      .filter(p => typeof p === 'number' && !isNaN(p));

    if (profits.length === 0) return null;

    const avg = _.mean(profits);
    const stddev = Math.sqrt(_.mean(profits.map(p => Math.pow(p - avg, 2))));
    const count = group.length;
    const negRatio = profits.filter(p => p < 0).length / count;
    const score = sortBySharpe ? (avg / stddev) : avg;

    return {
      key,
      momentum_bin: group[0].momentum_bin,
      pullback_bin: group[0].pullback_bin,
      ...(useVolatility ? { volatility_bin: group[0].volatility_bin } : {}),
      avg_profit: avg,
      stddev,
      count,
      neg_ratio: negRatio,
      score,
      weeksAgo
    };
  }).filter(g => g && g.count >= minStockCount && g.neg_ratio <= maxNegRatio);

  return groups;
}

  analyzeStocksAcrossYear(allGroups, {
    useVolatility = true
  }) {
    const comboMap = {};

    for (const group of allGroups) {
      const key = group.key;

      if (!comboMap[key]) {
        comboMap[key] = {
          key,
          momentum_bin: group.momentum_bin,
          pullback_bin: group.pullback_bin,
          ...(useVolatility ? { volatility_bin: group.volatility_bin } : {}),
          totalProfit: 0,
          totalNegRatio: 0,
          totalCount: 0,
          months: []
        };
      }

      comboMap[key].months.push({
        mean: group.avg_profit,
        count: group.count,
        neg_ratio: group.neg_ratio,
        weeksAgo: group.weeksAgo
      });

      comboMap[key].totalProfit += group.avg_profit * group.count;
      comboMap[key].totalNegRatio += group.neg_ratio * group.count;
      comboMap[key].totalCount += group.count;
    }

    return Object.values(comboMap).map(g => {
      return {
        key: g.key,
        momentum_bin: g.momentum_bin,
        pullback_bin: g.pullback_bin,
        volatility_bin: g.volatility_bin ?? null,
        avgProfit: g.totalProfit / g.totalCount,
        avgNegRatio: g.totalNegRatio / g.totalCount,
        totalCount: g.totalCount,
        monthsAppeared: g.months.length,
        months: g.months
      };
    });
  }

  getQuartileBins(values, numBins = 10) {
    const sorted = [...values].sort((a, b) => a - b);
    const n = sorted.length;
    const thresholds = [];
    for (let i = 1; i < numBins; i++) {
      const index = Math.floor((i * n) / numBins);
      thresholds.push(sorted[index]);
    }

    const bins = values.map(val => {
      for (let i = 0; i < thresholds.length; i++) {
        if (val <= thresholds[i]) return i;
      }
      return thresholds.length;
    });

    return { bins, thresholds };
  }

  getRange(thresholds, binIndex, minValue, maxValue) {
    const min = binIndex === 0 ? minValue : thresholds[binIndex - 1];
    const max = binIndex < thresholds.length ? thresholds[binIndex] : maxValue;
    return [min, max];
  }

  getMinMax(values) {
    return {
      min: Math.min(...values),
      max: Math.max(...values)
    };
  }
}

module.exports = BacktestService;
