const express = require('express');
const router = express.Router();
const controller = require('../controllers/StockFilterController.js');

/**
 * @swagger
 * /api/stockfilter/get-nasdaq-symbols:
 *   get:
 *     summary: getNasdaqSymbols (auto-generated route)
 *     tags:
 *       - Generated

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
 *       - Generated
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
 * /api/stockfilter/save-data-to-db:
 *   get:
 *     summary: saveDataToDb (auto-generated route)
 *     tags:
 *       - Generated
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
 * /api/stockfilter/fetch-and-store:
 *   get:
 *     summary: fetchAndStore (auto-generated route)
 *     tags:
 *       - Generated
 *     parameters:
 *       - in: query
 *         name: symbol
 *         required: false
 *         schema:
 *           type: string
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
router.get('/fetch-and-store', controller.fetchAndStore);

/**
 * @swagger
 * /api/stockfilter/fetch-and-store-all-symbols:
 *   get:
 *     summary: fetchAndStoreAllSymbols (auto-generated route)
 *     tags:
 *       - Generated
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
 * /api/stockfilter/get-momentum-and-pullback-summary:
 *   get:
 *     summary: getMomentumAndPullbackSummary (auto-generated route)
 *     tags:
 *       - Generated
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
router.get('/get-momentum-and-pullback-summary', controller.getMomentumAndPullbackSummary);

/**
 * @swagger
 * /api/stockfilter/get-momentum-and-pullback-summary-mv:
 *   get:
 *     summary: getMomentumAndPullbackSummaryMV (auto-generated route)
 *     tags:
 *       - Generated
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
router.get('/get-momentum-and-pullback-summary-mv', controller.getMomentumAndPullbackSummaryMV);


module.exports = router;
