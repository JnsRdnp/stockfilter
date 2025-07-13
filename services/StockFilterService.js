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

  async getSymbolData2y(symbol = 'AAPL', interval = '5d', range = '2y') {
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

    async saveDataToDb2y(dbFile, symbol, data) {
    try {
      // Make sure directory for dbFile exists before this in your app
      // e.g. fs.mkdirSync(path.dirname(dbFile), { recursive: true })

      // Open or create database file from parameter
      const db = new Database(dbFile);

      // Create table if it doesn't exist
      db.exec(`
        CREATE TABLE IF NOT EXISTS stock_weeklytwoyear (
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
        INSERT OR IGNORE INTO stock_weeklytwoyear (symbol, timestamp, open, high, low, close, volume)
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

  async fetchAndStore(symbol) {
    const dbFile = './db/stocks.db'
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


  async fetchAndStoreAllSymbols2year(dbFile = './db/stocks.db') {
    const symbols = await this.getNasdaqSymbols();

    console.log(`Fetched ${symbols.length} symbols.`);

    for (const symbol of symbols) {
      console.log(`Processing symbol: ${symbol}`);
      const data = await this.getSymbolData2y(symbol);
      if (data) {
        await this.saveDataToDb2y(dbFile, symbol, data);
      } else {
        console.warn(`No data fetched for symbol ${symbol}, skipping DB save.`);
      }
    }

    console.log('All symbols processed.');
  }

  getMomentumAndPullbackSummary() {
    const dbFile = './db/stocks.db'
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
    getMomentumAndPullbackSummaryMV() {
    const dbFile = './db/stocks.db'
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


    getMomentumAndPullbackSummaryMVOPTIMIZED() {
      const dbFile = './db/stocks.db';
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
            (wbl.close_before_latest * 1.0 / w52.close_52w_ago) - 1 > 0.00152
            AND (lw.close_latest * 1.0 / wbl.close_before_latest) - 1 BETWEEN -0.0509 AND -0.0336
            AND v.avg_abs_weekly_return BETWEEN 0.0228 AND 0.0327
          ORDER BY momentum_score DESC;
        `).all();

        db.close();
        return summary;
}

 async getMomentumAndPullbackSummaryMV4WeeksAgo() {
  const dbFile = './db/stocks.db';
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
    FourWeeksAgo AS (
      SELECT
        symbol,
        timestamp AS ts_4w_ago,
        close AS close_4w_ago
      FROM RankedWeeks
      WHERE rn = 5  -- 4 weeks ago
    ),
    FiveWeeksAgo AS (
      SELECT
        symbol,
        timestamp AS ts_5w_ago,
        close AS close_5w_ago
      FROM RankedWeeks
      WHERE rn = 6  -- week before 4 weeks ago
    ),
    Week52Ago AS (
      SELECT
        symbol,
        timestamp AS ts_52w_ago,
        close AS close_52w_ago
      FROM RankedWeeks
      WHERE rn = 52  -- 52 weeks ago (1 year ago from latest)
    ),
    LatestWeek AS (
      SELECT
        symbol,
        close AS latest_close
      FROM RankedWeeks
      WHERE rn = 1
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
      f4.symbol,
      f4.ts_4w_ago AS buy_date,
      f4.close_4w_ago AS buy_price,
      (f5.close_5w_ago * 1.0 / w52.close_52w_ago) - 1 AS yearly_momentum,
      (f4.close_4w_ago * 1.0 / f5.close_5w_ago) - 1 AS pullback_4w_ago,
      v.avg_abs_weekly_return AS avg_weekly_volatility,
      ((f5.close_5w_ago * 1.0 / w52.close_52w_ago) - 1) / v.avg_abs_weekly_return AS momentum_score,
      ROUND(((lw.latest_close - f4.close_4w_ago) * 100.0 / f4.close_4w_ago), 2) AS price_change_since_4w_percent
    FROM FourWeeksAgo f4
    JOIN FiveWeeksAgo f5 ON f4.symbol = f5.symbol
    JOIN Week52Ago w52 ON f4.symbol = w52.symbol
    JOIN Volatility v ON f4.symbol = v.symbol
    JOIN LatestWeek lw ON f4.symbol = lw.symbol
    WHERE
      (f5.close_5w_ago * 1.0 / w52.close_52w_ago) - 1 > 0
      AND (f4.close_4w_ago * 1.0 / f5.close_5w_ago) - 1 BETWEEN -0.05 AND -0.01
      AND v.avg_abs_weekly_return < 0.07
    ORDER BY momentum_score DESC;
  `).all();

  db.close();
  return summary;
}


async getMomentumAndPullbackSummaryMV24WeeksAgo() {
  const dbFile = './db/stocks.db';
  const db = new Database(dbFile);

  const summary = db.prepare(`
    WITH RankedWeeks AS (
      SELECT
        symbol,
        timestamp,
        close,
        ROW_NUMBER() OVER (PARTITION BY symbol ORDER BY timestamp DESC) AS rn
      FROM stock_weeklytwoyear
    ),
    TwentyFourWeeksAgo AS (
      SELECT
        symbol,
        timestamp AS ts_24w_ago,
        close AS close_24w_ago
      FROM RankedWeeks
      WHERE rn = 25  -- 24 weeks ago
    ),
    TwentyFiveWeeksAgo AS (
      SELECT
        symbol,
        timestamp AS ts_25w_ago,
        close AS close_25w_ago
      FROM RankedWeeks
      WHERE rn = 26  -- week before 24 weeks ago
    ),
    Week52Ago AS (
      SELECT
        symbol,
        timestamp AS ts_52w_ago,
        close AS close_52w_ago
      FROM RankedWeeks
      WHERE rn = 52  -- 52 weeks ago
    ),
    LatestWeek AS (
      SELECT
        symbol,
        close AS latest_close
      FROM RankedWeeks
      WHERE rn = 1
    ),
    WeeklyReturns AS (
      SELECT
        symbol,
        (close * 1.0 / LAG(close) OVER (PARTITION BY symbol ORDER BY timestamp) - 1) AS weekly_return
      FROM stock_weeklytwoyear
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
      f24.symbol,
      f24.ts_24w_ago AS buy_date,
      f24.close_24w_ago AS buy_price,
      (f25.close_25w_ago * 1.0 / w52.close_52w_ago) - 1 AS yearly_momentum,
      (f24.close_24w_ago * 1.0 / f25.close_25w_ago) - 1 AS pullback_24w_ago,
      v.avg_abs_weekly_return AS avg_weekly_volatility,
      ((f25.close_25w_ago * 1.0 / w52.close_52w_ago) - 1) / v.avg_abs_weekly_return AS momentum_score,
      ROUND(((lw.latest_close - f24.close_24w_ago) * 100.0 / f24.close_24w_ago), 2) AS price_change_since_24w_percent
    FROM TwentyFourWeeksAgo f24
    JOIN TwentyFiveWeeksAgo f25 ON f24.symbol = f25.symbol
    JOIN Week52Ago w52 ON f24.symbol = w52.symbol
    JOIN Volatility v ON f24.symbol = v.symbol
    JOIN LatestWeek lw ON f24.symbol = lw.symbol
    WHERE
      (f25.close_25w_ago * 1.0 / w52.close_52w_ago) - 1 > 0
      AND (f24.close_24w_ago * 1.0 / f25.close_25w_ago) - 1 BETWEEN -0.05 AND -0.01
      AND v.avg_abs_weekly_return < 0.07
    ORDER BY momentum_score DESC;
  `).all();

  db.close();
  return summary;
}

async getMomentumAndPullbackSummaryMV24WeeksAgoNONRESTRICTED() {
  const dbFile = './db/stocks.db';
  const db = new Database(dbFile);

const summary = db.prepare(`
  WITH RankedWeeks AS (
    SELECT
      symbol,
      timestamp,
      close,
      ROW_NUMBER() OVER (PARTITION BY symbol ORDER BY timestamp DESC) AS rn
    FROM stock_weeklytwoyear
  ),
  TwentyFourWeeksAgo AS (
    SELECT
      symbol,
      timestamp AS ts_24w_ago,
      close AS close_24w_ago
    FROM RankedWeeks
    WHERE rn = 25
  ),
  TwentyFiveWeeksAgo AS (
    SELECT
      symbol,
      timestamp AS ts_25w_ago,
      close AS close_25w_ago
    FROM RankedWeeks
    WHERE rn = 26
  ),
  Week52Ago AS (
    SELECT
      symbol,
      timestamp AS ts_52w_ago,
      close AS close_52w_ago
    FROM RankedWeeks
    WHERE rn = 52
  ),
  LatestWeek AS (
    SELECT
      symbol,
      close AS latest_close
    FROM RankedWeeks
    WHERE rn = 1
  ),
  VolatilityPeriodBounds AS (
    SELECT
      symbol,
      MIN(CASE WHEN rn = 26 THEN timestamp END) AS ts_end,
      MIN(CASE WHEN rn = 52 THEN timestamp END) AS ts_start
    FROM RankedWeeks
    WHERE rn IN (26, 52)
    GROUP BY symbol
  ),
  FilteredWeeklyReturns AS (
    SELECT
      wr.symbol,
      wr.timestamp,
      (wr.close * 1.0 / LAG(wr.close) OVER (PARTITION BY wr.symbol ORDER BY wr.timestamp) - 1) AS weekly_return
    FROM stock_weeklytwoyear wr
    JOIN VolatilityPeriodBounds b ON wr.symbol = b.symbol
    WHERE wr.timestamp BETWEEN b.ts_start AND b.ts_end
  ),
  Volatility AS (
    SELECT
      symbol,
      AVG(ABS(weekly_return)) AS avg_abs_weekly_return
    FROM FilteredWeeklyReturns
    GROUP BY symbol
  )
  SELECT
    f24.symbol,
    f24.ts_24w_ago AS buy_date,
    f24.close_24w_ago AS buy_price,
    (f25.close_25w_ago * 1.0 / w52.close_52w_ago) - 1 AS yearly_momentum,
    (f24.close_24w_ago * 1.0 / f25.close_25w_ago) - 1 AS pullback_24w_ago,
    v.avg_abs_weekly_return AS avg_weekly_volatility,
    ((f25.close_25w_ago * 1.0 / w52.close_52w_ago) - 1) / v.avg_abs_weekly_return AS momentum_score,
    ROUND(((lw.latest_close - f24.close_24w_ago) * 100.0 / f24.close_24w_ago), 2) AS price_change_since_24w_percent
  FROM TwentyFourWeeksAgo f24
  JOIN TwentyFiveWeeksAgo f25 ON f24.symbol = f25.symbol
  JOIN Week52Ago w52 ON f24.symbol = w52.symbol
  JOIN Volatility v ON f24.symbol = v.symbol
  JOIN LatestWeek lw ON f24.symbol = lw.symbol
  ORDER BY momentum_score DESC;
`).all();


  db.close();
  return summary;
}

async getFilteredMomentumSummary({
  minMomentum = -Infinity,
  maxMomentum = Infinity,
  minPullback = -Infinity,
  maxPullback = Infinity,
  minVolatility = -Infinity,
  maxVolatility = Infinity
} = {}) {
  // Convert all to numbers
  minMomentum = Number(minMomentum);
  maxMomentum = Number(maxMomentum);
  minPullback = Number(minPullback);
  maxPullback = Number(maxPullback);
  minVolatility = Number(minVolatility);
  maxVolatility = Number(maxVolatility);

  // Log what we're actually working with

  console.log({
    minMomentum, maxMomentum, minPullback, maxPullback, minVolatility, maxVolatility
  });

  console.log('Filter parameters:', {
  minMomentum, typeOfMinMomentum: typeof minMomentum,
  maxMomentum, typeOfMaxMomentum: typeof maxMomentum,
  minPullback, typeOfMinPullback: typeof minPullback,
  maxPullback, typeOfMaxPullback: typeof maxPullback,
  minVolatility, typeOfMinVolatility: typeof minVolatility,
  maxVolatility, typeOfMaxVolatility: typeof maxVolatility
});

  const allResults = await this.getMomentumAndPullbackSummaryMV24WeeksAgoNONRESTRICTED();

  // Optional: Show 1st item to confirm structure


  const filtered = allResults.filter(item => {
    const isMatch =
      item.yearly_momentum >= minMomentum &&
      item.yearly_momentum <= maxMomentum &&
      item.pullback_24w_ago >= minPullback &&
      item.pullback_24w_ago <= maxPullback &&
      item.avg_weekly_volatility >= minVolatility &&
      item.avg_weekly_volatility <= maxVolatility;


    return isMatch;
  });


  return {
    average_return_percent: this.average(filtered.map(d => d.price_change_since_24w_percent)),
    results: filtered
  };
}

// Helper to calculate average
average(arr) {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

async getMomentumAndPullbackSummaryByXWeeksAgo(xWeeksAgo) {
  const xWeeks = parseInt(xWeeksAgo, 10);

  if (isNaN(xWeeks) || xWeeks < 4) {
    throw new Error('xWeeksAgo must be a valid number >= 4');
  }

  const xPlus1 = xWeeks + 1;
  const xPlus1Plus52 = xWeeks + 1 + 52;
  const xMinus4 = xWeeks - 4;

  const dbFile = './db/stocks.db';
  const db = new Database(dbFile);

  const stmt = db.prepare(`
    WITH Ordered AS (
      SELECT
        symbol,
        timestamp,
        close,
        ROW_NUMBER() OVER (PARTITION BY symbol ORDER BY timestamp DESC) - 1 AS offset
      FROM stock_weeklytwoyear
    ),
    BuyData AS (
      SELECT symbol, close AS buy_price, timestamp AS buy_date
      FROM Ordered
      WHERE offset = @x
    ),
    WeekBeforeBuy AS (
      SELECT symbol, close AS close_before_buy
      FROM Ordered
      WHERE offset = @xPlus1
    ),
    MomentumBase AS (
      SELECT symbol, close AS close_52w_ago
      FROM Ordered
      WHERE offset = @xPlus1Plus52
    ),
    FuturePrice AS (
      SELECT symbol, close AS sell_price
      FROM Ordered
      WHERE offset = @xMinus4
    ),
    VolatilityWindow AS (
      SELECT
        symbol,
        ((close * 1.0 / LAG(close) OVER (PARTITION BY symbol ORDER BY offset)) - 1) AS weekly_return
      FROM Ordered
      WHERE offset BETWEEN @xPlus1 AND @xPlus1Plus52
    ),
    AvgReturns AS (
      SELECT
        symbol,
        AVG(weekly_return) AS avg_return
      FROM VolatilityWindow
      WHERE weekly_return IS NOT NULL
      GROUP BY symbol
    ),
    VolatilityStats AS (
      SELECT
        vw.symbol,
        ar.avg_return,
        SQRT(AVG(POWER(vw.weekly_return - ar.avg_return, 2))) AS stddev_weekly_return
      FROM VolatilityWindow vw
      JOIN AvgReturns ar ON vw.symbol = ar.symbol
      WHERE vw.weekly_return IS NOT NULL
      GROUP BY vw.symbol
    )
    SELECT
      b.symbol,
      b.buy_date,
      b.buy_price,
      wb.close_before_buy,
      m.close_52w_ago,
      f.sell_price,
      ar.avg_return AS avg_abs_weekly_return,
      vs.stddev_weekly_return AS yearly_volatility,
      (wb.close_before_buy * 1.0 / m.close_52w_ago) - 1 AS yearly_momentum,
      (b.buy_price * 1.0 / wb.close_before_buy) - 1 AS pullback_${xWeeksAgo}w_ago,
      ROUND(((f.sell_price - b.buy_price) * 100.0 / b.buy_price), 2) AS profit_4w_later_percent
    FROM BuyData b
    JOIN WeekBeforeBuy wb ON b.symbol = wb.symbol
    JOIN MomentumBase m ON b.symbol = m.symbol
    JOIN FuturePrice f ON b.symbol = f.symbol
    LEFT JOIN AvgReturns ar ON b.symbol = ar.symbol
    LEFT JOIN VolatilityStats vs ON b.symbol = vs.symbol
    WHERE
      b.buy_price IS NOT NULL AND
      wb.close_before_buy IS NOT NULL AND
      m.close_52w_ago IS NOT NULL AND
      f.sell_price IS NOT NULL;
  `);

  const result = stmt.all({
    x: xWeeks,
    xPlus1,
    xPlus1Plus52,
    xMinus4
  });

  db.close();
  return result;
}

async getMomentumAndPullbackSummaryMV4WeeksAgoNONRESTRCTED() {
  const dbFile = './db/stocks.db';
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
    FourWeeksAgo AS (
      SELECT
        symbol,
        timestamp AS ts_4w_ago,
        close AS close_4w_ago
      FROM RankedWeeks
      WHERE rn = 5  -- 4 weeks ago
    ),
    FiveWeeksAgo AS (
      SELECT
        symbol,
        timestamp AS ts_5w_ago,
        close AS close_5w_ago
      FROM RankedWeeks
      WHERE rn = 6  -- week before 4 weeks ago
    ),
    Week52Ago AS (
      SELECT
        symbol,
        timestamp AS ts_52w_ago,
        close AS close_52w_ago
      FROM RankedWeeks
      WHERE rn = 52  -- 52 weeks ago (1 year ago from latest)
    ),
    LatestWeek AS (
      SELECT
        symbol,
        close AS latest_close
      FROM RankedWeeks
      WHERE rn = 1
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
      f4.symbol,
      f4.ts_4w_ago AS buy_date,
      f4.close_4w_ago AS buy_price,
      (f5.close_5w_ago * 1.0 / w52.close_52w_ago) - 1 AS yearly_momentum,
      (f4.close_4w_ago * 1.0 / f5.close_5w_ago) - 1 AS pullback_4w_ago,
      v.avg_abs_weekly_return AS avg_weekly_volatility,
      ((f5.close_5w_ago * 1.0 / w52.close_52w_ago) - 1) / v.avg_abs_weekly_return AS momentum_score,
      ROUND(((lw.latest_close - f4.close_4w_ago) * 100.0 / f4.close_4w_ago), 2) AS price_change_since_4w_percent
    FROM FourWeeksAgo f4
    JOIN FiveWeeksAgo f5 ON f4.symbol = f5.symbol
    JOIN Week52Ago w52 ON f4.symbol = w52.symbol
    JOIN Volatility v ON f4.symbol = v.symbol
    JOIN LatestWeek lw ON f4.symbol = lw.symbol
    ORDER BY momentum_score DESC;
  `).all();

  db.close();
  return summary;
}



getResistanceBreakoutCandidates() {
    const dbFile = './db/stocks.db';
    const db = new Database(dbFile);

    const summary = db.prepare(`
        WITH RankedWeeks AS (
            SELECT
                symbol,
                timestamp,
                high,
                close,
                ROW_NUMBER() OVER (PARTITION BY symbol ORDER BY timestamp DESC) AS rn
            FROM stock_weekly
        ),
        LookbackWeeks AS (
            SELECT symbol, timestamp, high, close
            FROM RankedWeeks
            WHERE rn <= 52
        ),
        ResistanceLevel AS (
            SELECT
                symbol,
                MAX(high) AS resistance_high
            FROM LookbackWeeks
            GROUP BY symbol
        ),
        WeekNeighbors AS (
            SELECT
                lw.symbol,
                lw.timestamp,
                lw.high,
                lw.close,
                LAG(lw.high) OVER (PARTITION BY lw.symbol ORDER BY lw.timestamp) AS prev_high,
                LEAD(lw.high) OVER (PARTITION BY lw.symbol ORDER BY lw.timestamp) AS next_high
            FROM LookbackWeeks lw
        ),
        LocalPeaks AS (
            SELECT
                wn.symbol,
                wn.high,
                wn.timestamp
            FROM WeekNeighbors wn
            JOIN ResistanceLevel rl ON wn.symbol = rl.symbol
            WHERE
                ABS(wn.high - rl.resistance_high) / rl.resistance_high <= 0.05
                AND (wn.prev_high IS NULL OR wn.high > wn.prev_high)
                AND (wn.next_high IS NULL OR wn.high > wn.next_high)
        ),
        ValidTouchCount AS (
            SELECT symbol, COUNT(*) AS touch_count
            FROM LocalPeaks
            GROUP BY symbol
            HAVING COUNT(*) BETWEEN 2 AND 5
        ),
        LatestWeek AS (
            SELECT symbol, close AS latest_close
            FROM RankedWeeks
            WHERE rn = 1
        )
        SELECT
            lw.symbol,
            lw.latest_close,
            rl.resistance_high,
            ROUND((rl.resistance_high - lw.latest_close) / rl.resistance_high, 4) AS distance_to_resistance,
            vtc.touch_count
        FROM LatestWeek lw
        JOIN ResistanceLevel rl ON lw.symbol = rl.symbol
        JOIN ValidTouchCount vtc ON lw.symbol = vtc.symbol
        WHERE
            lw.latest_close < rl.resistance_high
            AND (rl.resistance_high - lw.latest_close) / rl.resistance_high <= 0.05
        ORDER BY distance_to_resistance ASC;
    `).all();

    db.close();
    return summary;
}


getResistanceBreakoutCandidates4WeeksAgo() {
  const dbFile = './db/stocks.db';
  const db = new Database(dbFile);

  const summary = db.prepare(`
    WITH RankedWeeks AS (
      SELECT
        symbol,
        timestamp,
        high,
        close,
        ROW_NUMBER() OVER (PARTITION BY symbol ORDER BY timestamp DESC) AS rn
      FROM stock_weekly
    ),
    LookbackWeeks AS (
      SELECT symbol, timestamp, high, close
      FROM RankedWeeks
      WHERE rn <= 52
    ),
    ResistanceLevel AS (
      SELECT
        symbol,
        MAX(high) AS resistance_high
      FROM LookbackWeeks
      GROUP BY symbol
    ),
    WeekNeighbors AS (
      SELECT
        lw.symbol,
        lw.timestamp,
        lw.high,
        lw.close,
        LAG(lw.high) OVER (PARTITION BY lw.symbol ORDER BY lw.timestamp) AS prev_high,
        LEAD(lw.high) OVER (PARTITION BY lw.symbol ORDER BY lw.timestamp) AS next_high
      FROM LookbackWeeks lw
    ),
    LocalPeaks AS (
      SELECT
        wn.symbol,
        wn.high,
        wn.timestamp
      FROM WeekNeighbors wn
      JOIN ResistanceLevel rl ON wn.symbol = rl.symbol
      WHERE
        ABS(wn.high - rl.resistance_high) / rl.resistance_high <= 0.05
        AND (wn.prev_high IS NULL OR wn.high > wn.prev_high)
        AND (wn.next_high IS NULL OR wn.high > wn.next_high)
    ),
    ValidTouchCount AS (
      SELECT symbol, COUNT(*) AS touch_count
      FROM LocalPeaks
      GROUP BY symbol
      HAVING COUNT(*) BETWEEN 2 AND 5
    ),
    FourWeeksAgo AS (
      SELECT
        symbol,
        timestamp AS ts_4w_ago,
        close AS close_4w_ago
      FROM RankedWeeks
      WHERE rn = 5
    ),
    LatestWeek AS (
      SELECT
        symbol,
        close AS latest_close
      FROM RankedWeeks
      WHERE rn = 1
    )
    SELECT
      f4.symbol,
      datetime(f4.ts_4w_ago, 'unixepoch') AS buy_date,
      f4.close_4w_ago AS price_4w_ago,
      lw.latest_close,
      ROUND((lw.latest_close - f4.close_4w_ago) / f4.close_4w_ago, 4) AS price_change_since_4w,
      rl.resistance_high,
      ROUND((rl.resistance_high - f4.close_4w_ago) / rl.resistance_high, 4) AS distance_to_resistance_4w_ago,
      vtc.touch_count
    FROM FourWeeksAgo f4
    JOIN ResistanceLevel rl ON f4.symbol = rl.symbol
    JOIN ValidTouchCount vtc ON f4.symbol = vtc.symbol
    JOIN LatestWeek lw ON f4.symbol = lw.symbol
    WHERE
      f4.close_4w_ago < rl.resistance_high
      AND (rl.resistance_high - f4.close_4w_ago) / rl.resistance_high <= 0.05
    ORDER BY distance_to_resistance_4w_ago ASC;
  `).all();

  db.close();
  return summary;
}
}

module.exports = StockFilterService;
