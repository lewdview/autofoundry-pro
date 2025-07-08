const aiService = require('./aiService');

class MarketResearchService {
  async analyzeMarket(businessIdea, isLucky = false) {
    try {
      console.log(`📊 Analyzing market for: ${businessIdea}`);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (isLucky) {
        return this.generateLuckyMarketData(businessIdea);
      }
      
      // Use AI service to generate market analysis
      const marketAnalysis = await aiService.generateMarketAnalysis(businessIdea);
      
      return {
        overview: marketAnalysis.overview || this.getDefaultOverview(businessIdea),
        targetAudience: marketAnalysis.targetAudience || this.getDefaultTargetAudience(businessIdea),
        marketSize: marketAnalysis.marketSize || this.getDefaultMarketSize(businessIdea),
        keyInsights: marketAnalysis.keyInsights || this.getDefaultKeyInsights(businessIdea)
      };
      
    } catch (error) {
      console.error('Market research failed:', error);
      // Return fallback data
      return this.getFallbackMarketData(businessIdea);
    }
  }
  
  generateLuckyMarketData(businessIdea) {
    const luckyIdeas = [
      'AI-powered fitness coaching app',
      'Sustainable packaging solutions',
      'Remote work productivity tools',
      'Plant-based meal delivery service',
      'Virtual reality meditation platform'
    ];
    
    const randomIdea = luckyIdeas[Math.floor(Math.random() * luckyIdeas.length)];
    
    return {
      overview: `The ${randomIdea} market is experiencing unprecedented growth with emerging consumer trends favoring innovative, technology-driven solutions. Market dynamics indicate strong demand for accessible, user-friendly products that solve real-world problems.`,
      targetAudience: `Primary: Tech-savvy millennials and Gen Z consumers (ages 25-40) with disposable income. Secondary: Health-conscious professionals seeking convenient solutions. Tertiary: Early adopters interested in sustainable and innovative products.`,
      marketSize: `Global market size estimated at $2.3B with 15% annual growth rate. Target addressable market: $450M in North America, $280M in Europe, $190M in Asia-Pacific. Strong potential for rapid expansion.`,
      keyInsights: [
        'Consumer behavior shifting toward digital-first solutions',
        'Increasing willingness to pay premium for sustainable options',
        'Strong demand for personalized, AI-driven experiences',
        'Mobile-first approach essential for market penetration',
        'Subscription models showing higher customer lifetime value'
      ]
    };
  }
  
  getFallbackMarketData(businessIdea) {
    return {
      overview: `The ${businessIdea} market shows promising potential with growing consumer interest and emerging opportunities. Market research indicates favorable conditions for new entrants with innovative approaches.`,
      targetAudience: `Primary target audience includes early adopters and innovation-focused consumers aged 25-45. Secondary audiences include professionals seeking efficiency improvements and cost-effective solutions.`,
      marketSize: `Market size estimated at $500M+ with steady growth projections. Addressable market provides significant opportunity for well-positioned products and services.`,
      keyInsights: [
        'Growing consumer awareness and demand',
        'Limited competition in specific niches',
        'Technology adoption accelerating market growth',
        'Opportunity for differentiation through innovation',
        'Strong potential for market expansion'
      ]
    };
  }
  
  getDefaultOverview(businessIdea) {
    return `The ${businessIdea} market presents significant opportunities with evolving consumer preferences and technological advancements creating new possibilities for innovative solutions.`;
  }
  
  getDefaultTargetAudience(businessIdea) {
    return `Target audience consists of forward-thinking consumers and businesses seeking innovative solutions, with primary focus on tech-savvy users aged 25-45 with medium to high disposable income.`;
  }
  
  getDefaultMarketSize(businessIdea) {
    return `Market size shows promising growth potential with estimated addressable market of $100M+ and projected annual growth rate of 10-15% based on current trends and adoption patterns.`;
  }
  
  getDefaultKeyInsights(businessIdea) {
    return [
      'Increasing consumer demand for innovative solutions',
      'Technology adoption driving market growth',
      'Competitive landscape offers differentiation opportunities',
      'Strong potential for market expansion and scale',
      'Customer acquisition costs remain manageable'
    ];
  }
}

module.exports = new MarketResearchService();
