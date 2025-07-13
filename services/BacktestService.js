const _ = require('lodash');
const StockFilterService = require('./StockFilterService.js');
const stockFilterService = new StockFilterService();

class BacktestService {
  constructor() {}

  async getBacktestRestricted(maxNegRatio = 0.1, minStockCount = 2, binsize = 10) {
    const stocks = await stockFilterService.getMomentumAndPullbackSummaryMV4WeeksAgo();
    return this.analyzeStocks(stocks, maxNegRatio, 4, minStockCount, binsize);
  }

  async getBacktest(maxNegRatio = 0.1, minStockCount = 2, binsize = 10) {
    const stocks = await stockFilterService.getMomentumAndPullbackSummaryMV4WeeksAgoNONRESTRCTED();
    return this.analyzeStocks(stocks, maxNegRatio, 4, minStockCount, binsize);
  }

  async getBacktestWithoutvol(maxNegRatio = 0.1, minStockCount = 2, binsize = 10) {
    const stocks = await stockFilterService.getMomentumAndPullbackSummaryMV4WeeksAgoNONRESTRCTED();
    return this.analyzeStocksWithoutvol(stocks, maxNegRatio, 4, minStockCount, binsize);
  }



  async getBacktest6mRestricted(maxNegRatio = 0.1, minStockCount = 2, binsize = 10) {
    const stocks = await stockFilterService.getMomentumAndPullbackSummaryMV24WeeksAgo();
    return this.analyzeStocks(stocks, maxNegRatio, 24, minStockCount, binsize);
  }

  async getBacktest6m(maxNegRatio = 0.1, minStockCount = 2, binsize = 10) {
    const stocks = await stockFilterService.getMomentumAndPullbackSummaryMV24WeeksAgoNONRESTRICTED();
    return this.analyzeStocks(stocks, maxNegRatio, 24, minStockCount, binsize);
  }

 getQuartileBins(values, numBins = 15) {
  const sorted = [...values].sort((a, b) => a - b); // Sort the values in ascending order
  const n = sorted.length;

  const thresholds = [];
  for (let i = 1; i < numBins; i++) {
    const index = Math.floor((i * n) / numBins);
    thresholds.push(sorted[index]); // Calculate the thresholds for each bin
  }

  // Log the thresholds to see how the bins are being calculated
  console.log('Thresholds:', thresholds);

  // Return bins for each value AND the thresholds for later range calculations
  const bins = values.map((val) => {
    for (let i = 0; i < thresholds.length; i++) {
      if (val <= thresholds[i]) return i;
    }
    return thresholds.length; // Last bin for values greater than the highest threshold
  });


  return { bins, thresholds };
}
  getMinMax(values) {
    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }

  getRange(thresholds, binIndex, minValue, maxValue) {
    const min = binIndex === 0 ? minValue : thresholds[binIndex - 1];
    const max = binIndex < thresholds.length ? thresholds[binIndex] : maxValue;
    return [min, max];
  }

  analyzeStocks(stocks, maxNegRatio, weeksAgo = 4, minStockCount = 2, binsize=10) {
    if (!stocks.length) return { top_combinations: [], stocks_by_combination: {} };

    const momentumValues = stocks.map(s => s.momentum_score);
    const pullbackValues = stocks.map(s => s[`pullback_${weeksAgo}w_ago`]);
    const volValues = stocks.map(s => s.avg_weekly_volatility);

    const { bins: momentumBins, thresholds: momentumThresholds } = this.getQuartileBins(momentumValues, binsize);
    const { bins: pullbackBins, thresholds: pullbackThresholds } = this.getQuartileBins(pullbackValues, binsize);
    const { bins: volBins, thresholds: volThresholds } = this.getQuartileBins(volValues, binsize);

    const momentumMinMax = this.getMinMax(momentumValues);
    const pullbackMinMax = this.getMinMax(pullbackValues);
    const volMinMax = this.getMinMax(volValues);

    const enriched = stocks.map((s, i) => ({
      ...s,
      momentum_bin: momentumBins[i],
      pullback_bin: pullbackBins[i],
      volatility_bin: volBins[i]
    }));

    const grouped = _.groupBy(enriched, s => `${s.momentum_bin}-${s.pullback_bin}-${s.volatility_bin}`);

    const groups = Object.entries(grouped)
      .map(([key, group]) => {
        const profits = group.map(s => s[`price_change_since_${weeksAgo}w_percent`]);
        const avg = _.mean(profits);
        const count = group.length;
        const negRatio = profits.filter(p => p < 0).length / count;

        return {
          key,
          momentum_bin: group[0].momentum_bin,
          pullback_bin: group[0].pullback_bin,
          volatility_bin: group[0].volatility_bin,
          avg_profit: avg,
          count,
          neg_ratio: negRatio,
          stocks: group
        };
      })
      .filter(g => g.count >= minStockCount && g.neg_ratio <= maxNegRatio)
      .sort((a, b) => b.avg_profit - a.avg_profit)
      .slice(0, 5);

    const top_combinations = groups.map(g => {
      const momentumRange = this.getRange(momentumThresholds, g.momentum_bin, momentumMinMax.min, momentumMinMax.max);
      const pullbackRange = this.getRange(pullbackThresholds, g.pullback_bin, pullbackMinMax.min, pullbackMinMax.max);
      const volatilityRange = this.getRange(volThresholds, g.volatility_bin, volMinMax.min, volMinMax.max);

      return {
        key: g.key,
        momentum: `[${momentumRange[0].toFixed(4)} - ${momentumRange[1].toFixed(4)}]`,
        pullback: `[${pullbackRange[0].toFixed(4)} - ${pullbackRange[1].toFixed(4)}]`,
        volatility: `[${volatilityRange[0].toFixed(4)} - ${volatilityRange[1].toFixed(4)}]`,
        mean: g.avg_profit,
        count: g.count,
        neg_ratio: g.neg_ratio
      };
    });

    const stocks_by_combination = {};
    for (const group of groups) {
      stocks_by_combination[group.key] = group.stocks;
    }

    return { top_combinations, stocks_by_combination };
  }

  analyzeStocksWithoutvol(stocks, maxNegRatio, weeksAgo = 4, minStockCount = 2, binsize = 10) {
  if (!stocks.length) return { top_combinations: [], stocks_by_combination: {} };

  const momentumValues = stocks.map(s => s.momentum_score);
  const pullbackValues = stocks.map(s => s[`pullback_${weeksAgo}w_ago`]);

  const { bins: momentumBins, thresholds: momentumThresholds } = this.getQuartileBins(momentumValues, binsize);
  const { bins: pullbackBins, thresholds: pullbackThresholds } = this.getQuartileBins(pullbackValues, binsize);

  const momentumMinMax = this.getMinMax(momentumValues);
  const pullbackMinMax = this.getMinMax(pullbackValues);

  const enriched = stocks.map((s, i) => ({
    ...s,
    momentum_bin: momentumBins[i],
    pullback_bin: pullbackBins[i]
  }));

  const grouped = _.groupBy(enriched, s => `${s.momentum_bin}-${s.pullback_bin}`);

  const groups = Object.entries(grouped)
    .map(([key, group]) => {
      const profits = group.map(s => s[`price_change_since_${weeksAgo}w_percent`]);
      const avg = _.mean(profits);
      const count = group.length;
      const negRatio = profits.filter(p => p < 0).length / count;

      return {
        key,
        momentum_bin: group[0].momentum_bin,
        pullback_bin: group[0].pullback_bin,
        avg_profit: avg,
        count,
        neg_ratio: negRatio,
        stocks: group
      };
    })
    .filter(g => g.count >= minStockCount && g.neg_ratio <= maxNegRatio)
    .sort((a, b) => b.avg_profit - a.avg_profit)
    .slice(0, 5);

  const top_combinations = groups.map(g => {
    const momentumRange = this.getRange(momentumThresholds, g.momentum_bin, momentumMinMax.min, momentumMinMax.max);
    const pullbackRange = this.getRange(pullbackThresholds, g.pullback_bin, pullbackMinMax.min, pullbackMinMax.max);

    return {
      key: g.key,
      momentum: `[${momentumRange[0].toFixed(4)} - ${momentumRange[1].toFixed(4)}]`,
      pullback: `[${pullbackRange[0].toFixed(4)} - ${pullbackRange[1].toFixed(4)}]`,
      mean: g.avg_profit,
      count: g.count,
      neg_ratio: g.neg_ratio
    };
  });

  const stocks_by_combination = {};
  for (const group of groups) {
    stocks_by_combination[group.key] = group.stocks;
  }

  return { top_combinations, stocks_by_combination };
}


  
}

module.exports = BacktestService;
