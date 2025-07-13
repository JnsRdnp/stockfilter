// AUTO-GENERATED CONTROLLER for BacktestService from BacktestService.js

const BacktestService = require('../services/BacktestService.js');
const backtestService = new BacktestService();

exports.getBacktestRestricted = async (req, res) => {
  try {
    const maxNegRatio = req.query.maxNegRatio || '';
    const minStockCount = parseInt(req.query.minStockCount) || 0;
    const binsize = req.query.binsize || '';

    const result = await backtestService.getBacktestRestricted(maxNegRatio, minStockCount, binsize);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBacktest = async (req, res) => {
  try {
    const maxNegRatio = req.query.maxNegRatio || '';
    const minStockCount = parseInt(req.query.minStockCount) || 0;
    const binsize = req.query.binsize || '';

    const result = await backtestService.getBacktest(maxNegRatio, minStockCount, binsize);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBacktest6mRestricted = async (req, res) => {
  try {
    const maxNegRatio = req.query.maxNegRatio || '';
    const minStockCount = parseInt(req.query.minStockCount) || 0;
    const binsize = req.query.binsize || '';

    const result = await backtestService.getBacktest6mRestricted(maxNegRatio, minStockCount, binsize);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBacktest6m = async (req, res) => {
  try {
    const maxNegRatio = req.query.maxNegRatio || '';
    const minStockCount = parseInt(req.query.minStockCount) || 0;
    const binsize = req.query.binsize || '';

    const result = await backtestService.getBacktest6m(maxNegRatio, minStockCount, binsize);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getQuartileBins = async (req, res) => {
  try {
    const values = req.query.values || '';
    const numBins = req.query.numBins || '';

    const result = await backtestService.getQuartileBins(values, numBins);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMinMax = async (req, res) => {
  try {
    const values = req.query.values || '';

    const result = await backtestService.getMinMax(values);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRange = async (req, res) => {
  try {
    const thresholds = req.query.thresholds || '';
    const binIndex = req.query.binIndex || '';
    const minValue = req.query.minValue || '';
    const maxValue = req.query.maxValue || '';

    const result = await backtestService.getRange(thresholds, binIndex, minValue, maxValue);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.analyzeStocks = async (req, res) => {
  try {
    const stocks = req.query.stocks || '';
    const maxNegRatio = req.query.maxNegRatio || '';
    const weeksAgo = req.query.weeksAgo || '';
    const minStockCount = parseInt(req.query.minStockCount) || 0;
    const binsize = req.query.binsize || '';

    const result = await backtestService.analyzeStocks(stocks, maxNegRatio, weeksAgo, minStockCount, binsize);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};