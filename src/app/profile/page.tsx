'use client'

import { useAuth } from '@/contexts/AuthContext'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function Profile() {
  const { user } = useAuth()

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>
      
      <div className="max-w-2xl bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
        
        <div className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={user.email}
            disabled
          />
          
          <Input
            label="Name"
            type="text"
            value={user.name || ''}
            placeholder="Enter your name"
          />
          
          <Input
            label="Phone Number"
            type="tel"
            value={user.phone || ''}
            placeholder="Enter your phone number"
          />
          
          <div className="pt-4">
            <Button variant="primary">
              Save Changes
            </Button>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t">
          <p className="text-sm text-gray-600">
            Profile update functionality is coming soon. You&apos;ll be able to update your 
            personal information and preferences here.
          </p>
        </div>
      </div>
    </div>
  )
}