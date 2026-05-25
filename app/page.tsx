'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { getCurrentUser, getUserProfile, signOut } from '@/lib/auth'
import { Search, Globe, Tag, Radio, MessageSquare, TrendingUp, LogIn, LogOut, ThumbsUp, Shield } from 'lucide-react'
import AuthModal from '@/components/AuthModal'
import RecommendModal from '@/components/RecommendModal'

interface Profile {
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

interface Recommendation {
  id: string
  profile_id: string
  user_id: string
  user_name: string | null
  user_title: string | null
  rationale: string
  created_at: string
}

interface UserProfile {
  id: string
  full_name: string
  professional_role: string
}

export default function Home() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [recommendations, setRecommendations] = useState<Record<string, Recommendation[]>>({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGeography, setSelectedGeography] = useState<string>('all')
  const [selectedTopic, setSelectedTopic] = useState<string>('all')
  const [selectedFormat, setSelectedFormat] = useState<string>('all')
  const [expandedProfile, setExpandedProfile] = useState<string | null>(null)
  
  // Auth state
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showRecommendModal, setShowRecommendModal] = useState(false)
  const [selectedProfileForRec, setSelectedProfileForRec] = useState<Profile | null>(null)

  useEffect(() => {
    checkUser()
    fetchData()
  }, [])

  async function checkUser() {
    const currentUser = await getCurrentUser()
    setUser(currentUser)
    
    if (currentUser) {
      try {
        const profile = await getUserProfile(currentUser.id)
        setUserProfile(profile)
      } catch (error) {
        console.error('Error fetching user profile:', error)
      }
    }
  }

  async function fetchData() {
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('status', 'approved')
        .order('trust_score', { ascending: false })

      if (profilesError) throw profilesError

      const { data: recsData, error: recsError } = await supabase
        .from('recommendations')
        .select('*')
        .order('created_at', { ascending: false })

      if (recsError) throw recsError

      const recsMap: Record<string, Recommendation[]> = {}
      recsData?.forEach(rec => {
        if (!recsMap[rec.profile_id]) {
          recsMap[rec.profile_id] = []
        }
        recsMap[rec.profile_id].push(rec)
      })

      setProfiles(profilesData || [])
      setRecommendations(recsMap)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSignOut() {
    await signOut()
    setUser(null)
    setUserProfile(null)
  }

  function openRecommendModal(profile: Profile) {
    if (!user) {
      setShowAuthModal(true)
      return
    }
    setSelectedProfileForRec(profile)
    setShowRecommendModal(true)
  }

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.bio?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesGeography = selectedGeography === 'all' || 
      profile.geography?.toLowerCase().includes(selectedGeography.toLowerCase())
    
    const matchesTopic = selectedTopic === 'all' || 
      profile.topics?.some(t => t.toLowerCase().includes(selectedTopic.toLowerCase()))
    
    const matchesFormat = selectedFormat === 'all' || 
      profile.media_format?.toLowerCase() === selectedFormat.toLowerCase()

    return matchesSearch && matchesGeography && matchesTopic && matchesFormat
  })

  const geographies = Array.from(new Set(profiles.map(p => p.geography).filter(Boolean)))
  const topics = Array.from(new Set(profiles.flatMap(p => p.topics || [])))
  const formats = Array.from(new Set(profiles.map(p => p.media_format).filter(Boolean)))

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Loading creators...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Silicon Xchange</h1>
              <p className="text-sm text-gray-600 mt-1">Discover credible voices in Africa tech & venture</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{profiles.length}</div>
                <div className="text-xs text-gray-500">Verified Creators</div>
              </div>
              
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{userProfile?.full_name}</div>
                    <div className="text-xs text-gray-500">{userProfile?.professional_role}</div>
                    {userProfile?.is_admin && (
                      <div className="text-xs text-purple-600 font-semibold">Admin</div>
                    )}
                  </div>
                  
                  {userProfile?.is_admin && (
                    <button
                      onClick={() => window.location.href = '/admin'}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      <Shield className="h-4 w-4" />
                      Admin
                    </button>
                  )}
                  
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search creators, topics, or keywords..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="inline h-4 w-4 mr-1" />
                Geography
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                value={selectedGeography}
                onChange={(e) => setSelectedGeography(e.target.value)}
              >
                <option value="all">All Regions</option>
                {geographies.map(geo => (
                  <option key={geo} value={geo}>{geo}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="inline h-4 w-4 mr-1" />
                Topic
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
              >
                <option value="all">All Topics</option>
                {topics.map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Radio className="inline h-4 w-4 mr-1" />
                Format
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
              >
                <option value="all">All Formats</option>
                {formats.map(format => (
                  <option key={format} value={format}>{format}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Showing <span className="font-semibold">{filteredProfiles.length}</span> of <span className="font-semibold">{profiles.length}</span> creators
            </span>
            <span className="text-gray-500">Sorted by Trust Score</span>
          </div>
        </div>

        <div className="space-y-4">
          {filteredProfiles.map((profile, index) => {
            const profileRecs = recommendations[profile.id] || []
            const isExpanded = expandedProfile === profile.id
            
            return (
              <div 
                key={profile.id} 
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-gray-400 font-medium">#{index + 1}</span>
                        <h3 className="text-xl font-bold text-gray-900">{profile.name}</h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
                    </div>
                    
                    <div className="text-right ml-4">
                      <div className="flex items-center justify-end gap-2 mb-1">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        <span className="text-2xl font-bold text-blue-600">
                          {profile.trust_score.toFixed(1)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">Trust Score</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {profile.recommendation_count} recommendations
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {profile.geography && (
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200">
                        📍 {profile.geography}
                      </span>
                    )}
                    {profile.media_format && (
                      <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
                        🎙️ {profile.media_format}
                      </span>
                    )}
                    {profile.topics?.map((topic) => (
                      <span 
                        key={topic} 
                        className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full border border-purple-200"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4">
                    {profile.platform_link && (
                      <a
                        href={profile.platform_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
                      >
                        Visit Profile →
                      </a>
                    )}
                    
                    <button
                      onClick={() => openRecommendModal(profile)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm font-medium transition-colors"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      Recommend
                    </button>
                    
                    {profileRecs.length > 0 && (
                      <button
                        onClick={() => setExpandedProfile(isExpanded ? null : profile.id)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium"
                      >
                        <MessageSquare className="h-4 w-4" />
                        {isExpanded ? 'Hide' : 'Show'} {profileRecs.length} recommendation{profileRecs.length > 1 ? 's' : ''}
                      </button>
                    )}
                  </div>
                </div>

                {isExpanded && profileRecs.length > 0 && (
                  <div className="border-t border-gray-100 bg-gray-50 p-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                      Why people recommend {profile.name}:
                    </h4>
                    <div className="space-y-3">
                      {profileRecs.map((rec) => (
                        <div key={rec.id} className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-semibold text-sm">
                                {rec.user_name?.charAt(0) || '?'}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-gray-900">{rec.user_name}</span>
                                {rec.user_title && (
                                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                                    {rec.user_title}
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-700 text-sm leading-relaxed">"{rec.rationale}"</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {filteredProfiles.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-3">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <div className="text-gray-600 text-lg font-medium">No creators found</div>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-gray-200 mt-16 py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>Silicon Xchange • Connecting Silicon Valley and African Tech Ecosystems</p>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false)
          checkUser()
        }}
      />

      {selectedProfileForRec && userProfile && (
        <RecommendModal
          isOpen={showRecommendModal}
          onClose={() => {
            setShowRecommendModal(false)
            setSelectedProfileForRec(null)
          }}
          profileId={selectedProfileForRec.id}
          profileName={selectedProfileForRec.name}
          userId={user.id}
          userName={userProfile.full_name}
          userRole={userProfile.professional_role}
          onSuccess={() => {
            fetchData()
            checkUser()
          }}
        />
      )}
    </div>
  )
}