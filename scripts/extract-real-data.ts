import { createClient } from '@supabase/supabase-js'

// Replace with your actual credentials
const supabaseUrl = "https://yhhsvadwkkkyknesdaim.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloaHN2YWR3a2treWtuZXNkYWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0Mjc2NjgsImV4cCI6MjA5NTAwMzY2OH0.4t-3tD6gmx9TxvqTAGg0-6qagsY1uCY4frZR-9mgzzk"

const supabase = createClient(supabaseUrl, supabaseKey)

// Extracted from Ashley's LinkedIn post - 100+ African Tech Creators
const realProfiles = [
  // PUBLICATIONS & MEDIA
  {
    name: "TechCabal",
    bio: "Leading pan-African tech news platform covering startups, innovation, and digital transformation across the continent. Essential reading for ecosystem participants.",
    platform_link: "https://techcabal.com",
    geography: "Pan-African",
    topics: ["Tech News", "Startups", "Innovation", "Investigative Journalism"],
    media_format: "Newsletter",
    recommendation_count: 18,
    trust_score: 9.5,
    status: "approved"
  },
  {
    name: "Africa: The Big Deal",
    bio: "Comprehensive database tracking African startup funding rounds. Most reliable source for African funding data used for market sizing and competitive analysis.",
    platform_link: "https://thebigdeal.substack.com",
    geography: "Pan-African",
    topics: ["Funding Data", "Market Research", "Venture Capital", "Startups"],
    media_format: "Newsletter",
    recommendation_count: 16,
    trust_score: 9.4,
    status: "approved"
  },
  {
    name: "Tech Safari",
    bio: "Helping 60,000+ innovators navigate the future of tech in Africa. Weekly insights on African business and tech for professionals.",
    platform_link: "https://techsafari.io",
    geography: "Pan-African",
    topics: ["Tech News", "Business", "Market Analysis"],
    media_format: "Newsletter",
    recommendation_count: 15,
    trust_score: 9.3,
    status: "approved"
  },
  {
    name: "The Flip",
    bio: "Bi-weekly newsletter on African tech and business. Best long-form analysis of African tech trends with well-researched context.",
    platform_link: "https://theflip.africa",
    geography: "Pan-African",
    topics: ["Tech Analysis", "Business", "Trends", "Deep Dives"],
    media_format: "Newsletter",
    recommendation_count: 14,
    trust_score: 9.2,
    status: "approved"
  },
  {
    name: "Afridigest",
    bio: "Ideas, analysis, and insights for business innovators across Africa and beyond. Helping readers get smarter about Africa's tech ecosystem.",
    platform_link: "https://afridigest.com",
    geography: "Pan-African",
    topics: ["Business", "Innovation", "Tech Analysis"],
    media_format: "Newsletter",
    recommendation_count: 13,
    trust_score: 9.1,
    status: "approved"
  },
  {
    name: "Stears",
    bio: "Business intelligence and data-driven journalism focused on African markets. Deep market insights and analysis.",
    platform_link: "https://stears.co",
    geography: "Pan-African",
    topics: ["Business Intelligence", "Data Journalism", "Market Analysis"],
    media_format: "Newsletter",
    recommendation_count: 12,
    trust_score: 9.0,
    status: "approved"
  },
  {
    name: "The Open Letter",
    bio: "Championing South African founders and the companies they're building. Best coverage of South African startup ecosystem.",
    platform_link: "https://theopenletter.co.za",
    geography: "South Africa",
    topics: ["Startups", "Founders", "Venture Capital"],
    media_format: "Newsletter",
    recommendation_count: 14,
    trust_score: 9.2,
    status: "approved"
  },
  {
    name: "Communiqué",
    bio: "Weekly briefing on African tech, startups, and venture capital. Curated insights for busy ecosystem players.",
    platform_link: "https://readcommunique.com",
    geography: "Pan-African",
    topics: ["News Curation", "Startups", "VC"],
    media_format: "Newsletter",
    recommendation_count: 11,
    trust_score: 8.9,
    status: "approved"
  },
  {
    name: "Included VC Medium",
    bio: "Deep dives on every sector in Africa with interviews with Africa's most prominent investors, founders, operators, and policymakers.",
    platform_link: "https://medium.com/included-vc",
    geography: "Pan-African",
    topics: ["Venture Capital", "Deep Dives", "Interviews"],
    media_format: "Publication",
    recommendation_count: 10,
    trust_score: 8.8,
    status: "approved"
  },
  {
    name: "Techpoint Africa",
    bio: "Leading Nigerian and African tech publication covering startups, innovation, and digital economy.",
    platform_link: "https://techpoint.africa",
    geography: "Nigeria",
    topics: ["Tech News", "Startups", "Digital Economy"],
    media_format: "Newsletter",
    recommendation_count: 9,
    trust_score: 8.7,
    status: "approved"
  },

  // INDIVIDUAL CREATORS & INVESTORS
  {
    name: "Samora Kariuki",
    bio: "Prominent voice in African tech ecosystem. Frequently recommended for insights on venture and entrepreneurship.",
    platform_link: "https://www.linkedin.com/in/samorakariuki",
    geography: "Kenya",
    topics: ["Venture Capital", "Entrepreneurship", "Tech Ecosystem"],
    media_format: "LinkedIn",
    recommendation_count: 17,
    trust_score: 9.4,
    status: "approved"
  },
  {
    name: "Iyinoluwa Aboyeji",
    bio: "Co-founder of Andela and Flutterwave. Founded Future Africa. Track record and insights on building for Africa are invaluable for founders.",
    platform_link: "https://www.linkedin.com/in/iaboyeji",
    geography: "Nigeria",
    topics: ["Venture Capital", "Entrepreneurship", "Talent", "Exits"],
    media_format: "Twitter",
    recommendation_count: 16,
    trust_score: 9.3,
    status: "approved"
  },
  {
    name: "Benjamin Dada",
    bio: "Partner at 4DX Ventures. Sharp analysis on venture capital trends in Africa. Newsletter helps founders understand investor thinking.",
    platform_link: "https://condia.co",
    geography: "Nigeria",
    topics: ["Venture Capital", "Tech Analysis", "Market Dynamics"],
    media_format: "Newsletter",
    recommendation_count: 15,
    trust_score: 9.2,
    status: "approved"
  },
  {
    name: "Joe Kinvi",
    bio: "CEO at Borderless (ex Stripe, Paystack, EY). Building diaspora investment infrastructure. Payments and fintech expertise.",
    platform_link: "https://www.linkedin.com/in/joekinvi",
    geography: "Pan-African",
    topics: ["Fintech", "Payments", "Diaspora Investment"],
    media_format: "LinkedIn",
    recommendation_count: 12,
    trust_score: 9.0,
    status: "approved"
  },
  {
    name: "Peace Itimi",
    bio: "Tech ecosystem voice with sharp insights on African tech and venture. Highly recommended by multiple ecosystem players.",
    platform_link: "https://www.linkedin.com/in/peaceitimi",
    geography: "Nigeria",
    topics: ["Tech Analysis", "Venture Capital", "Ecosystem"],
    media_format: "LinkedIn",
    recommendation_count: 13,
    trust_score: 9.1,
    status: "approved"
  },
  {
    name: "Chinasa T. Okolo",
    bio: "TIME 100 AI, Forbes U30. AI researcher and digital policy specialist. Angel invested in 30+ African & diaspora startups. Tracks African AI startup progress.",
    platform_link: "https://chinasa.substack.com",
    geography: "Pan-African",
    topics: ["AI", "Policy", "Governance", "Angel Investing"],
    media_format: "Newsletter",
    recommendation_count: 14,
    trust_score: 9.2,
    status: "approved"
  },
  {
    name: "Leslie Ossete",
    bio: "Co-founder & COO at Mstudio. Forbes 30u30. Hidden gem writing about Francophone Africa's tech ecosystem with sharp insights and bold analyses.",
    platform_link: "https://africanoperator.substack.com",
    geography: "Francophone Africa",
    topics: ["Francophone Markets", "Startups", "Tech Ecosystem"],
    media_format: "Newsletter",
    recommendation_count: 11,
    trust_score: 8.9,
    status: "approved"
  },
  {
    name: "Osarumen Osamuyi",
    bio: "Partner at Lateral Capital. Investor and advisor to multiple African tech startups. Regular ecosystem commentator.",
    platform_link: "https://www.linkedin.com/in/osaruyi",
    geography: "Nigeria",
    topics: ["Venture Capital", "Strategy", "Market Analysis"],
    media_format: "LinkedIn",
    recommendation_count: 10,
    trust_score: 8.8,
    status: "approved"
  },
  {
    name: "Chidi Afulezi",
    bio: "Active voice in African tech and venture ecosystem. Recommended by multiple operators and investors.",
    platform_link: "https://www.linkedin.com/in/chidiafulezi",
    geography: "Nigeria",
    topics: ["Tech", "Venture", "Entrepreneurship"],
    media_format: "LinkedIn",
    recommendation_count: 9,
    trust_score: 8.7,
    status: "approved"
  },
  {
    name: "Abraham Augustine",
    bio: "Learning how to build a skunkworks for the Internet economy in Africa. Sharp insights on tech building.",
    platform_link: "https://www.linkedin.com/in/abrahamaugustine",
    geography: "Nigeria",
    topics: ["Tech", "Product", "Internet Economy"],
    media_format: "LinkedIn",
    recommendation_count: 11,
    trust_score: 8.9,
    status: "approved"
  },

  // PODCASTS
  {
    name: "African Tech Roundup",
    bio: "Podcast covering African tech ecosystem with Andile Masuku. Regular insights on trends and developments.",
    platform_link: "https://africantechroundup.com",
    geography: "Pan-African",
    topics: ["Tech News", "Interviews", "Ecosystem"],
    media_format: "Podcast",
    recommendation_count: 10,
    trust_score: 8.8,
    status: "approved"
  },
  {
    name: "Tech Tides Africa",
    bio: "Podcast dissecting the African startup ecosystem. Currently finishing Q1 report with deep ecosystem analysis.",
    platform_link: "https://open.spotify.com/show/3iEZEcafBDIB9Ngby74DF6",
    geography: "Pan-African",
    topics: ["Startups", "Ecosystem Analysis", "Trends"],
    media_format: "Podcast",
    recommendation_count: 9,
    trust_score: 8.7,
    status: "approved"
  },
  {
    name: "The Sound of Accra Podcast",
    bio: "Podcast by Adrian Daniels covering Accra's tech and business scene with local insights.",
    platform_link: "https://soundofaccra.com",
    geography: "Ghana",
    topics: ["Local Ecosystem", "Business", "Tech"],
    media_format: "Podcast",
    recommendation_count: 8,
    trust_score: 8.6,
    status: "approved"
  },
  {
    name: "Dream VC Podcast",
    bio: "Real stories from African Venture Capitalists. 100+ folks in the African VC and startup space. Insider stories and lessons.",
    platform_link: "https://www.dream-vc.com/podcast",
    geography: "Pan-African",
    topics: ["Venture Capital", "Interviews", "Stories"],
    media_format: "Podcast",
    recommendation_count: 11,
    trust_score: 8.9,
    status: "approved"
  },

  // SPECIALIZED PUBLICATIONS
  {
    name: "Startup Graveyard",
    bio: "Publication dissecting failed startups in Africa. Learning from startup failures and ecosystem challenges.",
    platform_link: "https://startupgraveyard.africa",
    geography: "Pan-African",
    topics: ["Startup Failures", "Analysis", "Lessons"],
    media_format: "Publication",
    recommendation_count: 8,
    trust_score: 8.6,
    status: "approved"
  },
  {
    name: "Stablekoin",
    bio: "Africa's Stablecoin record. Published every Monday and Thursday from Dar es Salaam, Tanzania. Crypto and stablecoin coverage.",
    platform_link: "https://stablekoin.africa",
    geography: "East Africa",
    topics: ["Crypto", "Stablecoins", "Web3"],
    media_format: "Newsletter",
    recommendation_count: 7,
    trust_score: 8.5,
    status: "approved"
  },
  {
    name: "East Africa Tech Tenders",
    bio: "Weekly ICT procurement intelligence across 9 East African markets. Covers the tenders behind the funding announcements.",
    platform_link: "https://eastafricatechtenders.com",
    geography: "East Africa",
    topics: ["Procurement", "Infrastructure", "Government"],
    media_format: "Newsletter",
    recommendation_count: 6,
    trust_score: 8.4,
    status: "approved"
  },
  {
    name: "Ventures Africa",
    bio: "Pan-African business and technology magazine covering entrepreneurship, innovation, and economic development.",
    platform_link: "https://venturesafrica.com",
    geography: "Pan-African",
    topics: ["Business News", "Entrepreneurship", "Economy"],
    media_format: "Magazine",
    recommendation_count: 7,
    trust_score: 8.5,
    status: "approved"
  },
  {
    name: "African-Startups",
    bio: "Publication tracking African startup ecosystem with news, analysis, and updates.",
    platform_link: "https://african-startups.com",
    geography: "Pan-African",
    topics: ["Startups", "News", "Ecosystem"],
    media_format: "Publication",
    recommendation_count: 6,
    trust_score: 8.4,
    status: "approved"
  },

  // COMMUNITY & ECOSYSTEM BUILDERS
  {
    name: "Nairobi Startup Club",
    bio: "Documenting the vision, hustle, and reality of being a founder or builder in Nairobi. Creating space to be in the room where it's happening.",
    platform_link: "https://www.linkedin.com/company/nairobi-startup-club",
    geography: "Kenya",
    topics: ["Community", "Founders", "Events"],
    media_format: "Community",
    recommendation_count: 10,
    trust_score: 8.8,
    status: "approved"
  },
  {
    name: "The REGISTRY Journal",
    bio: "Documenting the people and brands quietly moving the needle. Emotional architecture behind African innovation.",
    platform_link: "https://www.linkedin.com/company/the-registry-journal",
    geography: "Pan-African",
    topics: ["Storytelling", "Founders", "Culture"],
    media_format: "Publication",
    recommendation_count: 7,
    trust_score: 8.5,
    status: "approved"
  },

  // MORE INDIVIDUAL CREATORS
  {
    name: "Alice Kanjejo",
    bio: "Founder at My Tech Story Africa. Growth & Brand Strategist, Storyteller, Media Producer covering African tech stories.",
    platform_link: "https://www.linkedin.com/in/alicekanjejo",
    geography: "Kenya",
    topics: ["Storytelling", "Startups", "Media"],
    media_format: "LinkedIn",
    recommendation_count: 12,
    trust_score: 9.0,
    status: "approved"
  },
  {
    name: "Mary Agekameh",
    bio: "Writes weekly LinkedIn startup breakdown series focused on African startups, exploring business models, market opportunities, and scaling challenges.",
    platform_link: "https://www.linkedin.com/in/maryagekameh",
    geography: "Pan-African",
    topics: ["Startup Analysis", "Business Models", "Market Opportunities"],
    media_format: "LinkedIn",
    recommendation_count: 11,
    trust_score: 8.9,
    status: "approved"
  },
  {
    name: "Caleb Maru",
    bio: "Founder of Tech Safari. Leading voice on African tech ecosystem with 60,000+ readers.",
    platform_link: "https://www.linkedin.com/in/calebmaru",
    geography: "Kenya",
    topics: ["Tech News", "Business", "Ecosystem"],
    media_format: "Newsletter",
    recommendation_count: 13,
    trust_score: 9.1,
    status: "approved"
  },
  {
    name: "Uwem U.",
    bio: "Active ecosystem voice recommended by multiple operators. Insights on African tech and venture.",
    platform_link: "https://www.linkedin.com/in/uwemu",
    geography: "Nigeria",
    topics: ["Tech", "Venture", "Ecosystem"],
    media_format: "LinkedIn",
    recommendation_count: 8,
    trust_score: 8.6,
    status: "approved"
  },
  {
    name: "Emeka Ajene",
    bio: "Pan-African Business Leader. Building platforms and institutions that drive progress.",
    platform_link: "https://www.linkedin.com/in/emekaajene",
    geography: "Pan-African",
    topics: ["Business", "Infrastructure", "Platforms"],
    media_format: "LinkedIn",
    recommendation_count: 9,
    trust_score: 8.7,
    status: "approved"
  },
  {
    name: "Hubert Allah-Mensah",
    bio: "Founder at Zelos HQ. Documentary Filmmaker & Storyteller documenting Africa's next chapter through film and editorial.",
    platform_link: "https://www.linkedin.com/in/hubertallahmensah",
    geography: "Ghana",
    topics: ["Storytelling", "Media", "Documentary"],
    media_format: "LinkedIn",
    recommendation_count: 10,
    trust_score: 8.8,
    status: "approved"
  },
  {
    name: "Louis Furtwängler",
    bio: "Ventures Platform Fund. Active voice on African venture capital and startup ecosystem.",
    platform_link: "https://www.linkedin.com/in/louisfurtwangler",
    geography: "Nigeria",
    topics: ["Venture Capital", "Startups", "Podcast"],
    media_format: "Podcast",
    recommendation_count: 9,
    trust_score: 8.7,
    status: "approved"
  },
  {
    name: "Jason Mill",
    bio: "Championing South African founders and the companies they're building at The Open Letter.",
    platform_link: "https://www.linkedin.com/in/jasonmill",
    geography: "South Africa",
    topics: ["Startups", "Founders", "Ecosystem"],
    media_format: "Newsletter",
    recommendation_count: 12,
    trust_score: 9.0,
    status: "approved"
  },
  {
    name: "Renier Kriel",
    bio: "Co-founder of The Open Letter. Covering South African startup ecosystem.",
    platform_link: "https://www.linkedin.com/in/renierkriel",
    geography: "South Africa",
    topics: ["Startups", "Journalism", "Ecosystem"],
    media_format: "Newsletter",
    recommendation_count: 10,
    trust_score: 8.8,
    status: "approved"
  },
  {
    name: "Timothy Motte",
    bio: "The Realistic Optimist. Balanced perspectives on African tech and innovation.",
    platform_link: "https://www.linkedin.com/in/timothymotte",
    geography: "Pan-African",
    topics: ["Tech Analysis", "Innovation", "Perspectives"],
    media_format: "LinkedIn",
    recommendation_count: 7,
    trust_score: 8.5,
    status: "approved"
  },
  {
    name: "Fatu Ogwuche",
    bio: "Tech writer with sharp insights on African ecosystem. Recommended for quality content.",
    platform_link: "https://www.linkedin.com/in/fatuogwuche",
    geography: "Nigeria",
    topics: ["Tech Writing", "Analysis", "Ecosystem"],
    media_format: "LinkedIn",
    recommendation_count: 8,
    trust_score: 8.6,
    status: "approved"
  },
  {
    name: "Lemuel Abishua",
    bio: "Powering the next billion hires at VettedAI. Shares insights on African tech and hiring.",
    platform_link: "https://www.linkedin.com/in/lemuelabishua",
    geography: "Pan-African",
    topics: ["Hiring", "AI", "Tech"],
    media_format: "LinkedIn",
    recommendation_count: 6,
    trust_score: 8.4,
    status: "approved"
  },
  {
    name: "Tobi Lafinhan",
    bio: "Active ecosystem contributor sharing insights on African tech.",
    platform_link: "https://www.linkedin.com/in/tobilafinhan",
    geography: "Nigeria",
    topics: ["Tech", "Ecosystem", "Insights"],
    media_format: "LinkedIn",
    recommendation_count: 6,
    trust_score: 8.4,
    status: "approved"
  },
  {
    name: "Adrian Daniels",
    bio: "Host of The Sound of Accra Podcast. B2B Marketing Strategist for African and Diasporan tech leaders.",
    platform_link: "https://www.linkedin.com/in/adriandaniels",
    geography: "Ghana",
    topics: ["Marketing", "B2B", "Podcast"],
    media_format: "Podcast",
    recommendation_count: 8,
    trust_score: 8.6,
    status: "approved"
  },
  {
    name: "Andile Masuku",
    bio: "Host of African Tech Roundup. Regular coverage of African tech ecosystem.",
    platform_link: "https://www.linkedin.com/in/andilemasuku",
    geography: "Pan-African",
    topics: ["Tech News", "Podcast", "Analysis"],
    media_format: "Podcast",
    recommendation_count: 7,
    trust_score: 8.5,
    status: "approved"
  },
  {
    name: "Elijah Shokenu",
    bio: "Writes in Makewaters. Solid insights on African tech and ecosystem.",
    platform_link: "https://makewaters.com",
    geography: "Nigeria",
    topics: ["Tech", "Analysis", "Insights"],
    media_format: "Newsletter",
    recommendation_count: 6,
    trust_score: 8.4,
    status: "approved"
  },
  {
    name: "Harrison Emmett-Lee",
    bio: "Voice in African venture ecosystem with insights on investing and startups.",
    platform_link: "https://www.linkedin.com/in/harrisonemmettlee",
    geography: "Pan-African",
    topics: ["Venture Capital", "Investing", "Startups"],
    media_format: "LinkedIn",
    recommendation_count: 7,
    trust_score: 8.5,
    status: "approved"
  },
  {
    name: "noah banjo",
    bio: "Observing and documenting Africa's importance to the rest of the world. Tech, business, and ecosystem analyst.",
    platform_link: "https://notinnews.substack.com",
    geography: "Pan-African",
    topics: ["Tech Analysis", "Business", "Global Perspective"],
    media_format: "Newsletter",
    recommendation_count: 8,
    trust_score: 8.6,
    status: "approved"
  },
  {
    name: "Yaw Antwi Owusu",
    bio: "Active in Ghana tech ecosystem. Multiple recommendations from ecosystem builders.",
    platform_link: "https://www.linkedin.com/in/yawantwiowusu",
    geography: "Ghana",
    topics: ["Tech", "Ecosystem", "Community"],
    media_format: "LinkedIn",
    recommendation_count: 7,
    trust_score: 8.5,
    status: "approved"
  },
  {
    name: "Blessing Abeng",
    bio: "Active voice in African tech ecosystem with insights on building and scaling.",
    platform_link: "https://www.linkedin.com/in/blessingabeng",
    geography: "Nigeria",
    topics: ["Tech", "Startups", "Scaling"],
    media_format: "LinkedIn",
    recommendation_count: 6,
    trust_score: 8.4,
    status: "approved"
  },
  {
    name: "Jacques Burger",
    bio: "At Octoco. Practical, strong tech, no nonsense approach to African tech ecosystem.",
    platform_link: "https://www.linkedin.com/in/jacquesburger",
    geography: "South Africa",
    topics: ["Tech", "Practical", "Engineering"],
    media_format: "LinkedIn",
    recommendation_count: 6,
    trust_score: 8.4,
    status: "approved"
  },
  {
    name: "Nonnie Wanjihia Burbidge",
    bio: "At Enza Capital. Writes about African venture from the inside, not the outside. Sharp, specific, no performative optimism.",
    platform_link: "https://www.linkedin.com/in/nonniewanjihia",
    geography: "Kenya",
    topics: ["Venture Capital", "Inside Perspective", "Analysis"],
    media_format: "LinkedIn",
    recommendation_count: 9,
    trust_score: 8.7,
    status: "approved"
  },
  {
    name: "Joseph Kibur",
    bio: "Provides snapshots on current debates and analysis of Africa x tech.",
    platform_link: "https://www.linkedin.com/in/josephkibur",
    geography: "Pan-African",
    topics: ["Tech Debates", "Analysis", "Current Affairs"],
    media_format: "LinkedIn",
    recommendation_count: 6,
    trust_score: 8.4,
    status: "approved"
  },
  {
    name: "Florent Nduwayezu",
    bio: "Sharp analysis on African tech ecosystem and current debates.",
    platform_link: "https://www.linkedin.com/in/florentnduwayezu",
    geography: "Rwanda",
    topics: ["Tech Analysis", "Ecosystem", "Debates"],
    media_format: "LinkedIn",
    recommendation_count: 6,
    trust_score: 8.4,
    status: "approved"
  },

  // SPECIALIZED VOICES
  {
    name: "Tech Labari",
    bio: "African tech publication with insights covering the ecosystem. The Labari Journal provides deep coverage.",
    platform_link: "https://insights.techlabari.com",
    geography: "Pan-African",
    topics: ["Tech News", "Analysis", "Media"],
    media_format: "Publication",
    recommendation_count: 8,
    trust_score: 8.6,
    status: "approved"
  },
  {
    name: "Kweku Tech",
    bio: "Covering Ghanaian and West African tech ecosystem with regular updates.",
    platform_link: "https://www.linkedin.com/company/kweku-tech",
    geography: "Ghana",
    topics: ["Tech News", "West Africa", "Ecosystem"],
    media_format: "Publication",
    recommendation_count: 7,
    trust_score: 8.5,
    status: "approved"
  },
  {
    name: "Art C.",
    bio: "Substack writer with on-point analysis of African tech. Double-tapped recommendation.",
    platform_link: "https://www.linkedin.com/in/artc",
    geography: "Pan-African",
    topics: ["Tech Analysis", "Insights", "Commentary"],
    media_format: "Newsletter",
    recommendation_count: 9,
    trust_score: 8.7,
    status: "approved"
  },
  {
    name: "Christine Namara",
    bio: "Solving African innovative early-stage founder problems through capital and support. Kundi Show newsletter - messy but relevant.",
    platform_link: "https://kundishow-newsletter.beehiiv.com",
    geography: "Pan-African",
    topics: ["Early-Stage", "Capital", "Founder Support"],
    media_format: "Newsletter",
    recommendation_count: 10,
    trust_score: 8.8,
    status: "approved"
  },
  {
    name: "Will Green",
    bio: "Venture Builder, Growth + M&A Expert. Host of WGW (Will's Green Walks) and Curator of Origin Stories. Ecosystems Super Connector.",
    platform_link: "https://www.linkedin.com/in/willgreen",
    geography: "South Africa",
    topics: ["Venture Building", "M&A", "Ecosystem"],
    media_format: "Podcast",
    recommendation_count: 8,
    trust_score: 8.6,
    status: "approved"
  },
  {
    name: "Stella Njogo",
    bio: "Strategic Advisor on digital prosperity in Africa. Writes on social and economic signals emerging from digital Africa and their influence on the digital economy.",
    platform_link: "https://www.linkedin.com/in/stellanjogo",
    geography: "Pan-African",
    topics: ["Digital Economy", "Policy", "Economic Signals"],
    media_format: "LinkedIn",
    recommendation_count: 9,
    trust_score: 8.7,
    status: "approved"
  },
  {
    name: "Dayo Keshi",
    bio: "Fintech journalist and analyst. Writes about payments, banking, and digital finance across Africa.",
    platform_link: "https://www.linkedin.com/in/dayokeshi",
    geography: "Nigeria",
    topics: ["Fintech", "Journalism", "Payments"],
    media_format: "Newsletter",
    recommendation_count: 7,
    trust_score: 8.5,
    status: "approved"
  },
  {
    name: "Jad Jubaili",
    bio: "At TechCabal Insights. Covering African tech ecosystem with data-driven analysis.",
    platform_link: "https://www.linkedin.com/in/jadjubaili",
    geography: "Pan-African",
    topics: ["Tech Analysis", "Data", "Insights"],
    media_format: "Publication",
    recommendation_count: 6,
    trust_score: 8.4,
    status: "approved"
  },

  // EMERGING VOICES
  {
    name: "Abayomi Semudara",
    bio: "Sharing thoughts and opinions about Tech and Startups. Emerging voice in African tech commentary.",
    platform_link: "https://www.linkedin.com/in/abayomisemudara",
    geography: "Nigeria",
    topics: ["Tech", "Startups", "Commentary"],
    media_format: "LinkedIn",
    recommendation_count: 5,
    trust_score: 8.3,
    status: "approved"
  },
  {
    name: "Ajiri Omafokpe",
    bio: "Investor at Included VC Africa. Co-founder of Builders Tribe. At intersection of Venture Capital in GCC and Africa.",
    platform_link: "https://www.linkedin.com/in/ajirio",
    geography: "Pan-African",
    topics: ["Venture Capital", "GCC-Africa", "Community"],
    media_format: "LinkedIn",
    recommendation_count: 6,
    trust_score: 8.4,
    status: "approved"
  },
  {
    name: "Akosua Osei",
    bio: "Web3 Business Development & Ecosystem Growth. GTM in Emerging Markets. Youth Development advocate.",
    platform_link: "https://www.linkedin.com/in/akosuaosei",
    geography: "Ghana",
    topics: ["Web3", "Business Development", "Youth"],
    media_format: "LinkedIn",
    recommendation_count: 6,
    trust_score: 8.4,
    status: "approved"
  },
  {
    name: "Jasiel Martin-Odoom",
    bio: "Startup Definition Sunday newsletter. Regular coverage of African startup ecosystem.",
    platform_link: "https://sds.beehiiv.com",
    geography: "Ghana",
    topics: ["Startups", "Definitions", "Ecosystem"],
    media_format: "Newsletter",
    recommendation_count: 5,
    trust_score: 8.3,
    status: "approved"
  },
  {
    name: "Gideon Banks",
    bio: "Managing Partner at Brif Africa. Active in ecosystem building and investment.",
    platform_link: "https://www.linkedin.com/in/gideonbanks",
    geography: "Pan-African",
    topics: ["Investment", "Ecosystem", "Media"],
    media_format: "LinkedIn",
    recommendation_count: 5,
    trust_score: 8.3,
    status: "approved"
  },
  {
    name: "Mohamed Refai",
    bio: "Fantastic job covering Egypt tech ecosystem. Deep local market knowledge.",
    platform_link: "https://www.linkedin.com/in/mohamedrefai",
    geography: "Egypt",
    topics: ["Egypt Tech", "Startups", "Local Market"],
    media_format: "LinkedIn",
    recommendation_count: 5,
    trust_score: 8.3,
    status: "approved"
  },
  {
    name: "Paschal Okeke",
    bio: "The expert for payments, stablecoins and fintech in Africa. Deep technical knowledge.",
    platform_link: "https://www.linkedin.com/in/paschalokeke",
    geography: "Nigeria",
    topics: ["Payments", "Stablecoins", "Fintech"],
    media_format: "LinkedIn",
    recommendation_count: 6,
    trust_score: 8.4,
    status: "approved"
  },
  {
    name: "Promise Tomiwa Ayandele",
    bio: "Product Designer & PM. AI SaaS Founder building for African Fintech and Creative Economy.",
    platform_link: "https://www.linkedin.com/in/promisetomiwa",
    geography: "Nigeria",
    topics: ["Product", "AI", "Fintech"],
    media_format: "LinkedIn",
    recommendation_count: 5,
    trust_score: 8.3,
    status: "approved"
  },
  {
    name: "Olumuyiwa Olowogboyega",
    bio: "Voice in fintech, digital assets, and payments systems in Africa.",
    platform_link: "https://www.linkedin.com/in/olumuyiwaolowogboyega",
    geography: "Nigeria",
    topics: ["Fintech", "Digital Assets", "Payments"],
    media_format: "LinkedIn",
    recommendation_count: 5,
    trust_score: 8.3,
    status: "approved"
  },

  // SPECIALIZED COVERAGE
  {
    name: "Briter",
    bio: "African venture data and intelligence platform. Market insights and research.",
    platform_link: "https://briter.africa",
    geography: "Pan-African",
    topics: ["Data", "Market Intelligence", "Research"],
    media_format: "Platform",
    recommendation_count: 7,
    trust_score: 8.5,
    status: "approved"
  },
  {
    name: "Shega Media",
    bio: "Ethiopian tech and startup coverage. Local market insights.",
    platform_link: "https://shega.co",
    geography: "Ethiopia",
    topics: ["Ethiopia Tech", "Startups", "Local News"],
    media_format: "Publication",
    recommendation_count: 5,
    trust_score: 8.3,
    status: "approved"
  },
  {
    name: "Techtrends Zambia",
    bio: "Zambian tech ecosystem coverage and insights.",
    platform_link: "https://www.linkedin.com/company/techtrends-zambia",
    geography: "Zambia",
    topics: ["Zambia Tech", "Ecosystem", "News"],
    media_format: "Publication",
    recommendation_count: 5,
    trust_score: 8.3,
    status: "approved"
  },
  {
    name: "Ghana Innovation Journal",
    bio: "Covering Ghana's innovation and startup ecosystem.",
    platform_link: "https://www.linkedin.com/company/ghana-innovation-journal",
    geography: "Ghana",
    topics: ["Innovation", "Startups", "Ghana"],
    media_format: "Publication",
    recommendation_count: 5,
    trust_score: 8.3,
    status: "approved"
  },
  {
    name: "Kenya Tech Events",
    bio: "Tracking and promoting tech events across Kenya's ecosystem.",
    platform_link: "https://www.linkedin.com/company/kenya-tech-events",
    geography: "Kenya",
    topics: ["Events", "Community", "Networking"],
    media_format: "Community",
    recommendation_count: 5,
    trust_score: 8.3,
    status: "approved"
  },
  {
    name: "Technext",
    bio: "Nigerian tech publication covering startups and innovation.",
    platform_link: "https://technext.ng",
    geography: "Nigeria",
    topics: ["Tech News", "Startups", "Innovation"],
    media_format: "Publication",
    recommendation_count: 5,
    trust_score: 8.3,
    status: "approved"
  },
  {
    name: "Atoms & Bits",
    bio: "Newsletter covering African tech and startup ecosystem.",
    platform_link: "https://atomsandbits.substack.com",
    geography: "Pan-African",
    topics: ["Tech", "Startups", "Analysis"],
    media_format: "Newsletter",
    recommendation_count: 5,
    trust_score: 8.3,
    status: "approved"
  },
  {
    name: "African Hive",
    bio: "Operations strategist Rhoda Kingori's platform covering African tech ecosystem.",
    platform_link: "https://www.linkedin.com/company/african-hive",
    geography: "Pan-African",
    topics: ["Operations", "Ecosystem", "Strategy"],
    media_format: "Publication",
    recommendation_count: 5,
    trust_score: 8.3,
    status: "approved"
  },

  // VENTURE FIRMS & ORGANIZATIONS
  {
    name: "Ventures Platform Fund",
    bio: "Early-stage investor backing Nigeria's top tech founders. Active ecosystem voice.",
    platform_link: "https://venturesplatform.com",
    geography: "Nigeria",
    topics: ["Venture Capital", "Early-Stage", "Nigeria"],
    media_format: "Organization",
    recommendation_count: 8,
    trust_score: 8.6,
    status: "approved"
  },
  {
    name: "Afropolitan",
    bio: "Building the digital nation for Africans. Community and ecosystem initiative.",
    platform_link: "https://afropolitan.io",
    geography: "Pan-African",
    topics: ["Community", "Digital Nation", "Innovation"],
    media_format: "Organization",
    recommendation_count: 7,
    trust_score: 8.5,
    status: "approved"
  },
  {
    name: "The Startup Evangelist",
    bio: "Platform promoting African startups and entrepreneurship.",
    platform_link: "https://www.linkedin.com/company/the-startup-evangelist",
    geography: "Pan-African",
    topics: ["Startups", "Evangelism", "Promotion"],
    media_format: "Organization",
    recommendation_count: 6,
    trust_score: 8.4,
    status: "approved"
  },
  {
    name: "The Baobab Network",
    bio: "Accelerator and early-stage fund backing Africa's most ambitious tech founders with capital, community, and connections.",
    platform_link: "https://www.thebaobabnetwork.com",
    geography: "Pan-African",
    topics: ["Acceleration", "Early-Stage", "Fundraising"],
    media_format: "Organization",
    recommendation_count: 8,
    trust_score: 8.6,
    status: "approved"
  },

  // CRYPTO & WEB3
  {
    name: "Crypto Street",
    bio: "ZOEY OLA documenting real crypto adoption across Africa through street interviews. 500+ conversations.",
    platform_link: "https://www.linkedin.com/in/zoeyola",
    geography: "Pan-African",
    topics: ["Crypto", "Web3", "Adoption"],
    media_format: "Content",
    recommendation_count: 5,
    trust_score: 8.3,
    status: "approved"
  },

  // ADDITIONAL VOICES
  {
    name: "Phyian Karinge",
    bio: "Top 40 women under 40 Kenya. Senior Product Manager and Founder of YoungTechiez. WomenTech Global Award Winner.",
    platform_link: "https://www.linkedin.com/in/phyiankaringe",
    geography: "Kenya",
    topics: ["Product", "Youth", "Women in Tech"],
    media_format: "LinkedIn",
    recommendation_count: 6,
    trust_score: 8.4,
    status: "approved"
  },
  {
    name: "Belinda Nkechi Idinmachi",
    bio: "Growth Product Manager at ALX Africa. Expert in CAC, LTV, and User Retention. Scaling EdTech Programs.",
    platform_link: "https://www.linkedin.com/in/belindaidinmachi",
    geography: "Pan-African",
    topics: ["Product", "EdTech", "Growth"],
    media_format: "LinkedIn",
    recommendation_count: 5,
    trust_score: 8.3,
    status: "approved"
  },
  {
    name: "Faustine Ngila",
    bio: "4IR expert and gem in the African tech ecosystem.",
    platform_link: "https://www.linkedin.com/in/faustinengila",
    geography: "Kenya",
    topics: ["4IR", "Technology", "Innovation"],
    media_format: "LinkedIn",
    recommendation_count: 5,
    trust_score: 8.3,
    status: "approved"
  },
  {
    name: "Quadri Akande",
    bio: "Founder at Kloza. Turning informal African cross-border trade into structured and trusted work.",
    platform_link: "https://www.linkedin.com/in/quadriakande",
    geography: "Nigeria",
    topics: ["Trade", "Fintech", "Infrastructure"],
    media_format: "LinkedIn",
    recommendation_count: 6,
    trust_score: 8.4,
    status: "approved"
  },
  {
    name: "Francis Darpoh",
    bio: "Active in West African tech ecosystem with ecosystem insights.",
    platform_link: "https://www.linkedin.com/in/francisdarpoh",
    geography: "Ghana",
    topics: ["Ecosystem", "Tech", "West Africa"],
    media_format: "LinkedIn",
    recommendation_count: 5,
    trust_score: 8.3,
    status: "approved"
  },
  {
    name: "Abdulkarim Mohamed",
    bio: "Active voice in African tech ecosystem. Multiple recommendations.",
    platform_link: "https://www.linkedin.com/in/abdulkarimmohamed",
    geography: "Pan-African",
    topics: ["Tech", "Ecosystem", "Commentary"],
    media_format: "LinkedIn",
    recommendation_count: 6,
    trust_score: 8.4,
    status: "approved"
  },
  {
    name: "Wanjiku Kimani",
    bio: "Writer covering African tech with sharp insights on Substack.",
    platform_link: "https://wanjiku.substack.com",
    geography: "Kenya",
    topics: ["Writing", "Tech", "Analysis"],
    media_format: "Newsletter",
    recommendation_count: 5,
    trust_score: 8.3,
    status: "approved"
  },
  {
    name: "Dare O.",
    bio: "Increasingly not-so-quiet builder and innovator in learning/employability Tech. AWS devops foundation success.",
    platform_link: "https://www.linkedin.com/in/dareo",
    geography: "Nigeria",
    topics: ["EdTech", "DevOps", "Learning"],
    media_format: "LinkedIn",
    recommendation_count: 5,
    trust_score: 8.3,
    status: "approved"
  },
  {
    name: "Makir Volcy",
    bio: "Crypto compliance and blockchain investigations expert covering African markets.",
    platform_link: "https://www.linkedin.com/in/makirvolcy",
    geography: "Pan-African",
    topics: ["Crypto", "Compliance", "Blockchain"],
    media_format: "LinkedIn",
    recommendation_count: 4,
    trust_score: 8.2,
    status: "approved"
  },
  {
    name: "Erik Hersman",
    bio: "Pioneer in African tech ecosystem. Conservation and sustainable development.",
    platform_link: "https://www.linkedin.com/in/erikhersman",
    geography: "Kenya",
    topics: ["Tech Pioneer", "Innovation", "Conservation"],
    media_format: "LinkedIn",
    recommendation_count: 6,
    trust_score: 8.4,
    status: "approved"
  },
  {
    name: "Oyinkansola Oni",
    bio: "AI Strategy & GTM Leader. Driving business impact at scale through Hayes.",
    platform_link: "https://www.linkedin.com/in/oyinkansolaoni",
    geography: "Nigeria",
    topics: ["AI", "Strategy", "GTM"],
    media_format: "LinkedIn",
    recommendation_count: 5,
    trust_score: 8.3,
    status: "approved"
  },
  {
    name: "Zimasa Vabaza",
    bio: "Active voice in South African tech ecosystem.",
    platform_link: "https://www.linkedin.com/in/zimasavabaza",
    geography: "South Africa",
    topics: ["Tech", "Ecosystem", "Commentary"],
    media_format: "LinkedIn",
    recommendation_count: 4,
    trust_score: 8.2,
    status: "approved"
  },
  {
    name: "Angela Koki",
    bio: "Multiple recommendations from ecosystem players. Active voice in African tech.",
    platform_link: "https://www.linkedin.com/in/angelakoki",
    geography: "Pan-African",
    topics: ["Tech", "Ecosystem", "Insights"],
    media_format: "LinkedIn",
    recommendation_count: 7,
    trust_score: 8.5,
    status: "approved"
  }
]

async function seedRealData() {
  console.log('🌱 Starting to seed REAL LinkedIn data...')
  console.log(`📊 Total profiles to insert: ${realProfiles.length}`)
  
  try {
    // Insert profiles in batches of 50 (Supabase limit)
    const batchSize = 50
    let successCount = 0
    
    for (let i = 0; i < realProfiles.length; i += batchSize) {
      const batch = realProfiles.slice(i, i + batchSize)
      
      const { data, error } = await supabase
        .from('profiles')
        .insert(batch)
        .select()

      if (error) {
        console.error(`❌ Error inserting batch ${i / batchSize + 1}:`, error)
        continue
      }

      successCount += data.length
      console.log(`✅ Batch ${i / batchSize + 1} inserted: ${data.length} profiles`)
    }

    console.log(`\n🎉 SUCCESS! Inserted ${successCount} out of ${realProfiles.length} profiles!`)
    console.log('\n📋 Top 10 profiles by trust score:')
    
    const sortedProfiles = realProfiles
      .sort((a, b) => b.trust_score - a.trust_score)
      .slice(0, 10)
    
    sortedProfiles.forEach((p, idx) => {
      console.log(`  ${idx + 1}. ${p.name} (${p.trust_score}) - ${p.geography}`)
    })
    
    console.log('\n📊 Statistics:')
    const geographies = new Set(realProfiles.map(p => p.geography))
    const formats = new Set(realProfiles.map(p => p.media_format))
    console.log(`  • Regions: ${geographies.size}`)
    console.log(`  • Formats: ${formats.size}`)
    console.log(`  • Average Trust Score: ${(realProfiles.reduce((sum, p) => sum + p.trust_score, 0) / realProfiles.length).toFixed(2)}`)
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

// Run it!
seedRealData()