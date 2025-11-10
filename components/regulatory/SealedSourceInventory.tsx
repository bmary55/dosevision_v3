'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import * as XLSX from 'xlsx'

/**
 * Sealed Source Inventory Component
 * Tracks sealed radioactive sources with activity and location
 */

const technologistInitials = ['MK', 'JB', 'NB', 'MG']

const sampleSources = [
  { id: 'SS001', isotope: 'Co-57', activity: 5.2, location: 'Hot Lab Safe', lastInventory: '2025-11-08', technologist: 'MK' },
  { id: 'SS002', isotope: 'Cs-137', activity: 8.5, location: 'Calibration Room', lastInventory: '2025-11-08', technologist: 'JB' },
  { id: 'SS003', isotope: 'Ba-133', activity: 3.1, location: 'Hot Lab Safe', lastInventory: '2025-11-07', technologist: 'NB' },
]

export function SealedSourceInventory() {
  const [sources, setSources] = useState(sampleSources)
  const [formData, setFormData] = useState({
    isotope: '',
    activity: '',
    location: '',
    technologist: technologistInitials[0],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.isotope && formData.activity && formData.location) {
      const newSource = {
        id: `SS${String(sources.length + 1).padStart(3, '0')}`,
        isotope: formData.isotope,
        activity: parseFloat(formData.activity),
        location: formData.location,
        lastInventory: new Date().toISOString().split('T')[0],
        technologist: formData.technologist,
      }
      setSources([newSource, ...sources])
      setFormData({
        isotope: '',
        activity: '',
        location: '',
        technologist: technologistInitials[0],
      })
    }
  }

  const totalActivity = sources.reduce((sum, s) => sum + s.activity, 0)

  const exportToExcel = () => {
    const ws_data = [
      ['Sealed Source Inventory Report'],
      [`Generated: ${new Date().toLocaleString()}`],
      [],
      ['ID', 'Isotope', 'Activity (µCi)', 'Location', 'Last Inventory', 'Technologist'],
      ...sources.map((source) => [
        source.id,
        source.isotope,
        source.activity,
        source.location,
        source.lastInventory,
        source.technologist,
      ]),
      [],
      ['Total Activity', `${totalActivity.toFixed(1)} µCi`],
    ]

    const ws = XLSX.utils.aoa_to_sheet(ws_data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sealed Sources')
    XLSX.writeFile(wb, `sealed-source-inventory-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  return (
    <div className="space-y-6">
      {/* Add Source Form */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Sealed Source</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="isotope">Isotope</Label>
              <Input
                id="isotope"
                placeholder="e.g., Co-57, Cs-137"
                value={formData.isotope}
                onChange={(e) => setFormData({ ...formData, isotope: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="activity">Activity (µCi)</Label>
              <Input
                id="activity"
                type="number"
                step="0.1"
                placeholder="Enter activity"
                value={formData.activity}
                onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., Hot Lab Safe"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="technologist">Technologist Initials</Label>
              <select
                id="technologist"
                value={formData.technologist}
                onChange={(e) => setFormData({ ...formData, technologist: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
              >
                {technologistInitials.map((init) => (
                  <option key={init} value={init}>
                    {init}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Button type="submit" className="bg-blue-900 hover:bg-blue-800">
            Add Source
          </Button>
        </form>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Total Sources</p>
          <p className="text-2xl font-bold text-blue-900">{sources.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Total Activity</p>
          <p className="text-2xl font-bold text-blue-900">{totalActivity.toFixed(1)} µCi</p>
        </Card>
      </div>

      {/* Sources Table */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Sealed Sources</h3>
          <Button onClick={exportToExcel} className="bg-blue-900 hover:bg-blue-800">
            Export to Excel
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Isotope</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Activity (µCi)</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Location</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Last Inventory</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Technologist</th>
              </tr>
            </thead>
            <tbody>
              {sources.map((source) => (
                <tr key={source.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 font-medium">{source.id}</td>
                  <td className="py-3 px-4 text-gray-700">{source.isotope}</td>
                  <td className="text-right py-3 px-4 text-gray-700">{source.activity}</td>
                  <td className="py-3 px-4 text-gray-700">{source.location}</td>
                  <td className="py-3 px-4 text-gray-700">{source.lastInventory}</td>
                  <td className="text-center py-3 px-4 text-gray-700">{source.technologist}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
