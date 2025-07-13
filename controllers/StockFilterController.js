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

exports.getSymbolData2y = async (req, res) => {
  try {
    const symbol = req.query.symbol || '';
    const interval = req.query.interval || '';
    const range = req.query.range || '';

    const result = await stockFilterService.getSymbolData2y(symbol, interval, range);
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

exports.saveDataToDb2y = async (req, res) => {
  try {
    const dbFile = req.query.dbFile || '';
    const symbol = req.query.symbol || '';
    const data = req.query.data || '';

    const result = await stockFilterService.saveDataToDb2y(dbFile, symbol, data);
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

exports.fetchAndStoreAllSymbols2year = async (req, res) => {
  try {
    const dbFile = req.query.dbFile || '';

    const result = await stockFilterService.fetchAndStoreAllSymbols2year(dbFile);
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

exports.getMomentumAndPullbackSummaryMVOPTIMIZED = async (req, res) => {
  try {
    // no params

    const result = await stockFilterService.getMomentumAndPullbackSummaryMVOPTIMIZED();
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

exports.getMomentumAndPullbackSummaryMV24WeeksAgo = async (req, res) => {
  try {
    // no params

    const result = await stockFilterService.getMomentumAndPullbackSummaryMV24WeeksAgo();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMomentumAndPullbackSummaryMV24WeeksAgoNONRESTRICTED = async (req, res) => {
  try {
    // no params

    const result = await stockFilterService.getMomentumAndPullbackSummaryMV24WeeksAgoNONRESTRICTED();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFilteredMomentumSummary = async (req, res) => {
  try {
    const {
      minMomentum = '',
      maxMomentum = '',
      minPullback = '',
      maxPullback = '',
      minVolatility = '',
      maxVolatility = ''
    } = req.query;

    const result = await stockFilterService.getFilteredMomentumSummary({
      minMomentum,
      maxMomentum,
      minPullback,
      maxPullback,
      minVolatility,
      maxVolatility
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.average = async (req, res) => {
  try {
    const arr = req.query.arr || '';

    const result = await stockFilterService.average(arr);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMomentumAndPullbackSummaryMV4WeeksAgoNONRESTRCTED = async (req, res) => {
  try {
    // no params

    const result = await stockFilterService.getMomentumAndPullbackSummaryMV4WeeksAgoNONRESTRCTED();
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