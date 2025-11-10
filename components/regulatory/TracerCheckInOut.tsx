'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import * as XLSX from 'xlsx'

/**
 * Tracer Check In/Out Component
 * Tracks radiopharmaceutical tracer inventory with check-in/check-out
 */

const isotopes = [
  'F18 Flurpiridaz (Flyrcado)',
  'F18 Piflufolastat (Pylarify)',
  'F18 Flotufolasta (Posluma)',
  'Ga69 Gozetotide (Illuccix)',
  'F18 Florbetapir (Amyvid)',
  'F18 Fluciclovine (Axumin)',
  'Cu-64 Dotatate (DetectNet)',
  'Ga-68 Dotatate (NetSpot)',
  'F18 Florbetaben (NeuraCeq)',
  'F18 Flutemetamol (Vizamyl)',
  'Rb82 Chloride (Rubidium-82)',
  'F18 FDG (Fluorodeoxyglucose)',
  'F18 NaF (Sodium Fluoride)',
  'F18 DOPA (Fluorodopa)',
]

const technologistInitials = ['MK', 'JB', 'NB', 'MG']

const sampleTracers = [
  { id: 'TR001', date: '2025-11-08', isotope: 'F18 FDG (Fluorodeoxyglucose)', activity: 50.0, type: 'Check In', technologist: 'MK', vendor: 'Cardinal Health' },
  { id: 'TR002', date: '2025-11-08', isotope: 'Ga-68 Dotatate (NetSpot)', activity: 30.0, type: 'Check Out', technologist: 'JB', vendor: 'GE HealthCare' },
  { id: 'TR003', date: '2025-11-07', isotope: 'F18 Florbetapir (Amyvid)', activity: 20.0, type: 'Check In', technologist: 'NB', vendor: 'Curium Pharma' },
]

export function TracerCheckInOut() {
  const [tracers, setTracers] = useState(sampleTracers)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    isotope: isotopes[0],
    activity: '',
    type: 'Check In',
    technologist: technologistInitials[0],
    vendor: '',
  })
  const [isotopeSearch, setIsotopeSearch] = useState('')
  const [showIsotopeDropdown, setShowIsotopeDropdown] = useState(false)

  const filteredIsotopes = isotopes.filter((iso) =>
    iso.toLowerCase().includes(isotopeSearch.toLowerCase())
  )

  const handleIsotopeSelect = (iso: string) => {
    setFormData({ ...formData, isotope: iso })
    setIsotopeSearch('')
    setShowIsotopeDropdown(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.activity && formData.vendor) {
      const newTracer = {
        id: `TR${String(tracers.length + 1).padStart(3, '0')}`,
        date: formData.date,
        isotope: formData.isotope,
        activity: parseFloat(formData.activity),
        type: formData.type,
        technologist: formData.technologist,
        vendor: formData.vendor,
      }
      setTracers([newTracer, ...tracers])
      setFormData({
        date: new Date().toISOString().split('T')[0],
        isotope: isotopes[0],
        activity: '',
        type: 'Check In',
        technologist: technologistInitials[0],
        vendor: '',
      })
    }
  }

  const checkInCount = tracers.filter((t) => t.type === 'Check In').length
  const checkOutCount = tracers.filter((t) => t.type === 'Check Out').length
  const totalActivity = tracers.reduce((sum, t) => sum + t.activity, 0)

  const exportToExcel = () => {
    const ws_data = [
      ['Tracer Check In/Out Report'],
      [`Generated: ${new Date().toLocaleString()}`],
      [],
      ['ID', 'Date', 'Isotope', 'Activity (mCi)', 'Type', 'Technologist', 'Vendor'],
      ...tracers.map((tracer) => [
        tracer.id,
        tracer.date,
        tracer.isotope,
        tracer.activity,
        tracer.type,
        tracer.technologist,
        tracer.vendor,
      ]),
      [],
      ['Check In', checkInCount],
      ['Check Out', checkOutCount],
      ['Total Activity', `${totalActivity.toFixed(1)} mCi`],
    ]

    const ws = XLSX.utils.aoa_to_sheet(ws_data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Tracers')
    XLSX.writeFile(wb, `tracer-check-inout-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  return (
    <div className="space-y-6">
      {/* Add Tracer Entry Form */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tracer Check In/Out</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="relative">
              <Label htmlFor="isotope">Isotope</Label>
              <Input
                id="isotope"
                placeholder="Type to search isotopes..."
                value={isotopeSearch || formData.isotope}
                onChange={(e) => {
                  setIsotopeSearch(e.target.value)
                  setShowIsotopeDropdown(true)
                }}
                onFocus={() => setShowIsotopeDropdown(true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
              {showIsotopeDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {filteredIsotopes.length > 0 ? (
                    filteredIsotopes.map((iso) => (
                      <div
                        key={iso}
                        onClick={() => handleIsotopeSelect(iso)}
                        className="px-3 py-2 hover:bg-blue-100 cursor-pointer text-sm text-gray-700"
                      >
                        {iso}
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500">No isotopes found</div>
                  )}
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="activity">Activity (mCi)</Label>
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
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
              >
                <option>Check In</option>
                <option>Check Out</option>
              </select>
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
            <div>
              <Label htmlFor="vendor">Vendor</Label>
              <Input
                id="vendor"
                placeholder="Enter vendor name"
                value={formData.vendor}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
              />
            </div>
          </div>
          <Button type="submit" className="bg-blue-900 hover:bg-blue-800">
            Submit Entry
          </Button>
        </form>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Total Entries</p>
          <p className="text-2xl font-bold text-blue-900">{tracers.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Check In</p>
          <p className="text-2xl font-bold text-green-600">{checkInCount}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Check Out</p>
          <p className="text-2xl font-bold text-orange-600">{checkOutCount}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Total Activity</p>
          <p className="text-2xl font-bold text-blue-900">{totalActivity.toFixed(1)} mCi</p>
        </Card>
      </div>

      {/* Tracer Entries Table */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Tracer Entries</h3>
          <Button onClick={exportToExcel} className="bg-blue-900 hover:bg-blue-800">
            Export to Excel
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Isotope</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Activity (mCi)</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Type</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Technologist</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Vendor</th>
              </tr>
            </thead>
            <tbody>
              {tracers.map((tracer) => (
                <tr key={tracer.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 font-medium">{tracer.id}</td>
                  <td className="py-3 px-4 text-gray-700">{tracer.date}</td>
                  <td className="py-3 px-4 text-gray-700">{tracer.isotope}</td>
                  <td className="text-right py-3 px-4 text-gray-700">{tracer.activity}</td>
                  <td className="text-center py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      tracer.type === 'Check In' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {tracer.type}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4 text-gray-700">{tracer.technologist}</td>
                  <td className="py-3 px-4 text-gray-700">{tracer.vendor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
