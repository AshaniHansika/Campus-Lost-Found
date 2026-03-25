const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Report = require('../models/Report');
const Item = require('../models/Item');

// @route   POST /api/reports
// @desc    Report an item
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { itemId, reason, description } = req.body;

    // Check if item exists
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }

    // Check if already reported by this user
    const existingReport = await Report.findOne({
      itemId,
      reporterId: req.user.id,
      status: 'pending'
    });

    if (existingReport) {
      return res.status(400).json({ msg: 'You have already reported this item' });
    }

    const report = new Report({
      itemId,
      reporterId: req.user.id,
      reason,
      description
    });

    await report.save();
    res.json(report);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/reports
// @desc    Get all reports (admin only)
// @access  Private/Admin
router.get('/', [auth, admin], async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('itemId')
      .populate('reporterId', 'name email')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/reports/:id/resolve
// @desc    Resolve a report
// @access  Private/Admin
router.put('/:id/resolve', [auth, admin], async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ msg: 'Report not found' });
    }

    report.status = 'resolved';
    await report.save();

    res.json(report);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;