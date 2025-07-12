const axios = require('axios');
const { parse } = require('csv-parse/sync');
const yahooFinance = require('yahoo-finance2').default;
const fs = require('fs').promises;
const Database = require('better-sqlite3');

class StockFilterService {
  constructor() {}

  /**
   * Reads and parses the local Nasdaq symbol file.
   */
  async getNasdaqSymbols() {
    try {
      const filePath = './tmp/nasdaqlisted.txt';
      const text = await fs.readFile(filePath, 'utf8');

      const cleanedText = text
        .split('\n')
        .filter(line => !line.startsWith('File Creation Time'))
        .join('\n');

      const records = parse(cleanedText, {
        delimiter: '|',
        columns: true,
        skip_empty_lines: true,
      });

      return records
        .filter(r => r['Test Issue'] === 'N' && r.Symbol && !r.Symbol.includes('.'))
        .map(r => r.Symbol);
    } catch (err) {
      console.error('Failed to read or parse nasdaqlisted.txt:', err.message);
      return [];
    }
  }

  async getSymbolData(symbol = 'AAPL', interval = '5d', range = '1y') {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
    try {
      const response = await axios.get(url, {
        params: { interval, range },
      });
      return response.data.chart.result[0]; // raw JSON from Yahoo
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error.message);
      return null;
    }
  }

  async saveDataToDb(dbFile, symbol, data) {
    try {
      // Make sure directory for dbFile exists before this in your app
      // e.g. fs.mkdirSync(path.dirname(dbFile), { recursive: true })

      // Open or create database file from parameter
      const db = new Database(dbFile);

      // Create table if it doesn't exist
      db.exec(`
        CREATE TABLE IF NOT EXISTS stock_weekly (
          symbol TEXT,
          timestamp INTEGER,
          open REAL,
          high REAL,
          low REAL,
          close REAL,
          volume INTEGER,
          PRIMARY KEY(symbol, timestamp)
        );
      `);

      const insertStmt = db.prepare(`
        INSERT OR IGNORE INTO stock_weekly (symbol, timestamp, open, high, low, close, volume)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      const insertMany = db.transaction((timestamps, quotes) => {
        for (let i = 0; i < timestamps.length; i++) {
          insertStmt.run(
            symbol,
            timestamps[i],
            quotes.open[i],
            quotes.high[i],
            quotes.low[i],
            quotes.close[i],
            quotes.volume[i]
          );
        }
      });

      const quotes = data.indicators.quote[0];
      insertMany(data.timestamp, quotes);

      console.log(`Data for ${symbol} saved to DB successfully.`);
      db.close();
    } catch (err) {
      console.error('SQLite error:', err);
    }
  }

  async fetchAndStore(symbol, dbFile = './db/stocks.db') {
    const data = await this.getSymbolData(symbol);
    if (data) {
      await this.saveDataToDb(dbFile, symbol, data);
    } else {
      console.warn(`No data fetched for symbol ${symbol}, skipping DB save.`);
    }
  }

  async fetchAndStoreAllSymbols(dbFile = './db/stocks.db') {
    const symbols = await this.getNasdaqSymbols();

    console.log(`Fetched ${symbols.length} symbols.`);

    for (const symbol of symbols) {
      console.log(`Processing symbol: ${symbol}`);
      const data = await this.getSymbolData(symbol);
      if (data) {
        await this.saveDataToDb(dbFile, symbol, data);
      } else {
        console.warn(`No data fetched for symbol ${symbol}, skipping DB save.`);
      }
    }

    console.log('All symbols processed.');
  }

    getMomentumAndPullbackSummary(dbFile = './db/stocks.db') {
    const db = new Database(dbFile);

    const summary = db.prepare(`
        WITH RankedWeeks AS (
        SELECT
            symbol,
            timestamp,
            close,
            ROW_NUMBER() OVER (PARTITION BY symbol ORDER BY timestamp DESC) AS rn
        FROM stock_weekly
        ),
        LatestWeek AS (
        SELECT
            symbol,
            timestamp AS latest_timestamp,
            close AS close_latest
        FROM RankedWeeks
        WHERE rn = 1
        ),
        Week52Ago AS (
        SELECT
            symbol,
            timestamp AS ts_52w_ago,
            close AS close_52w_ago
        FROM RankedWeeks
        WHERE rn = 52
        ),
        WeekBeforeLatest AS (
        SELECT
            symbol,
            timestamp AS ts_before_latest,
            close AS close_before_latest
        FROM RankedWeeks
        WHERE rn = 2
        ),
        WeeklyReturns AS (
        SELECT
            symbol,
            (close * 1.0 / LAG(close) OVER (PARTITION BY symbol ORDER BY timestamp) - 1) AS weekly_return
        FROM stock_weekly
        WHERE timestamp IS NOT NULL
        ),
        Volatility AS (
        SELECT
            symbol,
            AVG(ABS(weekly_return)) AS avg_abs_weekly_return
        FROM WeeklyReturns
        GROUP BY symbol
        )
        SELECT
        lw.symbol,
        (wbl.close_before_latest * 1.0 / w52.close_52w_ago) - 1 AS yearly_momentum,
        (lw.close_latest * 1.0 / wbl.close_before_latest) - 1 AS latest_week_pullback,
        v.avg_abs_weekly_return AS avg_weekly_volatility
        FROM LatestWeek lw
        JOIN WeekBeforeLatest wbl ON lw.symbol = wbl.symbol
        JOIN Week52Ago w52 ON lw.symbol = w52.symbol
        JOIN Volatility v ON lw.symbol = v.symbol
        WHERE
        (wbl.close_before_latest * 1.0 / w52.close_52w_ago) - 1 > 0
        AND (lw.close_latest * 1.0 / wbl.close_before_latest) - 1 BETWEEN -0.05 AND -0.01
        AND v.avg_abs_weekly_return < 0.07 -- adjust this threshold for "stable"
        ORDER BY yearly_momentum DESC;
    `).all();

    db.close();
    return summary;
    }


    //Moskowitz, Ooi & Pedersen (2012) paper on Momentum Investing with Pullbacks

    getMomentumAndPullbackSummaryMV(dbFile = './db/stocks.db') {
    const db = new Database(dbFile);

    const summary = db.prepare(`
        WITH RankedWeeks AS (
        SELECT
            symbol,
            timestamp,
            close,
            ROW_NUMBER() OVER (PARTITION BY symbol ORDER BY timestamp DESC) AS rn
        FROM stock_weekly
        ),
        LatestWeek AS (
        SELECT
            symbol,
            timestamp AS latest_timestamp,
            close AS close_latest
        FROM RankedWeeks
        WHERE rn = 1
        ),
        Week52Ago AS (
        SELECT
            symbol,
            timestamp AS ts_52w_ago,
            close AS close_52w_ago
        FROM RankedWeeks
        WHERE rn = 52
        ),
        WeekBeforeLatest AS (
        SELECT
            symbol,
            timestamp AS ts_before_latest,
            close AS close_before_latest
        FROM RankedWeeks
        WHERE rn = 2
        ),
        WeeklyReturns AS (
        SELECT
            symbol,
            (close * 1.0 / LAG(close) OVER (PARTITION BY symbol ORDER BY timestamp) - 1) AS weekly_return
        FROM stock_weekly
        WHERE timestamp IS NOT NULL
        ),
        Volatility AS (
        SELECT
            symbol,
            AVG(ABS(weekly_return)) AS avg_abs_weekly_return
        FROM WeeklyReturns
        GROUP BY symbol
        )
        SELECT
        lw.symbol,
        (wbl.close_before_latest * 1.0 / w52.close_52w_ago) - 1 AS yearly_momentum,
        (lw.close_latest * 1.0 / wbl.close_before_latest) - 1 AS latest_week_pullback,
        v.avg_abs_weekly_return AS avg_weekly_volatility,
        ((wbl.close_before_latest * 1.0 / w52.close_52w_ago) - 1) / v.avg_abs_weekly_return AS momentum_score
        FROM LatestWeek lw
        JOIN WeekBeforeLatest wbl ON lw.symbol = wbl.symbol
        JOIN Week52Ago w52 ON lw.symbol = w52.symbol
        JOIN Volatility v ON lw.symbol = v.symbol
        WHERE
        (wbl.close_before_latest * 1.0 / w52.close_52w_ago) - 1 > 0 -- positive momentum
        AND (lw.close_latest * 1.0 / wbl.close_before_latest) - 1 BETWEEN -0.05 AND -0.01 -- mild pullback
        AND v.avg_abs_weekly_return < 0.07 -- smooth volatility
        ORDER BY momentum_score DESC;
    `).all();

    db.close();
    return summary;
    }
}

module.exports = StockFilterService;
