'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import * as XLSX from 'xlsx'

/**
 * Dosimeter Tracker Component
 * Tracks employee radiation exposure with monthly/quarterly/yearly totals
 */

const technologistInitials = ['MK', 'JB', 'NB', 'MG']

const sampleDosimeters = [
  { id: 'DM001', technologist: 'MK', monthlyDose: 12.5, quarterlyDose: 35.2, yearlyDose: 125.8, status: 'Green', lastUpdate: '2025-11-08' },
  { id: 'DM002', technologist: 'JB', monthlyDose: 8.3, quarterlyDose: 28.1, yearlyDose: 98.5, status: 'Green', lastUpdate: '2025-11-08' },
  { id: 'DM003', technologist: 'NB', monthlyDose: 15.2, quarterlyDose: 42.8, yearlyDose: 145.3, status: 'Yellow', lastUpdate: '2025-11-07' },
  { id: 'DM004', technologist: 'MG', monthlyDose: 10.1, quarterlyDose: 31.5, yearlyDose: 112.4, status: 'Green', lastUpdate: '2025-11-08' },
]

const formatDateMMDDYY = (dateStr: string) => {
  const date = new Date(dateStr + 'T00:00:00')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const year = String(date.getFullYear()).slice(-2)
  return `${month}/${day}/${year}`
}

export function DosimeterTracker() {
  const [dosimeters, setDosimeters] = useState(sampleDosimeters)
  const [formData, setFormData] = useState({
    technologist: technologistInitials[0],
    monthlyDose: '',
    quarterlyDose: '',
    yearlyDose: '',
  })

  const getStatus = (yearlyDose: number) => {
    if (yearlyDose < 100) return 'Green'
    if (yearlyDose < 200) return 'Yellow'
    return 'Red'
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.monthlyDose && formData.quarterlyDose && formData.yearlyDose) {
      const monthlyNum = parseFloat(formData.monthlyDose)
      const quarterlyNum = parseFloat(formData.quarterlyDose)
      const yearlyNum = parseFloat(formData.yearlyDose)

      const existingIndex = dosimeters.findIndex((d) => d.technologist === formData.technologist)
      
      if (existingIndex >= 0) {
        const updated = [...dosimeters]
        updated[existingIndex] = {
          ...updated[existingIndex],
          monthlyDose: monthlyNum,
          quarterlyDose: quarterlyNum,
          yearlyDose: yearlyNum,
          status: getStatus(yearlyNum),
          lastUpdate: new Date().toISOString().split('T')[0],
        }
        setDosimeters(updated)
      } else {
        const newDosimeter = {
          id: `DM${String(dosimeters.length + 1).padStart(3, '0')}`,
          technologist: formData.technologist,
          monthlyDose: monthlyNum,
          quarterlyDose: quarterlyNum,
          yearlyDose: yearlyNum,
          status: getStatus(yearlyNum),
          lastUpdate: new Date().toISOString().split('T')[0],
        }
        setDosimeters([newDosimeter, ...dosimeters])
      }

      setFormData({
        technologist: technologistInitials[0],
        monthlyDose: '',
        quarterlyDose: '',
        yearlyDose: '',
      })
    }
  }

  const deleteDosimeter = (id: string) => {
    setDosimeters(dosimeters.filter((d) => d.id !== id))
  }

  const greenCount = dosimeters.filter((d) => d.status === 'Green').length
  const yellowCount = dosimeters.filter((d) => d.status === 'Yellow').length
  const redCount = dosimeters.filter((d) => d.status === 'Red').length
  const avgYearlyDose = dosimeters.length > 0 ? (dosimeters.reduce((sum, d) => sum + d.yearlyDose, 0) / dosimeters.length).toFixed(1) : 0

  const exportToExcel = () => {
    const ws_data = [
      ['Dosimeter Tracker Report'],
      [`Generated: ${new Date().toLocaleString()}`],
      [],
      ['ID', 'Technologist', 'Monthly Dose (mrem)', 'Quarterly Dose (mrem)', 'Yearly Dose (mrem)', 'Status', 'Last Update'],
      ...dosimeters.map((dosimeter) => [
        dosimeter.id,
        dosimeter.technologist,
        dosimeter.monthlyDose,
        dosimeter.quarterlyDose,
        dosimeter.yearlyDose,
        dosimeter.status,
        formatDateMMDDYY(dosimeter.lastUpdate),
      ]),
      [],
      ['Green', greenCount],
      ['Yellow', yellowCount],
      ['Red', redCount],
      ['Average Yearly Dose', `${avgYearlyDose} mrem`],
    ]

    const ws = XLSX.utils.aoa_to_sheet(ws_data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Dosimeters')
    XLSX.writeFile(wb, `dosimeter-tracker-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Dosimeter Tracker</h3>
          <p className="text-sm text-gray-600 mt-1">{dosimeters.length} technologists tracked</p>
        </div>
        <Button onClick={exportToExcel} className="bg-blue-900 hover:bg-blue-800">
          Export to Excel
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
        <Card className="p-4">
          <p className="text-xs text-gray-600 mb-1">Avg Yearly Dose</p>
          <p className="text-2xl font-bold text-blue-900">{avgYearlyDose} mrem</p>
        </Card>
      </div>

      {/* Update Dosimeter Form */}
      <Card className="p-6 border-2 border-blue-900">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Update Dosimeter Reading</h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
              <Label htmlFor="monthlyDose">Monthly Dose (mrem)</Label>
              <Input
                id="monthlyDose"
                type="number"
                step="0.1"
                placeholder="Enter monthly dose"
                value={formData.monthlyDose}
                onChange={(e) => setFormData({ ...formData, monthlyDose: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="quarterlyDose">Quarterly Dose (mrem)</Label>
              <Input
                id="quarterlyDose"
                type="number"
                step="0.1"
                placeholder="Enter quarterly dose"
                value={formData.quarterlyDose}
                onChange={(e) => setFormData({ ...formData, quarterlyDose: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="yearlyDose">Yearly Dose (mrem)</Label>
              <Input
                id="yearlyDose"
                type="number"
                step="0.1"
                placeholder="Enter yearly dose"
                value={formData.yearlyDose}
                onChange={(e) => setFormData({ ...formData, yearlyDose: e.target.value })}
              />
            </div>
          </div>

          <Button type="submit" className="bg-green-600 hover:bg-green-700">
            Update Dosimeter
          </Button>
        </form>
      </Card>

      {/* Dosimeters Table */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Dosimeter Records</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Technologist</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Monthly (mrem)</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Quarterly (mrem)</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Yearly (mrem)</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Last Update</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody>
              {dosimeters.map((dosimeter) => (
                <tr key={dosimeter.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 font-medium">{dosimeter.id}</td>
                  <td className="py-3 px-4 text-gray-700">{dosimeter.technologist}</td>
                  <td className="text-center py-3 px-4 text-gray-700">{dosimeter.monthlyDose}</td>
                  <td className="text-center py-3 px-4 text-gray-700">{dosimeter.quarterlyDose}</td>
                  <td className="text-center py-3 px-4 text-gray-700">{dosimeter.yearlyDose}</td>
                  <td className="text-center py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        dosimeter.status === 'Green'
                          ? 'bg-green-100 text-green-800'
                          : dosimeter.status === 'Yellow'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {dosimeter.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{formatDateMMDDYY(dosimeter.lastUpdate)}</td>
                  <td className="text-center py-3 px-4">
                    <button
                      onClick={() => deleteDosimeter(dosimeter.id)}
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
