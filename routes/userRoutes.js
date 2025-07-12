import express from 'express';
const router = express.Router();

import userController from '../controllers/userController.js';




/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);

export default router;