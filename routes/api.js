const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');

/**
 * @swagger
 * /api/recommend:
 *   get:
 *     summary: 랜덤 메뉴 추천
 *     description: 위치 및 카테고리 기반 메뉴 추천 (최근 섭취 메뉴 제외)
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: maxDistance
 *         schema:
 *           type: number
 *           default: 2
 *     responses:
 *       200:
 *         description: 추천 성공
 */
router.get('/recommend', recommendationController.recommendMenu);

module.exports = router;