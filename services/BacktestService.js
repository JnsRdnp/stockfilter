const _ = require('lodash');
const StockFilterService = require('./StockFilterService.js');
const stockFilterService = new StockFilterService();
const fs = require('fs');
const ExcelJS = require('exceljs');

class BacktestService {
  constructor() {}

  async getBacktestRestricted(maxNegRatio = 0.1, minStockCount = 2, binsize = 10) {
    const stocks = await stockFilterService.getMomentumAndPullbackSummaryMVXWeeksAgo(4);
    const { groups, thresholds } = this.analyzeStocksForSingleMonth(stocks, { weeksAgo: 4, maxNegRatio, minStockCount, binsize });

    console.log('Thresholds:', thresholds);
    return groups;
  }

  async getBacktest(maxNegRatio = 0.1, minStockCount = 2, binsize = 10) {
    const stocks = await stockFilterService.getMomentumAndPullbackSummaryMVXWeeksAgo(4);
    const { groups, thresholds } = this.analyzeStocksForSingleMonth(stocks, { weeksAgo: 4, maxNegRatio, minStockCount, binsize });

    console.log('Thresholds:', thresholds);
    return groups;
  }

  async getBacktest6mRestricted(maxNegRatio = 0.1, minStockCount = 2, binsize = 10) {
    const stocks = await stockFilterService.getMomentumAndPullbackSummaryMV24WeeksAgo();
    const { groups, thresholds } = this.analyzeStocksForSingleMonth(stocks, { weeksAgo: 24, maxNegRatio, minStockCount, binsize });

    console.log('Thresholds:', thresholds);
    return groups;
  }

  async getBacktest6m(maxNegRatio = 0.1, minStockCount = 2, binsize = 10) {
    const stocks = await stockFilterService.getMomentumAndPullbackSummaryMV24WeeksAgoNONRESTRICTED();
    const { groups, thresholds } = this.analyzeStocksForSingleMonth(stocks, { weeksAgo: 24, maxNegRatio, minStockCount, binsize });

    console.log('Thresholds:', thresholds);
    return groups;
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

      const { groups: monthlyGroups, thresholds } = this.analyzeStocksForSingleMonth(stocks, {
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
      console.log(`Thresholds for weeksAgo=${weeksAgo}:`, thresholds);
    }

    const results = this.analyzeStocksAcrossYear(allGroups, { useVolatility });

    const topGroups = results
      .filter(group => group.totalCount >= minStockCount * 3 && group.avgNegRatio <= maxNegRatio)
      .sort((a, b) => b.avgProfit - a.avgProfit)
      .slice(0, 10);

    // NEW: Export detailed stock trades for the top one
    if (topGroups.length > 0) {
      await this.exportTopGroupDetails(topGroups[0].key, useVolatility, minStockCount, maxNegRatio, binsize);
    }

    return topGroups;
  }

analyzeStocksForSingleMonth(stocks, {
  weeksAgo,
  binsize = 10,
  useVolatility = true,
  sortBySharpe = false,
  minStockCount = 2,
  maxNegRatio = 1.0
}) {
  if (!stocks.length) return { groups: [], thresholds: {} };

  const momentumValues = stocks.map(s => s.yearly_momentum);
  const pullbackValues = stocks.map(s => s[`pullback_${weeksAgo}w_ago`]);
  const volValues = useVolatility ? stocks.map(s => s.yearly_volatility) : [];

  const {
    bins: momentumBins,
    thresholds: momentumThresholds
  } = this.getQuartileBins(momentumValues, binsize);
  const {
    bins: pullbackBins,
    thresholds: pullbackThresholds
  } = this.getQuartileBins(pullbackValues, binsize);
  const {
    bins: volBins,
    thresholds: volatilityThresholds
  } = useVolatility
    ? this.getQuartileBins(volValues, binsize)
    : { bins: [], thresholds: [] };

  const momentumMinMax = this.getMinMax(momentumValues);
  const pullbackMinMax = this.getMinMax(pullbackValues);
  const volatilityMinMax = useVolatility ? this.getMinMax(volValues) : {};

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

    const momentum_bin = group[0].momentum_bin;
    const pullback_bin = group[0].pullback_bin;
    const volatility_bin = useVolatility ? group[0].volatility_bin : null;

    const momentum_range = this.getRange(momentumThresholds, momentum_bin, momentumMinMax.min, momentumMinMax.max);
    const pullback_range = this.getRange(pullbackThresholds, pullback_bin, pullbackMinMax.min, pullbackMinMax.max);
    const volatility_range = useVolatility
      ? this.getRange(volatilityThresholds, volatility_bin, volatilityMinMax.min, volatilityMinMax.max)
      : null;

    return {
      key,
      momentum_bin,
      momentum_range,
      pullback_bin,
      pullback_range,
      ...(useVolatility
        ? { volatility_bin, volatility_range }
        : {}),
      avg_profit: avg,
      stddev,
      count,
      neg_ratio: negRatio,
      score,
      weeksAgo
    };
  }).filter(g => g && g.count >= minStockCount && g.neg_ratio <= maxNegRatio);

  return {
    groups,
    thresholds: {
      momentum: momentumThresholds,
      pullback: pullbackThresholds,
      ...(useVolatility ? { volatility: volatilityThresholds } : {})
    }
  };
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
            momentum_range: group.momentum_range,
            pullback_bin: group.pullback_bin,
            pullback_range: group.pullback_range,
            ...(useVolatility
              ? {
                  volatility_bin: group.volatility_bin,
                  volatility_range: group.volatility_range
                }
              : {}),
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

    return Object.values(comboMap).map(g => ({
      key: g.key,
      momentum_bin: g.momentum_bin,
      momentum_range: g.momentum_range,
      pullback_bin: g.pullback_bin,
      pullback_range: g.pullback_range,
      ...(useVolatility
        ? {
            volatility_bin: g.volatility_bin,
            volatility_range: g.volatility_range
          }
        : {}),
      avgProfit: g.totalProfit / g.totalCount,
      avgNegRatio: g.totalNegRatio / g.totalCount,
      totalCount: g.totalCount,
      monthsAppeared: g.months.length,
      months: g.months
    }));
  }

  getQuartileBins(values, numBins = 10) {
    const numeric = values.filter(v => typeof v === 'number' && !isNaN(v));
    const sorted = [...numeric].sort((a, b) => a - b);
    const n = sorted.length;
    const thresholds = [];

    for (let i = 1; i < numBins; i++) {
      const index = Math.floor((i * n) / numBins);
      if (index < n) thresholds.push(sorted[index]);
    }

    const bins = values.map(val => {
      if (typeof val !== 'number' || isNaN(val)) return null;
      for (let i = 0; i < thresholds.length; i++) {
        if (val <= thresholds[i]) return i;
      }
      return thresholds.length;
    });

    return { bins, thresholds };
  }

  getRange(thresholds, binIndex, minValue, maxValue) {
    if (
      !Array.isArray(thresholds) ||
      typeof binIndex !== 'number' ||
      isNaN(binIndex)
    ) {
      return [null, null];
    }

    const min = binIndex === 0 ? minValue : thresholds[binIndex - 1];
    const max = binIndex < thresholds.length ? thresholds[binIndex] : maxValue;

    if ([min, max].some(v => typeof v !== 'number' || isNaN(v))) {
      return [null, null];
    }

    return [min, max];
  }

  getMinMax(values) {
    const numeric = values.filter(v => typeof v === 'number' && !isNaN(v));
    return {
      min: Math.min(...numeric),
      max: Math.max(...numeric)
    };
  }


async exportTopGroupDetails(topGroupKey, useVolatility = true, minStockCount = 2, maxNegRatio = 0.1, binsize = 10) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Top Group Details');

  sheet.columns = [
    { header: 'Weeks Ago', key: 'weeksAgo', width: 12 },
    { header: 'Ticker', key: 'ticker', width: 10 },
    { header: 'Profit %', key: 'profit', width: 10 },
    { header: 'Momentum', key: 'momentum', width: 12 },
    { header: 'Pullback', key: 'pullback', width: 12 },
    ...(useVolatility ? [{ header: 'Volatility', key: 'volatility', width: 12 }] : []),
    { header: 'Momentum Bin', key: 'momentum_bin', width: 14 },
    { header: 'Pullback Bin', key: 'pullback_bin', width: 14 },
    ...(useVolatility ? [{ header: 'Volatility Bin', key: 'volatility_bin', width: 14 }] : [])
  ];

  for (let weeksAgo = 52; weeksAgo >= 4; weeksAgo -= 4) {
    const stocks = await this.getMomentumAndPullbackSummaryMVXWeeksAgo(weeksAgo);
    const { groups, thresholds } = this.analyzeStocksForSingleMonth(stocks, {
      weeksAgo,
      maxNegRatio,
      minStockCount,
      binsize,
      useVolatility
    });

    const topGroup = groups.find(g => g.key === topGroupKey);
    if (!topGroup) continue;

    // Compute bin values consistently across all stocks
    const momentumValues = stocks.map(s => s.yearly_momentum);
    const pullbackValues = stocks.map(s => s[`pullback_${weeksAgo}w_ago`]);
    const volValues = useVolatility ? stocks.map(s => s.yearly_volatility) : [];

    const momentumBins = this.getQuartileBins(momentumValues, binsize).bins;
    const pullbackBins = this.getQuartileBins(pullbackValues, binsize).bins;
    const volBins = useVolatility ? this.getQuartileBins(volValues, binsize).bins : [];

    const enriched = stocks.map((s, i) => ({
      ...s,
      momentum_bin: momentumBins[i],
      pullback_bin: pullbackBins[i],
      volatility_bin: useVolatility ? volBins[i] : undefined
    }));

    // Filter only the stocks that belong to the top group
    const groupMembers = enriched.filter(s => {
      const groupKey = useVolatility
        ? `${s.momentum_bin}-${s.pullback_bin}-${s.volatility_bin}`
        : `${s.momentum_bin}-${s.pullback_bin}`;
      return groupKey === topGroupKey;
    });

    // Add rows to sheet
    for (const stock of groupMembers) {
      sheet.addRow({
        weeksAgo,
        ticker: stock.symbol,
        profit: stock.profit_4w_later_percent,
        momentum: stock.yearly_momentum,
        pullback: stock[`pullback_${weeksAgo}w_ago`],
        volatility: useVolatility ? stock.yearly_volatility : undefined,
        momentum_bin: stock.momentum_bin,
        pullback_bin: stock.pullback_bin,
        volatility_bin: useVolatility ? stock.volatility_bin : undefined
      });
    }
  }

  await workbook.xlsx.writeFile('./top_group_details.xlsx');
  console.log('Top group trade details written to top_group_details.xlsx');
}
}

module.exports = BacktestService;
