'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import * as XLSX from 'xlsx'

/**
 * Weekly Area Survey Component
 * Tracks weekly radiation surveys with max/avg calculations
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

const sampleWeeklySurveys = [
  { id: 'WAS001', week: '2025-W45', location: 'Hot Lab', maxReading: 3.2, avgReading: 2.1, status: 'Green', technologist: 'MK' },
  { id: 'WAS002', week: '2025-W45', location: 'Nuclear Medicine Camera', maxReading: 2.5, avgReading: 1.8, status: 'Green', technologist: 'JB' },
  { id: 'WAS003', week: '2025-W44', location: 'PET Camera', maxReading: 4.1, avgReading: 3.2, status: 'Yellow', technologist: 'NB' },
]

export function WeeklyAreaSurvey() {
  const [surveys, setSurveys] = useState(sampleWeeklySurveys)
  const [formData, setFormData] = useState({
    week: new Date().toISOString().split('T')[0],
    location: locations[0],
    maxReading: '',
    avgReading: '',
    technologist: technologistInitials[0],
  })

  const getStatus = (maxReading: number) => {
    if (maxReading < 2.0) return 'Green'
    if (maxReading < 5.0) return 'Yellow'
    return 'Red'
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.maxReading && formData.avgReading) {
      const maxNum = parseFloat(formData.maxReading)
      const avgNum = parseFloat(formData.avgReading)
      const newSurvey = {
        id: `WAS${String(surveys.length + 1).padStart(3, '0')}`,
        week: formData.week,
        location: formData.location,
        maxReading: maxNum,
        avgReading: avgNum,
        status: getStatus(maxNum),
        technologist: formData.technologist,
      }
      setSurveys([newSurvey, ...surveys])
      setFormData({
        week: new Date().toISOString().split('T')[0],
        location: locations[0],
        maxReading: '',
        avgReading: '',
        technologist: technologistInitials[0],
      })
    }
  }

  const greenCount = surveys.filter((s) => s.status === 'Green').length
  const yellowCount = surveys.filter((s) => s.status === 'Yellow').length
  const redCount = surveys.filter((s) => s.status === 'Red').length

  const exportToExcel = () => {
    const ws_data = [
      ['Weekly Area Survey Report'],
      [`Generated: ${new Date().toLocaleString()}`],
      [],
      ['ID', 'Week', 'Location', 'Max Reading (mR/hr)', 'Avg Reading (mR/hr)', 'Status', 'Technologist'],
      ...surveys.map((survey) => [
        survey.id,
        survey.week,
        survey.location,
        survey.maxReading,
        survey.avgReading,
        survey.status,
        survey.technologist,
      ]),
      [],
      ['Green', greenCount],
      ['Yellow', yellowCount],
      ['Red', redCount],
    ]

    const ws = XLSX.utils.aoa_to_sheet(ws_data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Weekly Survey')
    XLSX.writeFile(wb, `weekly-area-survey-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  return (
    <div className="space-y-6">
      {/* Add Survey Form */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Survey</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="week">Week</Label>
              <Input
                id="week"
                type="date"
                value={formData.week}
                onChange={(e) => setFormData({ ...formData, week: e.target.value })}
              />
            </div>
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
              <Label htmlFor="maxReading">Max Reading (mR/hr)</Label>
              <Input
                id="maxReading"
                type="number"
                step="0.1"
                placeholder="Enter max reading"
                value={formData.maxReading}
                onChange={(e) => setFormData({ ...formData, maxReading: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="avgReading">Avg Reading (mR/hr)</Label>
              <Input
                id="avgReading"
                type="number"
                step="0.1"
                placeholder="Enter avg reading"
                value={formData.avgReading}
                onChange={(e) => setFormData({ ...formData, avgReading: e.target.value })}
              />
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
            Submit Survey
          </Button>
        </form>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Total Surveys</p>
          <p className="text-2xl font-bold text-blue-900">{surveys.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Green</p>
          <p className="text-2xl font-bold text-green-600">{greenCount}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Yellow</p>
          <p className="text-2xl font-bold text-yellow-600">{yellowCount}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Red</p>
          <p className="text-2xl font-bold text-red-600">{redCount}</p>
        </Card>
      </div>

      {/* Survey Records Table */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Survey Records</h3>
          <Button onClick={exportToExcel} className="bg-blue-900 hover:bg-blue-800">
            Export to Excel
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Week</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Location</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Max (mR/hr)</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Avg (mR/hr)</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Status</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Technologist</th>
              </tr>
            </thead>
            <tbody>
              {surveys.map((survey) => (
                <tr key={survey.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 font-medium">{survey.id}</td>
                  <td className="py-3 px-4 text-gray-700">{survey.week}</td>
                  <td className="py-3 px-4 text-gray-700">{survey.location}</td>
                  <td className="text-right py-3 px-4 text-gray-700">{survey.maxReading}</td>
                  <td className="text-right py-3 px-4 text-gray-700">{survey.avgReading}</td>
                  <td className="text-center py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      survey.status === 'Green' ? 'bg-green-100 text-green-800' :
                      survey.status === 'Yellow' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {survey.status}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4 text-gray-700">{survey.technologist}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
