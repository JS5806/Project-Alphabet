const Cosmetic = require('../models/Cosmetic');
const { Op } = require('sequelize');
const dayjs = require('dayjs');

exports.getAllCosmetics = async (req, res) => {
  try {
    const items = await Cosmetic.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUrgentItems = async (req, res) => {
  try {
    const oneYearFromNow = dayjs().add(1, 'year').format('YYYY-MM-DD');
    const today = dayjs().format('YYYY-MM-DD');
    
    // Business Logic: Expiry date < 1 year from today
    const items = await Cosmetic.findAll({
      where: {
        expiry_date: {
          [Op.between]: [today, oneYearFromNow]
        }
      }
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getNeedsReplacement = async (req, res) => {
  try {
    const oneYearAgo = dayjs().subtract(1, 'year').format('YYYY-MM-DD');
    
    // Business Logic: Opened > 1 year ago
    const items = await Cosmetic.findAll({
      where: {
        opened_at: {
          [Op.lte]: oneYearAgo
        }
      }
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createCosmetic = async (req, res) => {
  try {
    const newItem = await Cosmetic.create(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateCosmetic = async (req, res) => {
  try {
    const { id } = req.params;
    await Cosmetic.update(req.body, { where: { id } });
    res.json({ message: 'Updated successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteCosmetic = async (req, res) => {
  try {
    const { id } = req.params;
    await Cosmetic.destroy({ where: { id } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};