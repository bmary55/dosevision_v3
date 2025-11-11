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
  { id: 'WB001', binName: 'Lab Waste Container A', binNumber: 'BN-001', location: 'Hot Lab', volume: 45.5, activity: 125.3, status: 'Active', lastUpdate: '2025-11-08', technologist: 'MK' },
  { id: 'WB002', binName: 'Camera Waste Container B', binNumber: 'BN-002', location: 'Nuclear Medicine Camera', volume: 32.0, activity: 85.2, status: 'Active', lastUpdate: '2025-11-08', technologist: 'JB' },
  { id: 'WB003', binName: 'PET Waste Container C', binNumber: 'BN-003', location: 'PET Camera', volume: 78.5, activity: 215.8, status: 'Full', lastUpdate: '2025-11-07', technologist: 'NB' },
]

const formatDateMMDDYY = (dateStr: string) => {
  const date = new Date(dateStr + 'T00:00:00')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const year = String(date.getFullYear()).slice(-2)
  return `${month}/${day}/${year}`
}

export function WasteManagement() {
  const [wasteBins, setWasteBins] = useState(sampleWasteBins)
  const [formData, setFormData] = useState({
    binName: '',
    binNumber: '',
    location: locations[0],
    volume: '',
    activity: '',
    status: 'Active',
    technologist: technologistInitials[0],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.binName && formData.binNumber && formData.volume && formData.activity) {
      const newBin = {
        id: `WB${String(wasteBins.length + 1).padStart(3, '0')}`,
        binName: formData.binName,
        binNumber: formData.binNumber,
        location: formData.location,
        volume: parseFloat(formData.volume),
        activity: parseFloat(formData.activity),
        status: formData.status,
        lastUpdate: new Date().toISOString().split('T')[0],
        technologist: formData.technologist,
      }
      setWasteBins([newBin, ...wasteBins])
      setFormData({
        binName: '',
        binNumber: '',
        location: locations[0],
        volume: '',
        activity: '',
        status: 'Active',
        technologist: technologistInitials[0],
      })
    }
  }

  const handleDeleteBin = (id: string) => {
    setWasteBins(wasteBins.filter((b) => b.id !== id))
  }

  const activeBins = wasteBins.filter((b) => b.status === 'Active').length
  const fullBins = wasteBins.filter((b) => b.status === 'Full').length
  const totalActivity = wasteBins.reduce((sum, b) => sum + b.activity, 0)
  const totalVolume = wasteBins.reduce((sum, b) => sum + b.volume, 0)

  const exportToExcel = () => {
    const ws_data = [
      ['Waste Management Report'],
      [`Generated: ${new Date().toLocaleString()}`],
      [],
      ['ID', 'Bin Name', 'Bin Number', 'Location', 'Volume (L)', 'Activity (µCi)', 'Status', 'Last Update', 'Technologist'],
      ...wasteBins.map((bin) => [
        bin.id,
        bin.binName,
        bin.binNumber,
        bin.location,
        bin.volume,
        bin.activity,
        bin.status,
        formatDateMMDDYY(bin.lastUpdate),
        bin.technologist,
      ]),
      [],
      ['Total Volume', `${totalVolume.toFixed(1)} L`],
      ['Total Activity', `${totalActivity.toFixed(1)} µCi`],
      ['Active Bins', activeBins],
      ['Full Bins', fullBins],
    ]

    const ws = XLSX.utils.aoa_to_sheet(ws_data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Waste Management')
    XLSX.writeFile(wb, `waste-management-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Waste Management</h3>
          <p className="text-sm text-gray-600 mt-1">{wasteBins.length} waste bins tracked</p>
        </div>
        <Button onClick={exportToExcel} className="bg-blue-900 hover:bg-blue-800">
          Export to Excel
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs text-gray-600 mb-1">Active Bins</p>
          <p className="text-2xl font-bold text-blue-600">{activeBins}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-gray-600 mb-1">Full Bins</p>
          <p className="text-2xl font-bold text-orange-600">{fullBins}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-gray-600 mb-1">Total Volume</p>
          <p className="text-2xl font-bold text-green-600">{totalVolume.toFixed(1)} L</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-gray-600 mb-1">Total Activity</p>
          <p className="text-2xl font-bold text-red-600">{totalActivity.toFixed(1)} µCi</p>
        </Card>
      </div>

      {/* Add Waste Bin Form */}
      <Card className="p-6 border-2 border-blue-900">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Add New Waste Bin</h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="binName">Bin Name</Label>
              <Input
                id="binName"
                placeholder="e.g., Lab Waste Container A"
                value={formData.binName}
                onChange={(e) => setFormData({ ...formData, binName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="binNumber">Bin Number</Label>
              <Input
                id="binNumber"
                placeholder="e.g., BN-001"
                value={formData.binNumber}
                onChange={(e) => setFormData({ ...formData, binNumber: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <select
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="Active">Active</option>
                <option value="Full">Full</option>
                <option value="Disposed">Disposed</option>
              </select>
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
            Add Waste Bin
          </Button>
        </form>
      </Card>

      {/* Waste Bins Table */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Waste Bins</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Bin Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Bin Number</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Location</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Volume (L)</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Activity (µCi)</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Last Update</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Technologist</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody>
              {wasteBins.map((bin) => (
                <tr key={bin.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 font-medium">{bin.id}</td>
                  <td className="py-3 px-4 text-gray-700">{bin.binName}</td>
                  <td className="py-3 px-4 text-gray-700">{bin.binNumber}</td>
                  <td className="py-3 px-4 text-gray-700">{bin.location}</td>
                  <td className="text-center py-3 px-4 text-gray-700">{bin.volume}</td>
                  <td className="text-center py-3 px-4 text-gray-700">{bin.activity}</td>
                  <td className="text-center py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        bin.status === 'Active'
                          ? 'bg-blue-100 text-blue-800'
                          : bin.status === 'Full'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {bin.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{formatDateMMDDYY(bin.lastUpdate)}</td>
                  <td className="text-center py-3 px-4 text-gray-700">{bin.technologist}</td>
                  <td className="text-center py-3 px-4">
                    <button
                      onClick={() => handleDeleteBin(bin.id)}
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
