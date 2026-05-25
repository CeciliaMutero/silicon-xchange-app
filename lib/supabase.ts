import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Profile {
  id: string
  name: string
  bio: string | null
  platform_link: string | null
  geography: string | null
  topics: string[] | null
  media_format: string | null
  recommendation_count: number
  trust_score: number
  status: string
  created_at: string
  updated_at: string
}

export interface Recommendation {
  id: string
  profile_id: string
  user_id: string
  user_name: string | null
  user_title: string | null
  rationale: string
  created_at: string
}

export interface UserProfile {
  id: string
  full_name: string
  professional_role: string
  is_admin: boolean
  created_at: string
}