// @ts-nocheck
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getCurrentUser, getUserProfile } from '@/lib/auth'
import {
  CheckCircle, XCircle, Trash2, ArrowLeft,
  TrendingUp, Users, MessageSquare, RefreshCw, X
} from 'lucide-react'

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

interface Toast {
  message: string
  type: 'success' | 'error'
}

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [pendingProfiles, setPendingProfiles] = useState<Profile[]>([])
  const [allProfiles, setAllProfiles] = useState<Profile[]>([])
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'recommendations'>('pending')
  const [toast, setToast] = useState<Toast | null>(null)
  const [accessDenied, setAccessDenied] = useState(false)

  useEffect(() => {
    checkAdminAccess()
  }, [])

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  function showToast(message: string, type: 'success' | 'error' = 'success') {
    setToast({ message, type })
  }

  async function checkAdminAccess() {
    try {
      const user = await getCurrentUser()
      if (!user) {
        router.push('/')
        return
      }

      const profile = await getUserProfile(user.id)
      if (!profile?.is_admin) {
        setAccessDenied(true)
        setLoading(false)
        setTimeout(() => router.push('/'), 2000)
        return
      }

      setIsAdmin(true)
      await fetchData()
    } catch (error) {
      console.error('Admin access error:', error)
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  async function fetchData() {
    try {
      setRefreshing(true)

      const [pendingRes, approvedRes, recsRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('status', 'pending')
          .order('created_at', { ascending: false }),
        supabase
          .from('profiles')
          .select('*')
          .eq('status', 'approved')
          .order('trust_score', { ascending: false }),
        supabase
          .from('recommendations')
          .select('*, profiles(name)')
          .order('created_at', { ascending: false })
          .limit(50)
      ])

      if (pendingRes.error) throw pendingRes.error
      if (approvedRes.error) throw approvedRes.error
      if (recsRes.error) throw recsRes.error

      setPendingProfiles(pendingRes.data || [])
      setAllProfiles(approvedRes.data || [])
      setRecommendations(recsRes.data || [])
    } catch (error) {
      console.error('Fetch error:', error)
      showToast('Failed to load data', 'error')
    } finally {
      setRefreshing(false)
    }
  }

  async function approveProfile(profileId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ status: 'approved' })
        .eq('id', profileId)
        .select()

      if (error) throw error
      if (!data || data.length === 0) throw new Error('No rows updated. Check RLS policies.')

      setPendingProfiles(prev => prev.filter(p => p.id !== profileId))
      setAllProfiles(prev => [...prev, data[0]])
      showToast('✅ Profile approved successfully!')
    } catch (error: any) {
      console.error('Approve error:', error)
      showToast(`Failed to approve: ${error.message}`, 'error')
    }
  }

  async function rejectProfile(profileId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ status: 'rejected' })
        .eq('id', profileId)
        .select()

      if (error) throw error
      if (!data || data.length === 0) throw new Error('No rows updated. Check RLS policies.')

      setPendingProfiles(prev => prev.filter(p => p.id !== profileId))
      showToast('Profile rejected.')
    } catch (error: any) {
      console.error('Reject error:', error)
      showToast(`Failed to reject: ${error.message}`, 'error')
    }
  }

  async function deleteProfile(profileId: string) {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', profileId)

      if (error) throw error

      setAllProfiles(prev => prev.filter(p => p.id !== profileId))
      showToast('✅ Profile deleted.')
    } catch (error: any) {
      console.error('Delete error:', error)
      showToast(`Failed to delete: ${error.message}`, 'error')
    }
  }

  // Access Denied Screen
  if (accessDenied) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have admin privileges. Redirecting...</p>
        </div>
      </div>
    )
  }

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium flex items-center gap-3 ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage creators, profiles, and recommendations
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
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
          <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Approval</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">{pendingProfiles.length}</p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Approved Creators</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{allProfiles.length}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Recommendations</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{recommendations.length}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <nav className="flex border-b border-gray-200 px-6">
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-4 px-2 mr-6 border-b-2 font-medium text-sm ${
                activeTab === 'pending'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Pending ({pendingProfiles.length})
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`py-4 px-2 mr-6 border-b-2 font-medium text-sm ${
                activeTab === 'approved'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Approved ({allProfiles.length})
            </button>
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'recommendations'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Recommendations ({recommendations.length})
            </button>
          </nav>
        </div>

        {/* Pending Tab */}
        {activeTab === 'pending' && (
          <div className="space-y-4">
            {pendingProfiles.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <CheckCircle className="h-14 w-14 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No pending profiles</p>
                <p className="text-gray-500 text-sm mt-1">All submissions have been reviewed!</p>
              </div>
            ) : (
              pendingProfiles.map(profile => (
                <div key={profile.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-gray-900">{profile.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{profile.bio}</p>
                    {profile.platform_link && (
                      <a
                        href={profile.platform_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm hover:underline mt-1 inline-block"
                      >
                        {profile.platform_link}
                      </a>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {profile.geography && (
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                        📍 {profile.geography}
                      </span>
                    )}
                    {profile.media_format && (
                      <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                        🎙️ {profile.media_format}
                      </span>
                    )}
                    {profile.topics?.map(topic => (
                      <span key={topic} className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">
                        {topic}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => approveProfile(profile.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => rejectProfile(profile.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm"
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

        {/* Approved Tab */}
        {activeTab === 'approved' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Creator', 'Geography', 'Format', 'Trust Score', 'Recs', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {allProfiles.map(profile => (
                  <tr key={profile.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{profile.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{profile.geography}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{profile.media_format}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-semibold text-blue-600">
                          {Number(profile.trust_score).toFixed(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{profile.recommendation_count}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => deleteProfile(profile.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete profile"
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
            {recommendations.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <MessageSquare className="h-14 w-14 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No recommendations yet</p>
              </div>
            ) : (
              recommendations.map(rec => (
                <div key={rec.id} className="bg-white rounded-lg shadow-sm p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-semibold text-sm">
                        {rec.user_name?.charAt(0) || '?'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-medium text-gray-900 text-sm">{rec.user_name}</span>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                          {rec.user_title}
                        </span>
                        <span className="text-gray-400 text-sm">→</span>
                        <span className="font-medium text-blue-600 text-sm">{rec.profiles?.name}</span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">"{rec.rationale}"</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(rec.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  )
}