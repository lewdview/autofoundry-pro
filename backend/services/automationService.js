const AutomationSession = require('../models/AutomationSession');
const marketResearchService = require('./marketResearchService');
const competitorAnalysisService = require('./competitorAnalysisService');
const trendingAnalysisService = require('./trendingAnalysisService');
const businessPlanService = require('./businessPlanService');

class AutomationService {
  constructor() {
    this.activeAutomations = new Map();
  }

  async runAutomation(sessionId, businessIdea, isLucky = false) {
    try {
      // Mark as active
      this.activeAutomations.set(sessionId, true);
      
      const session = await AutomationSession.findOne({ sessionId });
      if (!session) {
        throw new Error('Session not found');
      }

      // Step 1: Market Research
      await this.executeStep(session, 'market_research', async () => {
        console.log(`🔍 Starting market research for: ${businessIdea}`);
        const marketData = await marketResearchService.analyzeMarket(businessIdea, isLucky);
        session.results.marketResearch = marketData;
        session.progress = 20;
        return marketData;
      });

      // Step 2: Competitor Analysis
      await this.executeStep(session, 'competitive_analysis', async () => {
        console.log(`🏢 Starting competitor analysis for: ${businessIdea}`);
        const competitorData = await competitorAnalysisService.analyzeCompetitors(businessIdea, isLucky);
        session.results.competitorAnalysis = competitorData;
        session.progress = 40;
        return competitorData;
      });

      // Step 3: Trending Analysis
      await this.executeStep(session, 'trending_analysis', async () => {
        console.log(`📈 Starting trending analysis for: ${businessIdea}`);
        const trendData = await trendingAnalysisService.analyzeTrends(businessIdea, isLucky);
        session.results.trendingAnalysis = trendData;
        session.progress = 60;
        return trendData;
      });

      // Step 4: Business Plan Generation
      await this.executeStep(session, 'business_plan', async () => {
        console.log(`📋 Generating business plan for: ${businessIdea}`);
        const businessPlan = await businessPlanService.generateBusinessPlan(
          businessIdea,
          session.results.marketResearch,
          session.results.competitorAnalysis,
          session.results.trendingAnalysis,
          isLucky
        );
        session.results.businessPlan = businessPlan;
        session.progress = 80;
        return businessPlan;
      });

      // Complete automation
      await session.completeSession();
      console.log(`✅ Automation completed for: ${businessIdea}`);
      
    } catch (error) {
      console.error('Automation failed:', error);
      const session = await AutomationSession.findOne({ sessionId });
      if (session) {
        await session.failSession(error.message);
      }
    } finally {
      // Remove from active automations
      this.activeAutomations.delete(sessionId);
    }
  }

  async executeStep(session, stepName, stepFunction) {
    try {
      // Check if automation was cancelled
      if (session.status === 'cancelled') {
        throw new Error('Automation was cancelled');
      }

      // Update step status to in_progress
      session.currentStep = stepName;
      await session.updateStep(stepName, 'in_progress');

      // Execute the step
      const result = await stepFunction();

      // Update step status to completed
      await session.updateStep(stepName, 'completed', result);

      return result;

    } catch (error) {
      console.error(`Step ${stepName} failed:`, error);
      await session.updateStep(stepName, 'failed', null, error.message);
      throw error;
    }
  }

  exportResults(session, format) {
    const results = session.results;
    
    switch (format.toLowerCase()) {
      case 'json':
        return {
          contentType: 'application/json',
          data: JSON.stringify(results, null, 2)
        };
      
      case 'txt':
        return {
          contentType: 'text/plain',
          data: this.formatAsText(results, session.businessIdea)
        };
      
      case 'md':
        return {
          contentType: 'text/markdown',
          data: this.formatAsMarkdown(results, session.businessIdea)
        };
      
      default:
        throw new Error('Unsupported export format');
    }
  }

  formatAsText(results, businessIdea) {
    let text = `BUSINESS AUTOMATION REPORT\n`;
    text += `=========================\n\n`;
    text += `Business Idea: ${businessIdea}\n`;
    text += `Generated: ${new Date().toISOString()}\n\n`;

    if (results.marketResearch) {
      text += `MARKET RESEARCH\n`;
      text += `---------------\n`;
      text += `Overview: ${results.marketResearch.overview}\n`;
      text += `Target Audience: ${results.marketResearch.targetAudience}\n`;
      text += `Market Size: ${results.marketResearch.marketSize}\n`;
      text += `Key Insights:\n`;
      results.marketResearch.keyInsights?.forEach(insight => {
        text += `- ${insight}\n`;
      });
      text += `\n`;
    }

    if (results.competitorAnalysis) {
      text += `COMPETITOR ANALYSIS\n`;
      text += `-------------------\n`;
      results.competitorAnalysis.competitors?.forEach(competitor => {
        text += `${competitor.name}: ${competitor.description}\n`;
      });
      text += `\n`;
    }

    if (results.trendingAnalysis) {
      text += `TRENDING ANALYSIS\n`;
      text += `-----------------\n`;
      results.trendingAnalysis.trends?.forEach(trend => {
        text += `${trend.term}: ${trend.relevance}\n`;
      });
      text += `\n`;
    }

    if (results.businessPlan) {
      text += `BUSINESS PLAN\n`;
      text += `-------------\n`;
      text += `Executive Summary: ${results.businessPlan.executiveSummary}\n`;
      text += `Market Strategy: ${results.businessPlan.marketStrategy}\n`;
      text += `Revenue Model: ${results.businessPlan.revenueModel}\n`;
      text += `Implementation: ${results.businessPlan.implementation}\n`;
    }

    return text;
  }

  formatAsMarkdown(results, businessIdea) {
    let md = `# Business Automation Report\n\n`;
    md += `**Business Idea:** ${businessIdea}\n`;
    md += `**Generated:** ${new Date().toISOString()}\n\n`;

    if (results.marketResearch) {
      md += `## Market Research\n\n`;
      md += `**Overview:** ${results.marketResearch.overview}\n\n`;
      md += `**Target Audience:** ${results.marketResearch.targetAudience}\n\n`;
      md += `**Market Size:** ${results.marketResearch.marketSize}\n\n`;
      md += `**Key Insights:**\n`;
      results.marketResearch.keyInsights?.forEach(insight => {
        md += `- ${insight}\n`;
      });
      md += `\n`;
    }

    if (results.competitorAnalysis) {
      md += `## Competitor Analysis\n\n`;
      results.competitorAnalysis.competitors?.forEach(competitor => {
        md += `### ${competitor.name}\n`;
        md += `${competitor.description}\n\n`;
      });
    }

    if (results.trendingAnalysis) {
      md += `## Trending Analysis\n\n`;
      results.trendingAnalysis.trends?.forEach(trend => {
        md += `- **${trend.term}:** ${trend.relevance}\n`;
      });
      md += `\n`;
    }

    if (results.businessPlan) {
      md += `## Business Plan\n\n`;
      md += `### Executive Summary\n${results.businessPlan.executiveSummary}\n\n`;
      md += `### Market Strategy\n${results.businessPlan.marketStrategy}\n\n`;
      md += `### Revenue Model\n${results.businessPlan.revenueModel}\n\n`;
      md += `### Implementation\n${results.businessPlan.implementation}\n\n`;
    }

    return md;
  }

  isAutomationActive(sessionId) {
    return this.activeAutomations.has(sessionId);
  }

  getActiveAutomations() {
    return Array.from(this.activeAutomations.keys());
  }
}

module.exports = new AutomationService();
