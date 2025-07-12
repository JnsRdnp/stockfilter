const axios = require('axios');
const { parse } = require('csv-parse/sync');
const yahooFinance = require('yahoo-finance2').default;
const fs = require('fs').promises;

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
            params: {
                interval,
                range,
            },
            });
            return response.data.chart.result[0];  // raw JSON from Yahoo
        } catch (error) {
            console.error(`Error fetching data for ${symbol}:`, error.message);
            return null;
        }
    }


}

module.exports = StockFilterService;
