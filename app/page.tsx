'use client'

import { useEffect, useState } from 'react'
import { supabase, Profile } from '@/lib/supabase'
import { Search, Filter, Globe, Tag, Radio } from 'lucide-react'

export default function Home() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGeography, setSelectedGeography] = useState<string>('all')
  const [selectedTopic, setSelectedTopic] = useState<string>('all')
  const [selectedFormat, setSelectedFormat] = useState<string>('all')

  // Fetch profiles from database
  useEffect(() => {
    fetchProfiles()
  }, [])

  async function fetchProfiles() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('status', 'approved')
        .order('trust_score', { ascending: false })

      if (error) throw error
      setProfiles(data || [])
    } catch (error) {
      console.error('Error fetching profiles:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter profiles based on search and filters
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

  // Get unique values for filters
  const geographies = Array.from(new Set(profiles.map(p => p.geography).filter(Boolean)))
  const topics = Array.from(new Set(profiles.flatMap(p => p.topics || [])))
  const formats = Array.from(new Set(profiles.map(p => p.media_format).filter(Boolean)))

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading profiles...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Silicon Xchange</h1>
          <p className="text-sm text-gray-600">Discover credible voices in Africa tech & venture</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search creators..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Geography Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="inline h-4 w-4 mr-1" />
                Geography
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={selectedGeography}
                onChange={(e) => setSelectedGeography(e.target.value)}
              >
                <option value="all">All Regions</option>
                {geographies.map(geo => (
                  <option key={geo} value={geo}>{geo}</option>
                ))}
              </select>
            </div>

            {/* Topic Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="inline h-4 w-4 mr-1" />
                Topic
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
              >
                <option value="all">All Topics</option>
                {topics.map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>

            {/* Format Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Radio className="inline h-4 w-4 mr-1" />
                Format
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredProfiles.length} of {profiles.length} creators
          </div>
        </div>

        {/* Profiles List */}
        <div className="space-y-4">
          {filteredProfiles.map((profile) => (
            <div key={profile.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{profile.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{profile.bio}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-blue-600">
                    Trust Score: {profile.trust_score.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {profile.recommendation_count} recommendations
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {profile.geography && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    📍 {profile.geography}
                  </span>
                )}
                {profile.media_format && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    🎙️ {profile.media_format}
                  </span>
                )}
                {profile.topics?.map((topic) => (
                  <span key={topic} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                    {topic}
                  </span>
                ))}
              </div>

              {profile.platform_link && (
                <a
                  href={profile.platform_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Visit Profile →
                </a>
              )}
            </div>
          ))}

          {filteredProfiles.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No creators found matching your filters.
            </div>
          )}
        </div>
      </main>
    </div>
  )
}