/**
 * TRUST SCORE ALGORITHM
 * 
 * Designed to be game-theory resistant and weighted by professional credibility.
 * 
 * Factors:
 * 1. Base Score: 7.0 (everyone starts credible)
 * 2. Recommendation Count: Diminishing returns (prevents spam)
 * 3. Recommender Role Weight: Founders/Investors have more weight
 * 4. Time Decay: Recent recommendations valued more
 * 5. Diversity: Multiple different recommenders valued over repeat
 */

interface Recommendation {
  user_title: string
  created_at: string
  user_id: string
}

// Role weights - reflects real-world credibility in tech ecosystem
const ROLE_WEIGHTS: Record<string, number> = {
  'Founder': 1.3,      // Founders have built, understand execution
  'Investor': 1.4,     // Investors see many deals, pattern recognition
  'Operator': 1.1,     // Operators have hands-on experience
  'Builder': 1.0,      // Builders have technical credibility
  'Journalist': 0.9,   // Journalists observe but don't execute
  'Other': 0.7,        // Unknown roles have less weight
}

/**
 * Calculate trust score for a profile
 */
export function calculateTrustScore(recommendations: Recommendation[]): number {
  if (recommendations.length === 0) {
    return 7.0 // Default score for new profiles
  }

  let score = 7.0 // Base score

  // 1. RECOMMENDATION VALUE with diminishing returns
  // First 5 recs are valuable, then diminishing returns kick in
  const recCount = recommendations.length
  if (recCount <= 5) {
    score += recCount * 0.3 // 0.3 per rec
  } else if (recCount <= 10) {
    score += 1.5 + ((recCount - 5) * 0.2) // Slower growth
  } else {
    score += 2.5 + ((recCount - 10) * 0.1) // Even slower
  }

  // 2. ROLE WEIGHTING
  // Weight by who's recommending (investors > founders > operators)
  const roleBonus = recommendations.reduce((sum, rec) => {
    const weight = ROLE_WEIGHTS[rec.user_title] || 0.7
    return sum + (weight - 1.0) * 0.15 // Convert to bonus points
  }, 0)
  score += roleBonus

  // 3. TIME DECAY
  // Recent recommendations are more valuable
  const now = new Date()
  const timeBonus = recommendations.reduce((sum, rec) => {
    const recDate = new Date(rec.created_at)
    const daysAgo = (now.getTime() - recDate.getTime()) / (1000 * 60 * 60 * 24)
    
    if (daysAgo < 30) return sum + 0.1      // Very recent
    if (daysAgo < 90) return sum + 0.05     // Recent
    if (daysAgo < 180) return sum + 0.02    // Somewhat recent
    return sum                               // Old recs don't add
  }, 0)
  score += Math.min(timeBonus, 0.5) // Cap time bonus

  // 4. DIVERSITY BONUS
  // Multiple different people recommending is better than one person multiple times
  const uniqueRecommenders = new Set(recommendations.map(r => r.user_id)).size
  const diversityRatio = uniqueRecommenders / recCount
  score += diversityRatio * 0.3

  // 5. VELOCITY PENALTY
  // If too many recs too fast, might be coordinated gaming
  if (recCount >= 10) {
    const recentRecs = recommendations.filter(rec => {
      const daysAgo = (now.getTime() - new Date(rec.created_at).getTime()) / (1000 * 60 * 60 * 24)
      return daysAgo < 7
    }).length

    if (recentRecs > 5) {
      score -= 0.5 // Suspicious velocity
    }
  }

  // Cap between 6.0 and 10.0
  return Math.max(6.0, Math.min(10.0, score))
}

/**
 * Detect potential gaming attempts
 */
export function detectGaming(recommendations: Recommendation[]): string[] {
  const warnings: string[] = []

  // Check for reciprocal rings (same users recommending each other)
  const userIds = recommendations.map(r => r.user_id)
  const duplicates = userIds.filter((id, index) => userIds.indexOf(id) !== index)
  if (duplicates.length > 2) {
    warnings.push('Multiple recommendations from same users detected')
  }

  // Check for burst activity
  const now = new Date()
  const last24h = recommendations.filter(rec => {
    const daysAgo = (now.getTime() - new Date(rec.created_at).getTime()) / (1000 * 60 * 60 * 24)
    return daysAgo < 1
  }).length

  if (last24h > 10) {
    warnings.push('Unusually high recommendation velocity')
  }

  // Check for low-quality role distribution
  const lowQualityRoles = recommendations.filter(r => 
    r.user_title === 'Other' || !r.user_title
  ).length

  if (lowQualityRoles > recommendations.length * 0.5) {
    warnings.push('Many recommendations from unverified roles')
  }

  return warnings
}

/**
 * Get human-readable trust score interpretation
 */
export function getTrustScoreLabel(score: number): string {
  if (score >= 9.5) return 'Exceptional'
  if (score >= 9.0) return 'Outstanding'
  if (score >= 8.5) return 'Excellent'
  if (score >= 8.0) return 'Very Good'
  if (score >= 7.5) return 'Good'
  if (score >= 7.0) return 'Solid'
  return 'Emerging'
}