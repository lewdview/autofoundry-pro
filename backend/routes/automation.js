const express = require('express');
const router = express.Router();
const AutomationSession = require('../models/AutomationSession');
const automationService = require('../services/automationService');

// Promise queue for serialized session saves
const sessionSaveQueue = [];
let processingQueue = false;

const processQueue = async () => {
  if (processingQueue) return;
  processingQueue = true;
  
  while (sessionSaveQueue.length > 0) {
    const saveOperation = sessionSaveQueue.shift();
    try {
      await saveOperation();
    } catch (error) {
      console.error('Queue save error:', error);
    }
  }
  
  processingQueue = false;
};

const safeSave = (session) => {
  return new Promise((resolve, reject) => {
    sessionSaveQueue.push(async () => {
      try {
        const result = await session.save();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
    processQueue();
  });
};

// Start automation
router.post('/start', async (req, res) => {
  try {
    const { businessIdea, isLucky = false } = req.body;
    
    if (!businessIdea) {
      return res.status(400).json({ error: 'Business idea is required' });
    }
    
    // Generate session ID
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create new automation session
    const session = new AutomationSession({
      sessionId,
      businessIdea,
      steps: [
        { name: 'initialization', status: 'pending' },
        { name: 'market_research', status: 'pending' },
        { name: 'competitive_analysis', status: 'pending' },
        { name: 'trending_analysis', status: 'pending' },
        { name: 'business_plan', status: 'pending' }
      ],
      metadata: {
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip
      }
    });
    
    await safeSave(session);
    
    // Start automation process asynchronously
    automationService.runAutomation(sessionId, businessIdea, isLucky)
      .catch(error => {
        console.error('Automation error:', error);
      });
    
    res.json({ 
      sessionId, 
      message: 'Automation started successfully',
      businessIdea
    });
    
  } catch (error) {
    console.error('Start automation error:', error);
    res.status(500).json({ error: 'Failed to start automation' });
  }
});

// Get automation status
router.get('/status/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await AutomationSession.findOne({ sessionId });
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json({
      sessionId,
      status: session.status,
      currentStep: session.currentStep,
      progress: session.progress,
      steps: session.steps,
      results: session.results,
      metadata: session.metadata
    });
    
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({ error: 'Failed to get automation status' });
  }
});

// Get automation results
router.get('/results/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await AutomationSession.findOne({ sessionId });
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    if (session.status !== 'completed') {
      return res.status(400).json({ error: 'Automation not completed yet' });
    }
    
    res.json({
      sessionId,
      businessIdea: session.businessIdea,
      results: session.results,
      metadata: session.metadata
    });
    
  } catch (error) {
    console.error('Results fetch error:', error);
    res.status(500).json({ error: 'Failed to get automation results' });
  }
});

// Export results
router.get('/export/:sessionId/:format', async (req, res) => {
  try {
    const { sessionId, format } = req.params;
    const session = await AutomationSession.findOne({ sessionId });
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    if (session.status !== 'completed') {
      return res.status(400).json({ error: 'Automation not completed yet' });
    }
    
    const exportData = automationService.exportResults(session, format);
    
    res.setHeader('Content-Type', exportData.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${sessionId}.${format}"`);
    res.send(exportData.data);
    
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export results' });
  }
});

// Cancel automation
router.post('/cancel/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await AutomationSession.findOne({ sessionId });
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    if (session.status === 'completed') {
      return res.status(400).json({ error: 'Cannot cancel completed automation' });
    }
    
    session.status = 'cancelled';
    session.metadata.endTime = new Date();
    await safeSave(session);
    
    res.json({ message: 'Automation cancelled successfully' });
    
  } catch (error) {
    console.error('Cancel error:', error);
    res.status(500).json({ error: 'Failed to cancel automation' });
  }
});

module.exports = router;
