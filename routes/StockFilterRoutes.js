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
 * /api/stockfilter/get12month-return:
 *   get:
 *     summary: get12MonthReturn (auto-generated route)
 *     tags:
 *       - Generated
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
router.get('/get12month-return', controller.get12MonthReturn);

/**
 * @swagger
 * /api/stockfilter/main:
 *   get:
 *     summary: main (auto-generated route)
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
router.get('/main', controller.main);


module.exports = router;
