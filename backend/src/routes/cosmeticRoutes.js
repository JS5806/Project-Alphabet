const express = require('express');
const router = express.Router();
const controller = require('../controllers/cosmeticController');

// Standard CRUD
router.get('/', controller.getAllCosmetics);
router.post('/', controller.createCosmetic);
router.put('/:id', controller.updateCosmetic);
router.delete('/:id', controller.deleteCosmetic);

// Business Specific Filtering
router.get('/urgent', controller.getUrgentItems); // Expiry < 1 year
router.get('/replace', controller.getNeedsReplacement); // Opened > 1 year

module.exports = router;