const nicheResearchService = require('./nicheResearchService');

class TrendingAnalysisService {
  async analyzeTrends(businessIdea, isLucky = false) {
    try {
      console.log(`📈 Analyzing trends for: ${businessIdea}`);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Return mock data to prevent external API hangs
      return this.generateMockTrendData(businessIdea, isLucky);
      
    } catch (error) {
      console.error('Trending analysis failed:', error);
      return this.getFallbackTrendData(businessIdea);
    }
  }
  
  generateMockTrendData(businessIdea, isLucky) {
    const mockTrends = [
      {
        term: 'AI automation',
        popularity: 85,
        growth: 'Rising',
        relevance: 'High - Strong correlation with business automation and efficiency improvements'
      },
      {
        term: 'Remote work tools',
        popularity: 78,
        growth: 'Stable',
        relevance: 'Medium - Increasing demand for productivity and collaboration solutions'
      },
      {
        term: 'Sustainable business',
        popularity: 72,
        growth: 'Rising',
        relevance: 'High - Growing consumer preference for environmentally conscious businesses'
      },
      {
        term: 'Digital transformation',
        popularity: 90,
        growth: 'Rising',
        relevance: 'Very High - Essential for modern business operations and competitiveness'
      },
      {
        term: 'Customer experience',
        popularity: 82,
        growth: 'Stable',
        relevance: 'High - Critical for business success and customer retention'
      }
    ];
    
    const opportunities = [
      'Growing market demand for automated solutions',
      'Increasing adoption of AI-powered tools',
      'Rising interest in sustainable business practices',
      'Expanding remote work market segment',
      'Digital-first consumer behavior trends'
    ];
    
    const threats = [
      'Rapid technological changes requiring constant adaptation',
      'Increasing competition in digital markets',
      'Economic uncertainty affecting business investments',
      'Regulatory changes in technology sector',
      'Consumer privacy concerns limiting data usage'
    ];
    
    return {
      trends: mockTrends,
      opportunities,
      threats
    };
  }
  
  getFallbackTrendData(businessIdea) {
    return {
      trends: [
        {
          term: 'Innovation',
          popularity: 75,
          growth: 'Rising',
          relevance: 'High - General trend toward innovative solutions'
        },
        {
          term: 'Technology adoption',
          popularity: 80,
          growth: 'Rising',
          relevance: 'High - Increasing technology integration in business'
        },
        {
          term: 'Market growth',
          popularity: 70,
          growth: 'Stable',
          relevance: 'Medium - Overall market expansion trends'
        }
      ],
      opportunities: [
        'Growing market interest in new solutions',
        'Technology adoption creating new opportunities',
        'Consumer demand for innovative products'
      ],
      threats: [
        'Competitive market landscape',
        'Technology changes requiring adaptation',
        'Economic factors affecting growth'
      ]
    };
  }
}

module.exports = new TrendingAnalysisService();
