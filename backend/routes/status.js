const express = require('express');
const router = express.Router();
const AutomationSession = require('../models/AutomationSession');

// Quick mock to check if everything works
router.get('/status', async (req, res) => {
  try {
    const sessions = await AutomationSession.find();
    res.json({
      status: 'ok',
      totalSessions: sessions.length
    });
  } catch (error) {
    console.error('Status check failed:', error);
    res.status(500).json({ error: 'Status check error' });
  }
});

module.exports = router;

