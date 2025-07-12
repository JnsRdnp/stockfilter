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

exports.get12MonthReturn = async (req, res) => {
  try {
    const symbol = req.query.symbol || '';

    const result = await stockFilterService.get12MonthReturn(symbol);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.main = async (req, res) => {
  try {
    // no params

    const result = await stockFilterService.main();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};