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
 * /api/stockfilter/get-symboldata:
 *   get:
 *     summary: getSymboldata (auto-generated route)
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
router.get('/get-symboldata', controller.getSymboldata);


module.exports = router;
