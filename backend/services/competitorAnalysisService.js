class CompetitorAnalysisService {
  async analyzeCompetitors(businessIdea, isLucky = false) {
    try {
      console.log(`🏢 Analyzing competitors for: ${businessIdea}`);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Return mock data to prevent external scraping hangs
      return this.generateMockCompetitorData(businessIdea, isLucky);
      
    } catch (error) {
      console.error('Competitor analysis failed:', error);
      return this.getFallbackCompetitorData(businessIdea);
    }
  }
  
  generateMockCompetitorData(businessIdea, isLucky) {
    const mockCompetitors = [
      {
        name: 'MarketLeader Pro',
        url: 'https://marketleader.com',
        description: 'Established market leader with comprehensive solutions and strong brand recognition',
        strengths: ['Large customer base', 'Strong brand recognition', 'Extensive resources'],
        weaknesses: ['High prices', 'Slow innovation', 'Complex user interface']
      },
      {
        name: 'InnovateNow',
        url: 'https://innovatenow.io',
        description: 'Agile startup focused on cutting-edge technology and user experience',
        strengths: ['Modern technology stack', 'User-friendly design', 'Rapid development'],
        weaknesses: ['Limited market presence', 'Smaller team', 'Funding constraints']
      },
      {
        name: 'TraditionCorp',
        url: 'https://traditioncorp.com',
        description: 'Traditional company with long industry experience and established processes',
        strengths: ['Industry expertise', 'Reliable service', 'Strong partnerships'],
        weaknesses: ['Outdated technology', 'Rigid processes', 'Slow adaptation']
      }
    ];
    
    const marketGaps = [
      'Lack of mobile-first solutions in the market',
      'Limited personalization options from current providers',
      'High barrier to entry for new users',
      'Insufficient integration with modern tools',
      'Poor customer support responsiveness'
    ];
    
    const competitiveAdvantages = [
      'Advanced AI-powered features',
      'Superior user experience design',
      'Competitive pricing strategy',
      'Faster time to market',
      'Better customer support',
      'More flexible solution architecture'
    ];
    
    return {
      competitors: mockCompetitors,
      marketGaps,
      competitiveAdvantages
    };
  }
  
  getFallbackCompetitorData(businessIdea) {
    return {
      competitors: [
        {
          name: 'Generic Competitor A',
          url: 'https://competitor-a.com',
          description: 'Major player in the market with established presence',
          strengths: ['Market presence', 'Customer base', 'Resources'],
          weaknesses: ['Limited innovation', 'High costs', 'Complex solutions']
        },
        {
          name: 'Generic Competitor B',
          url: 'https://competitor-b.com',
          description: 'Emerging competitor with focus on innovation',
          strengths: ['New technology', 'Agile approach', 'Competitive pricing'],
          weaknesses: ['Limited market share', 'Brand recognition', 'Resource constraints']
        }
      ],
      marketGaps: [
        'Opportunity for improved user experience',
        'Need for more affordable solutions',
        'Demand for better customer support',
        'Market need for innovative features'
      ],
      competitiveAdvantages: [
        'Innovative approach to problem solving',
        'Better value proposition',
        'Superior customer experience',
        'Faster market responsiveness'
      ]
    };
  }
}

module.exports = new CompetitorAnalysisService();
