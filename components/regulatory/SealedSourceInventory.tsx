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

const formatDateMMDDYY = (dateStr: string) => {
  const date = new Date(dateStr + 'T00:00:00')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const year = String(date.getFullYear()).slice(-2)
  return `${month}/${day}/${year}`
}

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

  const deleteSource = (id: string) => {
    setSources(sources.filter((s) => s.id !== id))
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
        formatDateMMDDYY(source.lastInventory),
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Seal Source Inventory</h3>
          <p className="text-sm text-gray-600 mt-1">{sources.length} sealed sources tracked</p>
        </div>
        <Button onClick={exportToExcel} className="bg-blue-900 hover:bg-blue-800">
          Export to Excel
        </Button>
      </div>

      {/* Total Activity */}
      <Card className="p-4 bg-blue-50">
        <p className="text-xs text-gray-600 mb-1">Total Activity</p>
        <p className="text-2xl font-bold text-blue-900">{totalActivity.toFixed(1)} µCi</p>
      </Card>

      {/* Add Source Form */}
      <Card className="p-6 border-2 border-blue-900">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Add New Sealed Source</h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="isotope">Isotope</Label>
              <Input
                id="isotope"
                placeholder="e.g., Co-57"
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
              <Label htmlFor="technologist">Technologist</Label>
              <select
                id="technologist"
                value={formData.technologist}
                onChange={(e) => setFormData({ ...formData, technologist: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {technologistInitials.map((tech) => (
                  <option key={tech} value={tech}>
                    {tech}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button type="submit" className="bg-green-600 hover:bg-green-700">
            Add Source
          </Button>
        </form>
      </Card>

      {/* Sources Table */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Sealed Sources</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Isotope</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Activity (µCi)</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Location</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Last Inventory</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Technologist</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody>
              {sources.map((source) => (
                <tr key={source.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 font-medium">{source.id}</td>
                  <td className="py-3 px-4 text-gray-700">{source.isotope}</td>
                  <td className="text-center py-3 px-4 text-gray-700">{source.activity}</td>
                  <td className="py-3 px-4 text-gray-700">{source.location}</td>
                  <td className="py-3 px-4 text-gray-700">{formatDateMMDDYY(source.lastInventory)}</td>
                  <td className="text-center py-3 px-4 text-gray-700">{source.technologist}</td>
                  <td className="text-center py-3 px-4">
                    <button
                      onClick={() => deleteSource(source.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                      title="Delete"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
