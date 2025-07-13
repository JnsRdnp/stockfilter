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

exports.getMomentumAndPullbackSummaryMVXWeeksAgo = async (req, res) => {
  try {
    const xWeeksAgo = req.query.xWeeksAgo || '';

    const result = await backtestService.getMomentumAndPullbackSummaryMVXWeeksAgo(xWeeksAgo);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getYearlyBacktest = async (req, res) => {
  try {
    const maxNegRatio = req.query.maxNegRatio || '';
    const minStockCount = parseInt(req.query.minStockCount) || 0;
    const binsize = req.query.binsize || '';
    const useVolatility = req.query.useVolatility || '';

    const result = await backtestService.getYearlyBacktest(maxNegRatio, minStockCount, binsize, useVolatility);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.analyzeStocksForSingleMonth = async (req, res) => {
  try {
    const stocks = req.query.stocks || '';
    const weeksAgo = req.query.weeksAgo || '';
    const binsize = req.query.binsize || '';
    const useVolatility = req.query.useVolatility || '';
    const sortBySharpe = req.query.sortBySharpe || '';
    const minStockCount = parseInt(req.query.minStockCount) || 0;
    const maxNegRatio = req.query.maxNegRatio || '';

    const result = await backtestService.analyzeStocksForSingleMonth(stocks, weeksAgo, binsize, useVolatility, sortBySharpe, minStockCount, maxNegRatio);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.analyzeStocksAcrossYear = async (req, res) => {
  try {
    const allGroups = req.query.allGroups || '';
    const useVolatility = req.query.useVolatility || '';

    const result = await backtestService.analyzeStocksAcrossYear(allGroups, useVolatility);
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

exports.map = async (req, res) => {
  try {
    const val = req.query.val || '';

    const result = await backtestService.map(val);
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

exports.getMinMax = async (req, res) => {
  try {
    const values = req.query.values || '';

    const result = await backtestService.getMinMax(values);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};