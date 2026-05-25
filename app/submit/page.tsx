'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Send, CheckCircle } from 'lucide-react'

export default function SubmitPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    platform_link: '',
    geography: '',
    topics: '',
    media_format: 'Newsletter',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validate
      if (!formData.name || !formData.bio || !formData.geography) {
        throw new Error('Please fill in all required fields')
      }

      // Convert topics string to array
      const topicsArray = formData.topics
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0)

      // Insert new profile as pending
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          name: formData.name,
          bio: formData.bio,
          platform_link: formData.platform_link || null,
          geography: formData.geography,
          topics: topicsArray,
          media_format: formData.media_format,
          recommendation_count: 0,
          trust_score: 7.0, // Default starting score
          status: 'pending', // Requires admin approval
        })

      if (insertError) throw insertError

      setSubmitted(true)
    } catch (err: any) {
      console.error('Submission error:', err)
      setError(err.message || 'Failed to submit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Submission Received!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for submitting a creator. Our team will review and approve it shortly.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/')}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Back to Home
            </button>
            <button
              onClick={() => {
                setSubmitted(false)
                setFormData({
                  name: '',
                  bio: '',
                  platform_link: '',
                  geography: '',
                  topics: '',
                  media_format: 'Newsletter',
                })
              }}
              className="w-full px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            >
              Submit Another
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Submit a Creator</h1>
              <p className="text-sm text-gray-600 mt-1">
                Help the community discover valuable voices in African tech
              </p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <h3 className="font-semibold text-blue-900 mb-2">Submission Guidelines</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Creator must be actively producing content about African tech/venture</li>
              <li>• Provide accurate and complete information</li>
              <li>• Include a working link to their platform</li>
              <li>• All submissions are reviewed by our team before approval</li>
            </ul>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Creator/Publication Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., TechCabal, Benjamin Dada"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description/Bio *
              </label>
              <textarea
                required
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Briefly describe what makes this creator valuable to the ecosystem. What do they cover? Why are they credible?"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.bio.length} characters
              </p>
            </div>

            {/* Platform Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform Link
              </label>
              <input
                type="url"
                value={formData.platform_link}
                onChange={(e) => setFormData({ ...formData, platform_link: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com or https://linkedin.com/in/username"
              />
            </div>

            {/* Geography */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Geography *
              </label>
              <select
                required
                value={formData.geography}
                onChange={(e) => setFormData({ ...formData, geography: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Select region</option>
                <option value="Pan-African">Pan-African</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Kenya">Kenya</option>
                <option value="South Africa">South Africa</option>
                <option value="Ghana">Ghana</option>
                <option value="Egypt">Egypt</option>
                <option value="Rwanda">Rwanda</option>
                <option value="Ethiopia">Ethiopia</option>
                <option value="Tanzania">Tanzania</option>
                <option value="Uganda">Uganda</option>
                <option value="Senegal">Senegal</option>
                <option value="Ivory Coast">Ivory Coast</option>
                <option value="Francophone Africa">Francophone Africa</option>
                <option value="East Africa">East Africa</option>
                <option value="West Africa">West Africa</option>
                <option value="Southern Africa">Southern Africa</option>
              </select>
            </div>

            {/* Topics */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topics (comma-separated) *
              </label>
              <input
                type="text"
                required
                value={formData.topics}
                onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Fintech, Venture Capital, Startups, AI"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate multiple topics with commas
              </p>
            </div>

            {/* Media Format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Media Format *
              </label>
              <select
                required
                value={formData.media_format}
                onChange={(e) => setFormData({ ...formData, media_format: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Newsletter">Newsletter</option>
                <option value="Podcast">Podcast</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Twitter">Twitter</option>
                <option value="YouTube">YouTube</option>
                <option value="Publication">Publication</option>
                <option value="Magazine">Magazine</option>
                <option value="Research">Research</option>
                <option value="Community">Community</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Submit for Review
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}