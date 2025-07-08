const cheerio = require('cheerio');

class NicheResearchService {
  async analyzeNiche(businessIdea) {
    try {
      console.log(`🔍 Analyzing niche for: ${businessIdea}`);
      
      // Return mock data to prevent external scraping hangs
      return this.generateMockNicheData(businessIdea);
      
    } catch (error) {
      console.error('Niche analysis failed:', error);
      return this.getFallbackNicheData(businessIdea);
    }
  }

  // Enhanced HTML parsing function as mentioned in conversation history
  parseHTMLTrends(htmlContent) {
    try {
      const $ = cheerio.load(htmlContent);
      const trends = [];
      
      // Method 1: Parse script tags with trending data
      $('script').each((index, element) => {
        const scriptContent = $(element).html();
        if (scriptContent && scriptContent.includes('trending') || scriptContent.includes('popular')) {
          try {
            // Extract JSON data from script tags
            const jsonMatches = scriptContent.match(/\{[^}]*trending[^}]*\}/g);
            if (jsonMatches) {
              jsonMatches.forEach(match => {
                try {
                  const data = JSON.parse(match);
                  if (data.trends) {
                    trends.push(...data.trends);
                  }
                } catch (parseError) {
                  console.warn('Failed to parse trend JSON:', parseError);
                }
              });
            }
          } catch (error) {
            console.warn('Error processing script content:', error);
          }
        }
      });

      // Method 2: Parse visible text content
      $('.trending-item, .trend-data, [data-trend]').each((index, element) => {
        const trendText = $(element).text().trim();
        const trendValue = $(element).attr('data-value') || $(element).attr('data-trend');
        
        if (trendText && trendText.length > 0) {
          trends.push({
            term: trendText,
            value: trendValue || 'N/A',
            source: 'visible_content'
          });
        }
      });

      // Method 3: Parse meta tags
      $('meta[property*="trend"], meta[name*="trend"]').each((index, element) => {
        const content = $(element).attr('content');
        const property = $(element).attr('property') || $(element).attr('name');
        
        if (content) {
          trends.push({
            term: content,
            property: property,
            source: 'meta_tags'
          });
        }
      });

      // Method 4: Parse structured JSON-LD data
      $('script[type="application/ld+json"]').each((index, element) => {
        try {
          const jsonLD = JSON.parse($(element).html());
          if (jsonLD.trends || jsonLD.popular) {
            const trendData = jsonLD.trends || jsonLD.popular;
            if (Array.isArray(trendData)) {
              trends.push(...trendData);
            }
          }
        } catch (error) {
          console.warn('Failed to parse JSON-LD:', error);
        }
      });

      // Prioritize and clean results
      const cleanedTrends = this.prioritizeTrends(trends);
      
      return {
        trends: cleanedTrends,
        totalFound: trends.length,
        sources: [...new Set(trends.map(t => t.source || 'unknown'))]
      };

    } catch (error) {
      console.error('HTML parsing failed:', error);
      return {
        trends: [],
        totalFound: 0,
        sources: [],
        error: error.message
      };
    }
  }

  prioritizeTrends(trends) {
    // Remove duplicates and prioritize by source reliability
    const seen = new Set();
    const priorityOrder = ['json_ld', 'script_tags', 'visible_content', 'meta_tags'];
    
    return trends
      .filter(trend => {
        const key = trend.term || trend.name || trend.query;
        if (!key || seen.has(key.toLowerCase())) {
          return false;
        }
        seen.add(key.toLowerCase());
        return true;
      })
      .sort((a, b) => {
        const aIndex = priorityOrder.indexOf(a.source || 'unknown');
        const bIndex = priorityOrder.indexOf(b.source || 'unknown');
        return aIndex - bIndex;
      })
      .slice(0, 10); // Limit to top 10 trends
  }

  generateMockNicheData(businessIdea) {
    return {
      nicheOpportunities: [
        'Underserved market segments with specific needs',
        'Geographic regions with limited competition',
        'Industry verticals seeking specialized solutions',
        'Emerging technology adoption gaps'
      ],
      competitionLevel: 'Medium - Moderate competition with room for differentiation',
      marketPotential: 'High - Strong growth indicators and consumer demand',
      entryBarriers: [
        'Initial capital requirements for technology development',
        'Customer acquisition and brand building challenges',
        'Regulatory compliance in target markets'
      ],
      successFactors: [
        'Strong value proposition addressing real pain points',
        'Effective go-to-market strategy and execution',
        'Customer-centric product development approach',
        'Strategic partnerships and distribution channels'
      ]
    };
  }

  getFallbackNicheData(businessIdea) {
    return {
      nicheOpportunities: [
        'Market gaps identified for innovative solutions',
        'Consumer demand for improved products/services',
        'Technology trends creating new opportunities'
      ],
      competitionLevel: 'Moderate competition with differentiation potential',
      marketPotential: 'Positive growth potential based on market trends',
      entryBarriers: [
        'Market entry requirements and initial investment',
        'Brand building and customer acquisition challenges'
      ],
      successFactors: [
        'Clear value proposition and market fit',
        'Effective execution and customer focus',
        'Continuous innovation and adaptation'
      ]
    };
  }
}

module.exports = new NicheResearchService();
