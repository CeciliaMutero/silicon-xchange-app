# Silicon Xchange - Africa Tech Signal Engine

A high-signal discovery platform for credible voices in the African tech and venture ecosystem.

## 🎯 The Mission

Silicon Xchange builds access infrastructure connecting Silicon Valley and African tech ecosystems. This platform solves the fragmented discovery and trust problem by providing a credible, curated directory of who to read/watch/listen to in Africa venture & tech.

## ✨ Features

### Core Functionality
- **98+ Verified Creators**: Extracted from real ecosystem recommendations
- **Smart Search & Filters**: By geography, topic, and media format
- **Trust Score System**: Game-theory resistant ranking algorithm
- **User Authentication**: Email-based signup/signin
- **Recommendation System**: Users vouch for creators with mandatory rationale
- **Admin Dashboard**: Approve/reject submissions, manage profiles

### The Trust Algorithm
Our trust score (6.0-10.0) considers:
- **Recommendation count** with diminishing returns (prevents spam)
- **Recommender credibility** (Investors > Founders > Operators)
- **Time decay** (recent recommendations valued more)
- **Diversity** (multiple unique recommenders > repeat)
- **Velocity checks** (flags suspicious gaming patterns)

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Icons**: Lucide React
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Supabase account
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/silicon-xchange-app.git
cd silicon-xchange-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Set up database**

Run the SQL scripts in Supabase SQL Editor (see `docs/database-setup.sql`)

5. **Seed initial data**
```bash
# Update credentials in scripts/extract-real-data.ts
npx ts-node scripts/extract-real-data.ts
```

6. **Run development server**
```bash
npm run dev
```

Open http://localhost:3000

## 📊 Database Schema

### Tables
- **profiles**: Creator profiles (name, bio, geography, topics, trust_score, status)
- **recommendations**: User recommendations (profile_id, user_id, rationale)
- **user_profiles**: User authentication data (full_name, professional_role, is_admin)

## 🎮 Usage

### For Users
1. Browse 98+ creators sorted by trust score
2. Filter by geography, topic, or format
3. Sign up to recommend creators
4. Provide detailed rationale for recommendations

### For Admins
1. Access `/admin` (requires admin privileges)
2. Review pending submissions
3. Approve/reject profiles
4. Monitor recommendation activity

## 🔐 Security & Trust

### Game Theory Prevention
- **No anonymous vouching**: All recommendations tied to verified identities
- **Mandatory rationale**: Forces thoughtful recommendations
- **Weighted signals**: Professional role determines recommendation weight
- **Velocity detection**: Flags suspicious burst activity
- **Diversity bonus**: Rewards broad ecosystem support

### Future Enhancements
- Citation/cross-platform mention verification
- Decay system for inactive creators
- Network graph analysis for reciprocal rings
- Signal verification via content quality metrics

## 📁 Project Structure
silicon-xchange-app/
├── app/
│   ├── page.tsx              # Homepage
│   ├── admin/page.tsx        # Admin dashboard
│   ├── submit/page.tsx       # Creator submission form
│   └── layout.tsx
├── components/
│   ├── AuthModal.tsx         # Login/Signup modal
│   └── RecommendModal.tsx    # Recommendation modal
├── lib/
│   ├── supabase.ts          # Supabase client
│   ├── auth.ts              # Auth helpers
│   └── trust-score.ts       # Trust algorithm
└── scripts/
└── extract-real-data.ts  # Data seeding script

## 🚢 Deployment

Deployed on Vercel:
- Production: [Your Vercel URL]
- Auto-deploys from `main` branch

## 📝 Engineering Reflection

### Gaming Prevention
- Role-weighted recommendations (investors carry more weight)
- Diminishing returns on recommendation count
- Diversity bonus for unique recommenders
- Velocity penalties for suspicious patterns

### Signal Freshness
- Time decay algorithm favors recent activity
- Admin review queue for quality control
- Community-driven curation

### Long-term Moat
- Network effects: more users = better signal
- Data moat: proprietary trust scores
- Community trust: verified ecosystem participants
- Content graph: relationships between creators

## 🤝 Contributing

This is a candidate assessment project for Silicon Xchange.

## 📄 License

Candidate retains code ownership. Silicon Xchange retains brand and strategic concepts.

## 🙏 Acknowledgments

Data extracted from Ashley Njoroge's LinkedIn ecosystem mapping initiative.
98 creators representing the best voices in African tech.

---

Built with ❤️ for the African tech ecosystem