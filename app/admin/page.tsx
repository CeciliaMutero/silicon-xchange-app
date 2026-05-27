'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getCurrentUser, getUserProfile } from '@/lib/auth'
import { CheckCircle, XCircle, Edit, Trash2, ArrowLeft, TrendingUp, Users, MessageSquare } from 'lucide-react'

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
}

interface Recommendation {
  id: string
  profile_id: string
  user_name: string
  user_title: string
  rationale: string
  created_at: string
  profiles: { name: string }
}

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [pendingProfiles, setPendingProfiles] = useState<Profile[]>([])
  const [allProfiles, setAllProfiles] = useState<Profile[]>([])
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'recommendations'>('pending')

  useEffect(() => {
    checkAdminAccess()
  }, [])

  async function checkAdminAccess() {
    try {
      const user = await getCurrentUser()
      
      if (!user) {
        router.push('/')
        return
      }

      const profile = await getUserProfile(user.id)
      
      if (!profile.is_admin) {
        window.alert('Access denied. Admin privileges required.')
        router.push('/')
        return
      }

      setIsAdmin(true)
      await fetchData()
    } catch (error) {
      console.error('Error checking admin access:', error)
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  async function fetchData() {
    try {
      console.log('🔍 Admin: Fetching pending profiles...')
      
      // Fetch pending profiles
      const { data: pending, error: pendingError } = await supabase
        .from('profiles')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      console.log('📊 Pending profiles found:', pending?.length)
      console.log('Pending data:', pending)

      if (pendingError) {
        console.error('❌ Pending error:', pendingError)
        throw pendingError
      }
      
      setPendingProfiles(pending || [])

      // Fetch all approved profiles
      const { data: approved, error: approvedError } = await supabase
        .from('profiles')
        .select('*')
        .eq('status', 'approved')
        .order('trust_score', { ascending: false })

      console.log('📊 Approved profiles found:', approved?.length)

      if (approvedError) throw approvedError
      setAllProfiles(approved || [])

      // Fetch all recommendations with profile names
      const { data: recs, error: recsError } = await supabase
        .from('recommendations')
        .select(`
          *,
          profiles (name)
        `)
        .order('created_at', { ascending: false })
        .limit(50)

      console.log('📊 Recommendations found:', recs?.length)

      if (recsError) throw recsError
      setRecommendations(recs || [])
    } catch (error) {
      console.error('❌ Error fetching admin data:', error)
    }
  }
  async function approveProfile(profileId: string) {
    try {
      console.log('🔍 Starting approval for:', profileId)
      
      // Update status
      const { data, error } = await supabase
        .from('profiles')
        .update({ status: 'approved' })
        .eq('id', profileId)
        .select()

      if (error) {
        console.error('❌ Supabase error:', error)
        throw error
      }
      
      console.log('✅ Database response:', data)
      
      if (!data || data.length === 0) {
        throw new Error('No profile was updated')
      }
      
      // Remove from local state immediately
      setPendingProfiles(prev => prev.filter(p => p.id !== profileId))
      
      // Also refresh from database
      setTimeout(() => {
        fetchData()
      }, 500)
      
      alert('✅ Profile approved successfully!')
    } catch (error: any) {
      console.error('❌ Full error:', error)
      alert(`Failed to approve: ${error.message}`)
    }
  }

  async function rejectProfile(profileId: string) {
    if (!confirm('Are you sure you want to reject this profile?')) return

    try {
      console.log('🔍 Starting rejection for:', profileId)
      
      // Update status
      const { data, error } = await supabase
        .from('profiles')
        .update({ status: 'rejected' })
        .eq('id', profileId)
        .select()

      if (error) {
        console.error('❌ Supabase error:', error)
        throw error
      }
      
      console.log('✅ Database response:', data)
      
      if (!data || data.length === 0) {
        throw new Error('No profile was updated')
      }
      
      // Remove from local state immediately
      setPendingProfiles(prev => prev.filter(p => p.id !== profileId))
      
      // Also refresh from database
      setTimeout(() => {
        fetchData()
      }, 500)
      
      alert('✅ Profile rejected')
    } catch (error: any) {
      console.error('❌ Full error:', error)
      alert(`Failed to reject: ${error.message}`)
    }
  }
  async function deleteProfile(profileId: string) {
    if (!confirm('Are you sure you want to DELETE this profile permanently? This cannot be undone.')) return

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', profileId)

      if (error) throw error
      
      await fetchData()
      alert('Profile deleted')
    } catch (error) {
      console.error('Error deleting profile:', error)
      alert('Failed to delete profile')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Loading admin panel...</div>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Manage creators, profiles, and recommendations</p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Approval</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">{pendingProfiles.length}</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved Creators</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{allProfiles.length}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Recommendations</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{recommendations.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Manual Refresh Button */}
        <div className="mb-6">
          <button
            onClick={async () => {
              console.log('🔄 Manual refresh triggered...')
              await fetchData()
              console.log('✅ Refresh complete!')
              console.log('Pending:', pendingProfiles.length)
              console.log('Approved:', allProfiles.length)
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            🔄 Refresh Data
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pending'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pending Approval ({pendingProfiles.length})
              </button>
              <button
                onClick={() => setActiveTab('approved')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'approved'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Approved Creators ({allProfiles.length})
              </button>
              <button
                onClick={() => setActiveTab('recommendations')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'recommendations'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Recent Recommendations ({recommendations.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Pending Profiles Tab */}
        {activeTab === 'pending' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-900">
                Debug: Found {pendingProfiles.length} pending profile(s)
              </p>
            </div>

            {pendingProfiles.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg font-medium">No pending profiles</p>
                <p className="text-gray-500 text-sm mt-2">All profiles have been reviewed!</p>
                <button
                  onClick={() => {
                    console.log('🔍 Manually refreshing pending profiles...')
                    fetchData()
                  }}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Refresh
                </button>
              </div>
            ) : (
     
              pendingProfiles.map((profile) => (
                <div key={profile.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{profile.name}</h3>
                      <p className="text-gray-600 mt-2">{profile.bio}</p>
                      {profile.platform_link && (
                        <a
                          href={profile.platform_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
                        >
                          {profile.platform_link}
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {profile.geography && (
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                        📍 {profile.geography}
                      </span>
                    )}
                    {profile.media_format && (
                      <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                        🎙️ {profile.media_format}
                      </span>
                    )}
                    {profile.topics?.map((topic) => (
                      <span key={topic} className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">
                        {topic}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => approveProfile(profile.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => rejectProfile(profile.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Approved Profiles Tab */}
        {activeTab === 'approved' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Creator
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Geography
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Format
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trust Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recommendations
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allProfiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{profile.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{profile.geography}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{profile.media_format}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-semibold text-blue-600">
                          {profile.trust_score.toFixed(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{profile.recommendation_count}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => deleteProfile(profile.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div key={rec.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {rec.user_name?.charAt(0) || '?'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{rec.user_name}</span>
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                        {rec.user_title}
                      </span>
                      <span className="text-gray-400">→</span>
                      <span className="font-medium text-gray-900">{rec.profiles?.name}</span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">"{rec.rationale}"</p>
                    <p className="text-xs text-gray-500">
                      {new Date(rec.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}