# Silicon Xchange - Technical Architecture

## System Overview

Silicon Xchange is a **credibility-based discovery engine** for African tech voices. Unlike social networks or content aggregators, we focus on **trust signals** and **ecosystem validation**.

## Core Architecture Decisions

### 1. Data Model

**Profiles Table**
- Stores creator/publication metadata
- `status` field enables moderation workflow
- `trust_score` calculated from recommendations
- `topics` as array enables multi-tag filtering

**Recommendations Table**
- Links users to profiles they vouch for
- `rationale` field is mandatory (prevents lazy vouching)
- `user_title` enables role-weighted scoring

**User Profiles Table**
- Extends Supabase auth
- `is_admin` enables role-based access
- `professional_role` weights recommendation value

### 2. Trust Score Algorithm

**Design Philosophy**: Game-theory resistant, diminishing returns, credibility-weighted

```typescript
Base Score: 7.0
+ Recommendation Count (diminishing: 0.3 → 0.2 → 0.1)
+ Role Weight Bonus (Investor 1.4x, Founder 1.3x, etc.)
+ Time Decay Bonus (recent recs worth more)
+ Diversity Bonus (unique recommenders valued)
- Velocity Penalty (suspicious bursts flagged)
= Final Score (capped 6.0-10.0)
```

**Key Properties**:
- **Diminishing returns**: First 5 recommendations matter most
- **Role weighting**: Investors/founders carry more weight
- **Time decay**: Recent activity valued over old
- **Diversity premium**: Broad support > concentrated
- **Gaming detection**: Flags coordinated manipulation

### 3. Authentication Flow

**Supabase Auth** (email/password for MVP)
- JWT tokens in httpOnly cookies
- Row-level security policies
- Admin flag in user_profiles table

**Future**: LinkedIn OAuth for verified professional identity

### 4. Moderation Workflow

**Three-stage pipeline**:
1. **Submission** → `status: 'pending'`
2. **Admin Review** → Approve/Reject
3. **Live** → `status: 'approved'` (visible to all)

**Admin Dashboard** provides:
- Pending queue
- Batch approval
- Profile management
- Recommendation monitoring

## Moat Strategy

### Short-term (0-6 months)
- **Network effects**: Early adopters become trusted validators
- **Data quality**: Curated > comprehensive
- **Community ownership**: Users invested in quality

### Medium-term (6-18 months)
- **Trust graph**: Network analysis of recommender relationships
- **Content verification**: Automated citation checking
- **API access**: Ecosystem tools integration

### Long-term (18+ months)
- **Proprietary scores**: Trust rankings become reference standard
- **Platform lock-in**: Profiles become professional identity
- **Data moat**: Historical recommendation patterns

## Gaming Prevention

### Identified Attack Vectors

1. **Reciprocal Rings**
   - Detection: User ID clustering analysis
   - Mitigation: Diversity bonus, manual review

2. **Fake Authority**
   - Detection: Professional role verification
   - Mitigation: LinkedIn OAuth (future), manual vetting

3. **Velocity Gaming**
   - Detection: Burst activity monitoring
   - Mitigation: Velocity penalties, time decay

4. **Sock Puppets**
   - Detection: Email domain analysis
   - Mitigation: Verified professional accounts required

### Defense Layers
1. **Algorithmic**: Trust score math resists gaming
2. **Social**: Community policing via recommendations
3. **Administrative**: Manual review for suspicious patterns
4. **Technical**: Rate limiting, email verification

## Scaling Considerations

### Database
- Postgres (Supabase) handles 100K+ profiles easily
- Indexes on: geography, topics (GIN), trust_score
- Row-level security policies for access control

### Performance
- Next.js static generation for profile pages
- Client-side filtering (sub-100ms for 1000 profiles)
- Supabase edge functions for real-time updates

### Costs (at 10K MAU)
- Supabase Free tier → $25/mo (at scale)
- Vercel Free tier → $20/mo (at scale)
- **Total**: <$50/mo for MVP, scales to $200/mo at 100K MAU

## Technology Choices

### Why Next.js?
- SSR for SEO (profiles discoverable via Google)
- API routes for serverless functions
- Fast refresh development experience
- Vercel deployment (zero-config)

### Why Supabase?
- PostgreSQL (real database, not NoSQL)
- Built-in auth and RLS
- Real-time subscriptions (future)
- Open source (vendor flexibility)

### Why TypeScript?
- Type safety for data models
- Better IDE experience
- Reduces runtime errors
- Professional standard

## Future Enhancements

### Phase 2 (Next 90 days)
- LinkedIn OAuth for verified identity
- Automated citation checking
- Email notifications for recommendations
- Profile analytics for creators

### Phase 3 (90-180 days)
- Trust graph visualization
- API for ecosystem tools
- Slack/Discord bot integration
- Weekly newsletter generation

### Phase 4 (180+ days)
- AI-powered content quality scoring
- Cross-platform mention tracking
- Decay system for inactive profiles
- Recommendation marketplace

## Deployment Architecture
User → Vercel Edge (CDN) → Next.js App → Supabase (Auth + DB)
↓
Trust Score Algorithm
**Production URL**: [Your Vercel URL]
**Database**: Supabase (us-east-1)
**CDN**: Vercel Edge Network (global)

## Monitoring & Analytics

**Key Metrics**:
- Trust score distribution
- Recommendation velocity
- User engagement (recommendations/user)
- Geographic coverage
- Topic diversity

**Tools** (future):
- Vercel Analytics
- Supabase Dashboard
- Custom admin metrics

---

**Document Version**: 1.0  
**Last Updated**: May 2026  
**Author**: Cecilia Wangui Mutero