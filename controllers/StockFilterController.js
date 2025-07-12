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

exports.getSymbolData = async (req, res) => {
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

exports.saveDataToDb = async (req, res) => {
  try {
    const dbFile = req.query.dbFile || '';
    const symbol = req.query.symbol || '';
    const data = req.query.data || '';

    const result = await stockFilterService.saveDataToDb(dbFile, symbol, data);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.fetchAndStore = async (req, res) => {
  try {
    const symbol = req.query.symbol || '';

    const result = await stockFilterService.fetchAndStore(symbol);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.fetchAndStoreAllSymbols = async (req, res) => {
  try {
    const dbFile = req.query.dbFile || '';

    const result = await stockFilterService.fetchAndStoreAllSymbols(dbFile);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMomentumAndPullbackSummary = async (req, res) => {
  try {
    // no params

    const result = await stockFilterService.getMomentumAndPullbackSummary();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMomentumAndPullbackSummaryMV = async (req, res) => {
  try {
    // no params

    const result = await stockFilterService.getMomentumAndPullbackSummaryMV();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMomentumAndPullbackSummaryMV4WeeksAgo = async (req, res) => {
  try {
    // no params

    const result = await stockFilterService.getMomentumAndPullbackSummaryMV4WeeksAgo();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getResistanceBreakoutCandidates = async (req, res) => {
  try {
    // no params

    const result = await stockFilterService.getResistanceBreakoutCandidates();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getResistanceBreakoutCandidates4WeeksAgo = async (req, res) => {
  try {
    // no params

    const result = await stockFilterService.getResistanceBreakoutCandidates4WeeksAgo();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};