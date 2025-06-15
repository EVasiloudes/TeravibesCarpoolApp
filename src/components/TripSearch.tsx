'use client'

import { useState } from 'react'
import Input from './ui/Input'
import Select from './ui/Select'
import Button from './ui/Button'

interface TripSearchProps {
  onSearch: (filters: SearchFilters) => void
  loading?: boolean
}

export interface SearchFilters {
  origin: string
  date: string
}

const CYPRUS_CITIES = [
  { value: '', label: 'Any city' },
  { value: 'Nicosia', label: 'Nicosia' },
  { value: 'Limassol', label: 'Limassol' },
  { value: 'Larnaca', label: 'Larnaca' },
  { value: 'Paphos', label: 'Paphos' },
  { value: 'Famagusta', label: 'Famagusta' },
  { value: 'Kyrenia', label: 'Kyrenia' },
  { value: 'Protaras', label: 'Protaras' },
  { value: 'Ayia Napa', label: 'Ayia Napa' },
  { value: 'Polis', label: 'Polis' },
]

export default function TripSearch({ onSearch, loading }: TripSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    origin: '',
    date: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(filters)
  }

  const handleReset = () => {
    const resetFilters = { origin: '', date: '' }
    setFilters(resetFilters)
    onSearch(resetFilters)
  }

  return (
    <div className="bg-white bg-opacity-95 backdrop-blur-md rounded-lg shadow-md border border-white border-opacity-20 p-6 mb-6">
      <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">Search Trips</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <Select
            label="Origin City"
            value={filters.origin}
            onChange={(e) => setFilters(prev => ({ ...prev, origin: e.target.value }))}
            options={CYPRUS_CITIES}
          />

          <Input
            label="Departure Date"
            type="date"
            value={filters.date}
            onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="flex gap-3">
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all"
          >
            {loading ? 'Searching...' : 'Search Trips'}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={loading}
            className="bg-white bg-opacity-90 backdrop-blur-sm border-opacity-50 hover:bg-opacity-100"
          >
            Clear Filters
          </Button>
        </div>
      </form>
    </div>
  )
}