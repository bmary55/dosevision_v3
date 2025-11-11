'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import * as XLSX from 'xlsx'

/**
 * Daily Area Survey Component
 * Tracks daily radiation surveys with location, dose rate, and status
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

const sampleSurveys = [
  { id: 'DAS001', date: '2025-11-08', location: 'Hot Lab', doseRate: 2.5, units: 'mR/hr', status: 'Green', technologist: 'MK' },
  { id: 'DAS002', date: '2025-11-08', location: 'Nuclear Medicine Camera', doseRate: 1.8, units: 'mR/hr', status: 'Green', technologist: 'JB' },
  { id: 'DAS003', date: '2025-11-07', location: 'PET Camera', doseRate: 3.2, units: 'mR/hr', status: 'Yellow', technologist: 'NB' },
]

const formatDateMMDDYY = (dateStr: string) => {
  const date = new Date(dateStr + 'T00:00:00')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const year = String(date.getFullYear()).slice(-2)
  return `${month}/${day}/${year}`
}

export function DailyAreaSurvey() {
  const [surveys, setSurveys] = useState(sampleSurveys)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    location: locations[0],
    doseRate: '',
    units: 'mR/hr',
    technologist: technologistInitials[0],
  })

  const getStatus = (doseRate: number) => {
    if (doseRate < 2.0) return 'Green'
    if (doseRate < 5.0) return 'Yellow'
    return 'Red'
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.doseRate) {
      const newSurvey = {
        id: `DAS${String(surveys.length + 1).padStart(3, '0')}`,
        date: formData.date,
        location: formData.location,
        doseRate: parseFloat(formData.doseRate),
        units: formData.units,
        status: getStatus(parseFloat(formData.doseRate)),
        technologist: formData.technologist,
      }
      setSurveys([newSurvey, ...surveys])
      setFormData({
        date: new Date().toISOString().split('T')[0],
        location: locations[0],
        doseRate: '',
        units: 'mR/hr',
        technologist: technologistInitials[0],
      })
    }
  }

  const deleteSurvey = (id: string) => {
    setSurveys(surveys.filter((s) => s.id !== id))
  }

  const exportToExcel = () => {
    const ws_data = [
      ['Daily Area Survey Report'],
      [`Generated: ${new Date().toLocaleString()}`],
      [],
      ['ID', 'Date', 'Location', 'Dose Rate', 'Units', 'Status', 'Technologist'],
      ...surveys.map((survey) => [
        survey.id,
        formatDateMMDDYY(survey.date),
        survey.location,
        survey.doseRate,
        survey.units,
        survey.status,
        survey.technologist,
      ]),
    ]

    const ws = XLSX.utils.aoa_to_sheet(ws_data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Daily Survey')
    XLSX.writeFile(wb, `daily-area-survey-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const greenCount = surveys.filter((s) => s.status === 'Green').length
  const yellowCount = surveys.filter((s) => s.status === 'Yellow').length
  const redCount = surveys.filter((s) => s.status === 'Red').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Daily Area Survey</h3>
          <p className="text-sm text-gray-600 mt-1">{surveys.length} surveys recorded</p>
        </div>
        <Button onClick={exportToExcel} className="bg-blue-900 hover:bg-blue-800">
          Export to Excel
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-xs text-gray-600 mb-1">Green</p>
          <p className="text-2xl font-bold text-green-600">{greenCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-gray-600 mb-1">Yellow</p>
          <p className="text-2xl font-bold text-yellow-600">{yellowCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-gray-600 mb-1">Red</p>
          <p className="text-2xl font-bold text-red-600">{redCount}</p>
        </Card>
      </div>

      {/* Add Survey Form */}
      <Card className="p-6 border-2 border-blue-900">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Record New Survey</h4>
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
              <Label htmlFor="doseRate">Dose Rate</Label>
              <Input
                id="doseRate"
                type="number"
                step="0.1"
                placeholder="Enter dose rate"
                value={formData.doseRate}
                onChange={(e) => setFormData({ ...formData, doseRate: e.target.value })}
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
            Record Survey
          </Button>
        </form>
      </Card>

      {/* Surveys Table */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Survey Records</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Location</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Dose Rate</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Status</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Technologist</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody>
              {surveys.map((survey) => (
                <tr key={survey.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 font-medium">{survey.id}</td>
                  <td className="py-3 px-4 text-gray-700">{formatDateMMDDYY(survey.date)}</td>
                  <td className="py-3 px-4 text-gray-700">{survey.location}</td>
                  <td className="text-center py-3 px-4 text-gray-700">
                    {survey.doseRate} {survey.units}
                  </td>
                  <td className="text-center py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        survey.status === 'Green'
                          ? 'bg-green-100 text-green-800'
                          : survey.status === 'Yellow'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {survey.status}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4 text-gray-700">{survey.technologist}</td>
                  <td className="text-center py-3 px-4">
                    <button
                      onClick={() => deleteSurvey(survey.id)}
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
