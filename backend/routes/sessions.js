const express = require('express');
const router = express.Router();
const AutomationSession = require('../models/AutomationSession');

// Get all sessions
router.get('/', async (req, res) => {
  try {
    const { status, limit = 20, offset = 0 } = req.query;
    
    const filter = {};
    if (status) {
      filter.status = status;
    }
    
    const sessions = await AutomationSession
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .select('sessionId businessIdea status currentStep progress metadata.startTime metadata.endTime createdAt');
    
    const total = await AutomationSession.countDocuments(filter);
    
    res.json({
      sessions,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: total > (parseInt(offset) + parseInt(limit))
      }
    });
    
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: 'Failed to get sessions' });
  }
});

// Get session by ID
router.get('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await AutomationSession.findOne({ sessionId });
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json(session);
    
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({ error: 'Failed to get session' });
  }
});

// Delete session
router.delete('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await AutomationSession.findOneAndDelete({ sessionId });
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json({ message: 'Session deleted successfully' });
    
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

// Get session statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await AutomationSession.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgDuration: { $avg: '$metadata.duration' }
        }
      }
    ]);
    
    const totalSessions = await AutomationSession.countDocuments();
    const recentSessions = await AutomationSession.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });
    
    res.json({
      totalSessions,
      recentSessions,
      statusBreakdown: stats,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

module.exports = router;
