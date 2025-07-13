const express = require('express');
const router = express.Router();
const controller = require('../controllers/BacktestController.js');

/**
 * @swagger
 * /api/backtest/get-backtest-restricted:
 *   get:
 *     summary: getBacktestRestricted (auto-generated route)
 *     tags:
 *       - backtest
 *     parameters:
 *       - in: query
 *         name: maxNegRatio
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: minStockCount
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: binsize
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: JSON data returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/get-backtest-restricted', controller.getBacktestRestricted);

/**
 * @swagger
 * /api/backtest/get-backtest:
 *   get:
 *     summary: getBacktest (auto-generated route)
 *     tags:
 *       - backtest
 *     parameters:
 *       - in: query
 *         name: maxNegRatio
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: minStockCount
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: binsize
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: JSON data returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/get-backtest', controller.getBacktest);

/**
 * @swagger
 * /api/backtest/get-backtest6m-restricted:
 *   get:
 *     summary: getBacktest6mRestricted (auto-generated route)
 *     tags:
 *       - backtest
 *     parameters:
 *       - in: query
 *         name: maxNegRatio
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: minStockCount
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: binsize
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: JSON data returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/get-backtest6m-restricted', controller.getBacktest6mRestricted);

/**
 * @swagger
 * /api/backtest/get-backtest6m:
 *   get:
 *     summary: getBacktest6m (auto-generated route)
 *     tags:
 *       - backtest
 *     parameters:
 *       - in: query
 *         name: maxNegRatio
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: minStockCount
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: binsize
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: JSON data returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/get-backtest6m', controller.getBacktest6m);

/**
 * @swagger
 * /api/backtest/get-momentum-and-pullback-summary-mvxweeks-ago:
 *   get:
 *     summary: getMomentumAndPullbackSummaryMVXWeeksAgo (auto-generated route)
 *     tags:
 *       - backtest
 *     parameters:
 *       - in: query
 *         name: xWeeksAgo
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: JSON data returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/get-momentum-and-pullback-summary-mvxweeks-ago', controller.getMomentumAndPullbackSummaryMVXWeeksAgo);

/**
 * @swagger
 * /api/backtest/get-yearly-backtest:
 *   get:
 *     summary: getYearlyBacktest (auto-generated route)
 *     tags:
 *       - backtest
 *     parameters:
 *       - in: query
 *         name: maxNegRatio
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: minStockCount
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: binsize
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: useVolatility
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: JSON data returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/get-yearly-backtest', controller.getYearlyBacktest);

/**
 * @swagger
 * /api/backtest/analyze-stocks-for-single-month:
 *   get:
 *     summary: analyzeStocksForSingleMonth (auto-generated route)
 *     tags:
 *       - backtest
 *     parameters:
 *       - in: query
 *         name: stocks
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: weeksAgo
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: binsize
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: useVolatility
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBySharpe
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: minStockCount
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: maxNegRatio
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: JSON data returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/analyze-stocks-for-single-month', controller.analyzeStocksForSingleMonth);

/**
 * @swagger
 * /api/backtest/analyze-stocks-across-year:
 *   get:
 *     summary: analyzeStocksAcrossYear (auto-generated route)
 *     tags:
 *       - backtest
 *     parameters:
 *       - in: query
 *         name: allGroups
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: useVolatility
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: JSON data returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/analyze-stocks-across-year', controller.analyzeStocksAcrossYear);

/**
 * @swagger
 * /api/backtest/get-quartile-bins:
 *   get:
 *     summary: getQuartileBins (auto-generated route)
 *     tags:
 *       - backtest
 *     parameters:
 *       - in: query
 *         name: values
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: numBins
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: JSON data returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/get-quartile-bins', controller.getQuartileBins);

/**
 * @swagger
 * /api/backtest/map:
 *   get:
 *     summary: map (auto-generated route)
 *     tags:
 *       - backtest
 *     parameters:
 *       - in: query
 *         name: val
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: JSON data returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/map', controller.map);

/**
 * @swagger
 * /api/backtest/get-range:
 *   get:
 *     summary: getRange (auto-generated route)
 *     tags:
 *       - backtest
 *     parameters:
 *       - in: query
 *         name: thresholds
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: binIndex
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: minValue
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: maxValue
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: JSON data returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/get-range', controller.getRange);

/**
 * @swagger
 * /api/backtest/get-min-max:
 *   get:
 *     summary: getMinMax (auto-generated route)
 *     tags:
 *       - backtest
 *     parameters:
 *       - in: query
 *         name: values
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: JSON data returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/get-min-max', controller.getMinMax);


module.exports = router;
