'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import * as XLSX from 'xlsx'

/**
 * Waste Management Component
 * Tracks radioactive waste bins with volume, activity, location, and status
 */

const locations = [
  'Hot Lab',
  'Hot Lab Floor',
  'Nuclear Medicine Camera',
  'Nuclear Medicine Floor',
  'PET Camera',
  'PET Floor',
  'Technologist Workstation',
  'Injection/Quiet Room',
  'Stress Lab',
  'IV Prep Room',
]

const technologistInitials = ['MK', 'JB', 'NB', 'MG']

const sampleWasteBins = [
  { id: 'WB001', location: 'Hot Lab', volume: 45.5, activity: 125.3, status: 'Active', lastUpdate: '2025-11-08', technologist: 'MK' },
  { id: 'WB002', location: 'Nuclear Medicine Camera', volume: 32.0, activity: 85.2, status: 'Active', lastUpdate: '2025-11-08', technologist: 'JB' },
  { id: 'WB003', location: 'PET Camera', volume: 78.5, activity: 215.8, status: 'Full', lastUpdate: '2025-11-07', technologist: 'NB' },
]

export function WasteManagement() {
  const [wasteBins, setWasteBins] = useState(sampleWasteBins)
  const [formData, setFormData] = useState({
    location: locations[0],
    volume: '',
    activity: '',
    status: 'Active',
    technologist: technologistInitials[0],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.volume && formData.activity) {
      const newBin = {
        id: `WB${String(wasteBins.length + 1).padStart(3, '0')}`,
        location: formData.location,
        volume: parseFloat(formData.volume),
        activity: parseFloat(formData.activity),
        status: formData.status,
        lastUpdate: new Date().toISOString().split('T')[0],
        technologist: formData.technologist,
      }
      setWasteBins([newBin, ...wasteBins])
      setFormData({
        location: locations[0],
        volume: '',
        activity: '',
        status: 'Active',
        technologist: technologistInitials[0],
      })
    }
  }

  const activeBins = wasteBins.filter((b) => b.status === 'Active').length
  const fullBins = wasteBins.filter((b) => b.status === 'Full').length
  const totalActivity = wasteBins.reduce((sum, b) => sum + b.activity, 0)

  const exportToExcel = () => {
    const ws_data = [
      ['Waste Management Report'],
      [`Generated: ${new Date().toLocaleString()}`],
      [],
      ['ID', 'Location', 'Volume (L)', 'Activity (µCi)', 'Status', 'Last Update', 'Technologist'],
      ...wasteBins.map((bin) => [
        bin.id,
        bin.location,
        bin.volume,
        bin.activity,
        bin.status,
        bin.lastUpdate,
        bin.technologist,
      ]),
      [],
      ['Active Bins', activeBins],
      ['Full Bins', fullBins],
      ['Total Activity', `${totalActivity.toFixed(1)} µCi`],
    ]

    const ws = XLSX.utils.aoa_to_sheet(ws_data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Waste Bins')
    XLSX.writeFile(wb, `waste-management-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  return (
    <div className="space-y-6">
      {/* Add Waste Bin Form */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Waste Bin</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <select
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="volume">Volume (L)</Label>
              <Input
                id="volume"
                type="number"
                step="0.1"
                placeholder="Enter volume"
                value={formData.volume}
                onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
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
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
              >
                <option>Active</option>
                <option>Full</option>
                <option>Disposed</option>
              </select>
            </div>
            <div className="md:col-span-2">
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
            Add Waste Bin
          </Button>
        </form>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Total Bins</p>
          <p className="text-2xl font-bold text-blue-900">{wasteBins.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Active</p>
          <p className="text-2xl font-bold text-green-600">{activeBins}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Full</p>
          <p className="text-2xl font-bold text-orange-600">{fullBins}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Total Activity</p>
          <p className="text-2xl font-bold text-blue-900">{totalActivity.toFixed(1)} µCi</p>
        </Card>
      </div>

      {/* Waste Bins Table */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Waste Bins</h3>
          <Button onClick={exportToExcel} className="bg-blue-900 hover:bg-blue-800">
            Export to Excel
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Location</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Volume (L)</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Activity (µCi)</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Last Update</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Technologist</th>
              </tr>
            </thead>
            <tbody>
              {wasteBins.map((bin) => (
                <tr key={bin.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 font-medium">{bin.id}</td>
                  <td className="py-3 px-4 text-gray-700">{bin.location}</td>
                  <td className="text-right py-3 px-4 text-gray-700">{bin.volume}</td>
                  <td className="text-right py-3 px-4 text-gray-700">{bin.activity}</td>
                  <td className="text-center py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      bin.status === 'Active' ? 'bg-green-100 text-green-800' :
                      bin.status === 'Full' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {bin.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{bin.lastUpdate}</td>
                  <td className="text-center py-3 px-4 text-gray-700">{bin.technologist}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
