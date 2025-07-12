const axios = require('axios');
const { parse } = require('csv-parse/sync');
const yahooFinance = require('yahoo-finance2').default;

class StockFilterService {
  constructor() {
    this.value = 1;
  }

  async getNasdaqSymbols() {
    const url = 'https://www.nasdaqtrader.com/dynamic/symdir/nasdaqlisted.txt';

    // Use axios instead of fetch
    const res = await axios.get(url);
    const text = res.data;

    const records = parse(text, {
      delimiter: '|',
      columns: true,
      skip_empty_lines: true,
    });

    return records
      .filter(r => r['Test Issue'] === 'N' && r.Symbol && !r.Symbol.includes('.'))
      .map(r => r.Symbol);
  }

  async get12MonthReturn(symbol) {
    try {
      const queryOptions = { period1: '2022-06-01', period2: '2023-07-01', interval: '1mo' };
      const result = await yahooFinance.historical(symbol, queryOptions);

      if (result && result.length >= 13) {
        const startPrice = result[0].close;
        const endPrice = result[result.length - 1].close;
        if (startPrice > 0) {
          const return12m = (endPrice / startPrice) - 1;
          return { symbol, return12m };
        }
      }
    } catch (e) {
      // ignore errors silently
    }
    return null;
  }

  async main() {
    console.log('Fetching Nasdaq symbols...');
    const symbols = await this.getNasdaqSymbols();

    console.log(`Got ${symbols.length} symbols, fetching 12-month returns...`);

    const results = [];
    const concurrencyLimit = 5;
    for (let i = 0; i < symbols.length; i += concurrencyLimit) {
      const batch = symbols.slice(i, i + concurrencyLimit);
      const promises = batch.map(sym => this.get12MonthReturn(sym));
      const batchResults = await Promise.all(promises);
      batchResults.forEach(r => r && results.push(r));
      console.log(`Processed ${i + batch.length} / ${symbols.length}`);
    }

    const positiveMomentum = results.filter(r => r.return12m > 0);
    positiveMomentum.sort((a, b) => b.return12m - a.return12m);
    const top50 = positiveMomentum.slice(0, 50);

    console.log('Top 50 stocks by dual momentum (12m return):');
    top50.forEach(({ symbol, return12m }, i) => {
      console.log(`${i + 1}. ${symbol}: ${(return12m * 100).toFixed(2)}%`);
    });
  }
}

module.exports = StockFilterService;
