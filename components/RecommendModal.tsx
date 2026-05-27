// @ts-nocheck
'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface RecommendModalProps {
  isOpen: boolean
  onClose: () => void
  profileId: string
  profileName: string
  userId: string
  userName: string
  userRole: string
  onSuccess: () => void
}

export default function RecommendModal({ 
  isOpen, 
  onClose, 
  profileId, 
  profileName,
  userId,
  userName,
  userRole,
  onSuccess 
}: RecommendModalProps) {
  const [rationale, setRationale] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (rationale.trim().length < 20) {
      setError('Please provide at least 20 characters explaining why you recommend this creator.')
      return
    }

    setError('')
    setLoading(true)

    try {
      console.log('💬 Step 1: Inserting recommendation...')
      
      // Step 1: Insert recommendation
      const { error: insertError } = await supabase
        .from('recommendations')
        .insert({
          profile_id: profileId,
          user_id: userId,
          user_name: userName,
          user_title: userRole,
          rationale: rationale.trim(),
        })

      if (insertError) {
        console.error('❌ Insert error:', insertError)
        throw insertError
      }

      console.log('✅ Recommendation inserted')

      // Step 2: Get current profile values
      console.log('💬 Step 2: Fetching current profile...')
      
      const { data: currentProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('recommendation_count, trust_score')
        .eq('id', profileId)
        .single()

      if (fetchError) {
        console.error('❌ Fetch error:', fetchError)
        throw fetchError
      }

      console.log('📊 Current profile:', currentProfile)

      // Step 3: Calculate new values
      const oldCount = currentProfile.recommendation_count || 0
      const newCount = oldCount + 1
      
      // Trust score calculation
      let newTrustScore = 7.0 // Base
      newTrustScore += Math.min(newCount * 0.15, 2.5) // Diminishing returns
      
      // Role weight
      const roleWeights: Record<string, number> = {
        'Founder': 1.2,
        'Investor': 1.3,
        'Operator': 1.1,
        'Builder': 1.0,
        'Journalist': 0.9,
        'Other': 0.8,
      }
      
      const roleWeight = roleWeights[userRole] || 1.0
      newTrustScore *= roleWeight
      newTrustScore = Math.min(newTrustScore, 10.0)
      newTrustScore = Math.round(newTrustScore * 10) / 10 // Round to 1 decimal

      console.log('📈 OLD count:', oldCount, '→ NEW count:', newCount)
      console.log('📈 OLD score:', currentProfile.trust_score, '→ NEW score:', newTrustScore)

      // Step 4: Update the profile
      console.log('💬 Step 3: Updating profile...')
      
      const { data: updateData, error: updateError } = await supabase
        .from('profiles')
        .update({
          recommendation_count: newCount,
          trust_score: newTrustScore,
        })
        .eq('id', profileId)
        .select()

      if (updateError) {
        console.error('❌ Update error:', updateError)
        throw updateError
      }

      console.log('✅ Profile updated:', updateData)

      // Verify the update worked
      if (!updateData || updateData.length === 0) {
        throw new Error('Profile update failed - no rows returned')
      }

      // Step 5: Success!
      console.log('🎉 ALL DONE! Recommendation submitted and profile updated')
      
      alert(`✅ Success! ${profileName} now has ${newCount} recommendations and trust score ${newTrustScore}`)
      
      setRationale('')
      onClose()
      onSuccess()
      
    } catch (err: any) {
      console.error('❌ Full error:', err)
      setError(err.message || 'Failed to submit recommendation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Recommend {profileName}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Share why this creator is worth following
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Why do you recommend {profileName}? *
            </label>
            <textarea
              required
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={5}
              placeholder="Be specific! What makes their content valuable? What insights do they provide? How have they helped the ecosystem?"
              minLength={20}
            />
            <div className="text-xs text-gray-500 mt-1">
              {rationale.length} / 20 characters minimum
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>💡 Tip:</strong> Great recommendations are specific, detailed, and explain the unique value this creator brings to the ecosystem.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || rationale.trim().length < 20}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Recommendation'}
          </button>
        </form>
      </div>
    </div>
  )
}