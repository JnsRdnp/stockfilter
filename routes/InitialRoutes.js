const express = require('express');
const router = express.Router();
const controller = require('../controllers/InitialController.js');

/**
 * @swagger
 * /api/initialservice/initial-function:
 *   get:
 *     summary: InitialFunction (auto-generated route)
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
router.get('/initial-function', controller.InitialFunction);


module.exports = router;
