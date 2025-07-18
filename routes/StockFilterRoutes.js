const express = require('express');
const router = express.Router();
const controller = require('../controllers/StockFilterController.js');

/**
 * @swagger
 * /api/stockfilter/get-nasdaq-symbols:
 *   get:
 *     summary: getNasdaqSymbols (auto-generated route)
 *     tags:
 *       - stockfilter

 *     responses:
 *       200:
 *         description: JSON data returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/get-nasdaq-symbols', controller.getNasdaqSymbols);

/**
 * @swagger
 * /api/stockfilter/get-symbol-data:
 *   get:
 *     summary: getSymbolData (auto-generated route)
 *     tags:
 *       - stockfilter
 *     parameters:
 *       - in: query
 *         name: symbol
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: interval
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: range
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
router.get('/get-symbol-data', controller.getSymbolData);

/**
 * @swagger
 * /api/stockfilter/get-symbol-data2y:
 *   get:
 *     summary: getSymbolData2y (auto-generated route)
 *     tags:
 *       - stockfilter
 *     parameters:
 *       - in: query
 *         name: symbol
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: interval
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: range
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
router.get('/get-symbol-data2y', controller.getSymbolData2y);

/**
 * @swagger
 * /api/stockfilter/save-data-to-db:
 *   get:
 *     summary: saveDataToDb (auto-generated route)
 *     tags:
 *       - stockfilter
 *     parameters:
 *       - in: query
 *         name: dbFile
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: symbol
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: data
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
router.get('/save-data-to-db', controller.saveDataToDb);

/**
 * @swagger
 * /api/stockfilter/save-data-to-db2y:
 *   get:
 *     summary: saveDataToDb2y (auto-generated route)
 *     tags:
 *       - stockfilter
 *     parameters:
 *       - in: query
 *         name: dbFile
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: symbol
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: data
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
router.get('/save-data-to-db2y', controller.saveDataToDb2y);

/**
 * @swagger
 * /api/stockfilter/fetch-and-store:
 *   get:
 *     summary: fetchAndStore (auto-generated route)
 *     tags:
 *       - stockfilter
 *     parameters:
 *       - in: query
 *         name: symbol
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
router.get('/fetch-and-store', controller.fetchAndStore);

/**
 * @swagger
 * /api/stockfilter/fetch-and-store-all-symbols:
 *   get:
 *     summary: fetchAndStoreAllSymbols (auto-generated route)
 *     tags:
 *       - stockfilter
 *     parameters:
 *       - in: query
 *         name: dbFile
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
router.get('/fetch-and-store-all-symbols', controller.fetchAndStoreAllSymbols);

/**
 * @swagger
 * /api/stockfilter/fetch-and-store-all-symbols2year:
 *   get:
 *     summary: fetchAndStoreAllSymbols2year (auto-generated route)
 *     tags:
 *       - stockfilter
 *     parameters:
 *       - in: query
 *         name: dbFile
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
router.get('/fetch-and-store-all-symbols2year', controller.fetchAndStoreAllSymbols2year);

/**
 * @swagger
 * /api/stockfilter/get-momentum-and-pullback-summary:
 *   get:
 *     summary: getMomentumAndPullbackSummary (auto-generated route)
 *     tags:
 *       - stockfilter

 *     responses:
 *       200:
 *         description: JSON data returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/get-momentum-and-pullback-summary', controller.getMomentumAndPullbackSummary);

/**
 * @swagger
 * /api/stockfilter/get-momentum-and-pullback-summary-mv:
 *   get:
 *     summary: getMomentumAndPullbackSummaryMV (auto-generated route)
 *     tags:
 *       - stockfilter

 *     responses:
 *       200:
 *         description: JSON data returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/get-momentum-and-pullback-summary-mv', controller.getMomentumAndPullbackSummaryMV);

/**
 * @swagger
 * /api/stockfilter/get-momentum-and-pullback-summary-mvoptimized:
 *   get:
 *     summary: Get stocks with strong momentum and acceptable volatility and pullback
 *     tags:
 *       - stockfilter
 *     parameters:
 *       - in: query
 *         name: momentumMin
 *         schema:
 *           type: number
 *         required: false
 *         description: Minimum yearly momentum (default 0.00152)
 *       - in: query
 *         name: momentumMax
 *         schema:
 *           type: number
 *         required: false
 *         description: Maximum yearly momentum (default 999)
 *       - in: query
 *         name: pullbackMin
 *         schema:
 *           type: number
 *         required: false
 *         description: Minimum pullback value (default -0.0509)
 *       - in: query
 *         name: pullbackMax
 *         schema:
 *           type: number
 *         required: false
 *         description: Maximum pullback value (default -0.0336)
 *       - in: query
 *         name: volatilityMin
 *         schema:
 *           type: number
 *         required: false
 *         description: Minimum average weekly volatility (default 0.0228)
 *       - in: query
 *         name: volatilityMax
 *         schema:
 *           type: number
 *         required: false
 *         description: Maximum average weekly volatility (default 0.0327)
 *     responses:
 *       200:
 *         description: JSON array of filtered stock data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   symbol:
 *                     type: string
 *                   yearly_momentum:
 *                     type: number
 *                   latest_week_pullback:
 *                     type: number
 *                   avg_weekly_volatility:
 *                     type: number
 *                   momentum_score:
 *                     type: number
 */
router.get('/get-momentum-and-pullback-summary-mvoptimized', controller.getMomentumAndPullbackSummaryMVOPTIMIZED);

/**
 * @swagger
 * /api/stockfilter/get-momentum-and-pullback-summary-mv4weeks-ago:
 *   get:
 *     summary: getMomentumAndPullbackSummaryMV4WeeksAgo (auto-generated route)
 *     tags:
 *       - stockfilter

 *     responses:
 *       200:
 *         description: JSON data returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/get-momentum-and-pullback-summary-mv4weeks-ago', controller.getMomentumAndPullbackSummaryMV4WeeksAgo);

/**
 * @swagger
 * /api/stockfilter/get-momentum-and-pullback-summary-mv24weeks-ago:
 *   get:
 *     summary: getMomentumAndPullbackSummaryMV24WeeksAgo (auto-generated route)
 *     tags:
 *       - stockfilter

 *     responses:
 *       200:
 *         description: JSON data returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/get-momentum-and-pullback-summary-mv24weeks-ago', controller.getMomentumAndPullbackSummaryMV24WeeksAgo);

/**
 * @swagger
 * /api/stockfilter/get-momentum-and-pullback-summary-mv24weeks-ago-nonrestricted:
 *   get:
 *     summary: getMomentumAndPullbackSummaryMV24WeeksAgoNONRESTRICTED (auto-generated route)
 *     tags:
 *       - stockfilter

 *     responses:
 *       200:
 *         description: JSON data returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/get-momentum-and-pullback-summary-mv24weeks-ago-nonrestricted', controller.getMomentumAndPullbackSummaryMV24WeeksAgoNONRESTRICTED);

/**
 * @swagger
 * /api/stockfilter/get-filtered-momentum-summary:
 *   get:
 *     summary: getFilteredMomentumSummary (auto-generated route)
 *     tags:
 *       - stockfilter
 *     parameters:
 *       - in: query
 *         name: minMomentum
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: maxMomentum
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPullback
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: maxPullback
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: minVolatility
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: maxVolatility
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
router.get('/get-filtered-momentum-summary', controller.getFilteredMomentumSummary);

/**
 * @swagger
 * /api/stockfilter/average:
 *   get:
 *     summary: average (auto-generated route)
 *     tags:
 *       - stockfilter
 *     parameters:
 *       - in: query
 *         name: arr
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
router.get('/average', controller.average);

/**
 * @swagger
 * /api/stockfilter/get-momentum-and-pullback-summary-by-xweeks-ago:
 *   get:
 *     summary: getMomentumAndPullbackSummaryByXWeeksAgo (auto-generated route)
 *     tags:
 *       - stockfilter
 *     parameters:
 *       - in: query
 *         name: xWeeksAgo
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: preview
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
router.get('/get-momentum-and-pullback-summary-by-xweeks-ago', controller.getMomentumAndPullbackSummaryByXWeeksAgo);

/**
 * @swagger
 * /api/stockfilter/get-momentum-and-pullback-summary-mv4weeks-ago-nonrestrcted:
 *   get:
 *     summary: getMomentumAndPullbackSummaryMV4WeeksAgoNONRESTRCTED (auto-generated route)
 *     tags:
 *       - stockfilter

 *     responses:
 *       200:
 *         description: JSON data returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/get-momentum-and-pullback-summary-mv4weeks-ago-nonrestrcted', controller.getMomentumAndPullbackSummaryMV4WeeksAgoNONRESTRCTED);

/**
 * @swagger
 * /api/stockfilter/get-resistance-breakout-candidates:
 *   get:
 *     summary: getResistanceBreakoutCandidates (auto-generated route)
 *     tags:
 *       - stockfilter

 *     responses:
 *       200:
 *         description: JSON data returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/get-resistance-breakout-candidates', controller.getResistanceBreakoutCandidates);

/**
 * @swagger
 * /api/stockfilter/get-resistance-breakout-candidates4weeks-ago:
 *   get:
 *     summary: getResistanceBreakoutCandidates4WeeksAgo (auto-generated route)
 *     tags:
 *       - stockfilter

 *     responses:
 *       200:
 *         description: JSON data returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/get-resistance-breakout-candidates4weeks-ago', controller.getResistanceBreakoutCandidates4WeeksAgo);


module.exports = router;
