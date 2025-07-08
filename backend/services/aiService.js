class AIService {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY;
    this.baseUrl = 'https://api.groq.com/openai/v1';
    this.model = 'llama3-8b-8192'; // Current working model
  }

  async generateMarketAnalysis(businessIdea) {
    try {
      // Use real Groq API if key is available
      if (this.apiKey) {
        const realAnalysis = await this.callGroqAPI(businessIdea);
        if (realAnalysis) {
          return realAnalysis;
        }
      }
      
      // Fallback to mock data if API fails or no key
      console.log('Using mock market analysis data');
      return this.generateMockAnalysis(businessIdea);
      
    } catch (error) {
      console.error('AI analysis failed:', error);
      return this.getFallbackAnalysis(businessIdea);
    }
  }

  async callGroqAPI(businessIdea) {
    try {
      const axios = require('axios');
      
      const prompt = `Analyze the market for this business idea: "${businessIdea}"

Provide a comprehensive market analysis in JSON format with these fields:
- overview: Market overview and potential (2-3 sentences)
- targetAudience: Description of target audience (2-3 sentences)
- marketSize: Market size estimation with numbers if possible (1-2 sentences)
- keyInsights: Array of 4-5 key market insights as strings

Respond only with valid JSON.`;

      const response = await axios.post(`${this.baseUrl}/chat/completions`, {
        model: this.model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      const content = response.data.choices[0].message.content;
      
      // Try to parse JSON response
      try {
        const analysis = JSON.parse(content);
        
        // Validate required fields
        if (analysis.overview && analysis.targetAudience && analysis.marketSize && analysis.keyInsights) {
          return analysis;
        }
      } catch (parseError) {
        console.warn('Failed to parse Groq API response as JSON:', parseError);
      }
      
      return null;
      
    } catch (error) {
      console.error('Groq API call failed:', error.message);
      return null;
    }
  }

  generateMockAnalysis(businessIdea) {
    return {
      overview: `The ${businessIdea} market is experiencing significant growth driven by technological advancement and changing consumer preferences. Market analysis indicates strong potential for innovative solutions that address current pain points and deliver superior value propositions.`,
      targetAudience: `Primary audience includes tech-savvy professionals aged 25-45 with medium to high disposable income. Secondary segments include early adopters, business decision-makers, and consumers seeking efficiency improvements in their daily routines.`,
      marketSize: `Total addressable market estimated at $2.1B globally, with serviceable addressable market of $650M in primary regions. Annual growth rate projected at 12-18% based on current adoption trends and market dynamics.`,
      keyInsights: [
        'Strong demand for automated and intelligent solutions',
        'Consumer willingness to pay premium for superior user experience',
        'Market consolidation creating opportunities for disruptive innovation',
        'Regulatory environment favorable for technology adoption',
        'Partnership opportunities with established industry players'
      ]
    };
  }

  getFallbackAnalysis(businessIdea) {
    return {
      overview: `Market analysis for ${businessIdea} indicates positive growth potential with favorable market conditions for new entrants.`,
      targetAudience: `Target audience consists of forward-thinking consumers and businesses seeking innovative solutions.`,
      marketSize: `Market size shows promising growth potential with estimated addressable market opportunity.`,
      keyInsights: [
        'Growing market demand for innovative solutions',
        'Technology adoption driving market expansion',
        'Competitive landscape offering differentiation opportunities',
        'Strong potential for customer acquisition and retention'
      ]
    };
  }

  async generateBusinessInsights(businessIdea, marketData, competitorData, trendData) {
    try {
      // Mock insights generation
      return {
        strengths: [
          'Strong market positioning opportunity',
          'Technology-driven competitive advantage',
          'Clear value proposition for target audience'
        ],
        opportunities: [
          'Untapped market segments with high growth potential',
          'Partnership opportunities with industry leaders',
          'Technology trends supporting business model'
        ],
        recommendations: [
          'Focus on MVP development with core features',
          'Implement agile go-to-market strategy',
          'Build strategic partnerships early',
          'Invest in customer feedback and iteration cycles'
        ]
      };
      
    } catch (error) {
      console.error('Business insights generation failed:', error);
      return this.getFallbackInsights();
    }
  }

  getFallbackInsights() {
    return {
      strengths: [
        'Market opportunity for innovation',
        'Potential for competitive differentiation',
        'Growing consumer demand'
      ],
      opportunities: [
        'Market expansion possibilities',
        'Technology adoption trends',
        'Partnership potential'
      ],
      recommendations: [
        'Develop minimum viable product',
        'Test market demand through pilot programs',
        'Build customer feedback loops',
        'Plan for iterative improvement'
      ]
    };
  }
}

module.exports = new AIService();
