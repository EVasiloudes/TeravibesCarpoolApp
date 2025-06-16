'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Input from './ui/Input'
import Textarea from './ui/Textarea'
import Select from './ui/Select'
import Button from './ui/Button'

interface TripFormData {
  title: string
  description: string
  origin: string
  destination: string
  departureDate: string
  departureTime: string
  availableSeats: number
  pricePerSeat: number
}

interface TripFormProps {
  onClose?: () => void
}

const CYPRUS_CITIES = [
  { value: '', label: 'Select origin city...' },
  { value: 'Nicosia', label: 'Nicosia' },
  { value: 'Limassol', label: 'Limassol' },
  { value: 'Larnaca', label: 'Larnaca' },
  { value: 'Paphos', label: 'Paphos' },
  { value: 'Famagusta', label: 'Famagusta' },
  { value: 'Kyrenia', label: 'Kyrenia' },
  { value: 'Protaras', label: 'Protaras' },
  { value: 'Ayia Napa', label: 'Ayia Napa' },
  { value: 'Polis', label: 'Polis' },
  { value: 'Other', label: 'Other' },
]

export default function TripForm({ onClose }: TripFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<TripFormData>({
    title: '',
    description: '',
    origin: '',
    destination: 'Fasli', // Pre-filled as festival location
    departureDate: '2025-08-23', // Pre-filled as festival date
    departureTime: '',
    availableSeats: 40,
    pricePerSeat: 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create trip')
      }

      // Success - redirect to trips page
      if (onClose) {
        onClose()
      } else {
        router.push('/trips')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create trip')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof TripFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="max-w-2xl mx-auto bg-white bg-opacity-95 backdrop-blur-md rounded-lg shadow-lg border border-white border-opacity-20 p-6">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Create a New Trip</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Trip Title"
          type="text"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="e.g., Drive to Teravibes from Limassol"
          required
        />

        <Textarea
          label="Description (Optional)"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Tell passengers about your trip, car, music preferences, etc."
          rows={3}
        />

        <div className="grid md:grid-cols-2 gap-4">
          <Select
            label="Origin City"
            value={formData.origin}
            onChange={(e) => handleChange('origin', e.target.value)}
            options={CYPRUS_CITIES}
            required
          />

          <Input
            label="Destination"
            type="text"
            value={formData.destination}
            onChange={(e) => handleChange('destination', e.target.value)}
            required
            disabled
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Departure Date"
            type="date"
            value={formData.departureDate}
            onChange={(e) => handleChange('departureDate', e.target.value)}
            required
          />

          <Input
            label="Departure Time"
            type="time"
            value={formData.departureTime}
            onChange={(e) => handleChange('departureTime', e.target.value)}
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Available Seats"
            type="number"
            min="1"
            max="50"
            value={formData.availableSeats}
            onChange={(e) => handleChange('availableSeats', parseInt(e.target.value))}
            required
          />

          <Input
            label="Price per Seat (€)"
            type="number"
            min="0"
            step="0.01"
            value={formData.pricePerSeat}
            onChange={(e) => handleChange('pricePerSeat', parseFloat(e.target.value))}
            placeholder="0.00"
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 bg-opacity-90 backdrop-blur-sm p-3 rounded-md border border-red-200 border-opacity-50">
            {error}
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all"
          >
            {loading ? 'Creating...' : 'Create Trip'}
          </Button>

          {onClose && (
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="bg-white bg-opacity-90 backdrop-blur-sm border-opacity-50 hover:bg-opacity-100"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
