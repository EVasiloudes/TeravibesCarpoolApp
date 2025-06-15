'use client'

import { useState, useCallback, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'

interface ProfileFormData {
  name: string
  phone: string
}

export default function Profile() {
  const { user, refreshUser } = useAuth()
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    phone: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [hasChanges, setHasChanges] = useState(false)

  // Initialize form data when user is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || ''
      })
    }
  }, [user])

  // Check if form has changes
  const checkForChanges = useCallback((newData: ProfileFormData) => {
    if (!user) return false
    return (
      newData.name !== (user.name || '') ||
      newData.phone !== (user.phone || '')
    )
  }, [user])

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    setHasChanges(checkForChanges(newData))
    
    // Clear messages when user starts typing
    if (error) setError('')
    if (success) setSuccess('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile')
      }

      setSuccess('Profile updated successfully!')
      setHasChanges(false)
      
      // Refresh user data in auth context
      await refreshUser()
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || ''
      })
      setHasChanges(false)
      setError('')
      setSuccess('')
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner className="py-12" size="lg" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              value={user.email}
              disabled
              className="bg-gray-50"
            />
            <p className="text-sm text-gray-500 -mt-3">
              Email cannot be changed as it&apos;s used for authentication
            </p>
            
            <Input
              label="Full Name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your full name"
              maxLength={100}
            />
            
            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Enter your phone number (e.g., +357 99 123456)"
              maxLength={20}
            />
            <p className="text-sm text-gray-500 -mt-3">
              Include country code for international numbers
            </p>

            {error && (
              <ErrorMessage
                title="Update Failed"
                message={error}
                className="mb-4"
              />
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      {success}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                variant="primary"
                disabled={loading || !hasChanges}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
              
              {hasChanges && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={loading}
                >
                  Reset
                </Button>
              )}
            </div>
          </form>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">
                  About Your Profile
                </h3>
                <div className="mt-2 text-sm text-gray-600">
                  <p>
                    Your profile information helps other users identify you when you join trips or send messages. 
                    Make sure to keep your information up to date for the best experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Account Stats */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Member since:</span>
              <p className="text-gray-600">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Last updated:</span>
              <p className="text-gray-600">
                {new Date(user.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}