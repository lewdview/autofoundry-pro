const mongoose = require('mongoose');

const automationSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  businessIdea: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'failed', 'cancelled'],
    default: 'active'
  },
  currentStep: {
    type: String,
    enum: ['initialization', 'market_research', 'competitive_analysis', 'trending_analysis', 'business_plan', 'completed'],
    default: 'initialization'
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  steps: [{
    name: String,
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'failed'],
      default: 'pending'
    },
    startTime: Date,
    endTime: Date,
    data: mongoose.Schema.Types.Mixed,
    error: String
  }],
  results: {
    marketResearch: {
      overview: String,
      targetAudience: String,
      marketSize: String,
      keyInsights: [String]
    },
    competitorAnalysis: {
      competitors: [{
        name: String,
        url: String,
        description: String,
        strengths: [String],
        weaknesses: [String]
      }],
      marketGaps: [String],
      competitiveAdvantages: [String]
    },
    trendingAnalysis: {
      trends: [{
        term: String,
        popularity: Number,
        growth: String,
        relevance: String
      }],
      opportunities: [String],
      threats: [String]
    },
    businessPlan: {
      executiveSummary: String,
      marketStrategy: String,
      revenueModel: String,
      implementation: String,
      risks: [String],
      nextSteps: [String]
    }
  },
  metadata: {
    userAgent: String,
    ipAddress: String,
    startTime: {
      type: Date,
      default: Date.now
    },
    endTime: Date,
    duration: Number,
    errorCount: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  versionKey: false
});

// Index for efficient queries
automationSessionSchema.index({ status: 1, createdAt: -1 });
automationSessionSchema.index({ currentStep: 1, status: 1 });

// Pre-save middleware to calculate duration
automationSessionSchema.pre('save', function(next) {
  if (this.metadata.endTime && this.metadata.startTime) {
    this.metadata.duration = this.metadata.endTime - this.metadata.startTime;
  }
  next();
});

// Instance methods
automationSessionSchema.methods.updateStep = function(stepName, status, data = null, error = null) {
  const step = this.steps.find(s => s.name === stepName);
  if (step) {
    step.status = status;
    step.data = data;
    step.error = error;
    if (status === 'in_progress') {
      step.startTime = new Date();
    } else if (status === 'completed' || status === 'failed') {
      step.endTime = new Date();
    }
  }
  return this.save();
};

automationSessionSchema.methods.completeSession = function() {
  this.status = 'completed';
  this.currentStep = 'completed';
  this.progress = 100;
  this.metadata.endTime = new Date();
  return this.save();
};

automationSessionSchema.methods.failSession = function(error) {
  this.status = 'failed';
  this.metadata.endTime = new Date();
  this.metadata.errorCount += 1;
  return this.save();
};

const AutomationSession = mongoose.model('AutomationSession', automationSessionSchema);

module.exports = AutomationSession;
