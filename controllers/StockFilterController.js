// AUTO-GENERATED CONTROLLER for StockFilterService from StockFilterService.js

const StockFilterService = require('../services/StockFilterService.js');
const stockFilterService = new StockFilterService();

exports.getNasdaqSymbols = async (req, res) => {
  try {
    // no params

    const result = await stockFilterService.getNasdaqSymbols();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSymboldata = async (req, res) => {
  try {
    const symbol = req.query.symbol || '';
    const interval = req.query.interval || '';
    const range = req.query.range || '';

    const result = await stockFilterService.getSymbolData(symbol, interval, range);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};