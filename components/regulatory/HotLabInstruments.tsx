'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import * as XLSX from 'xlsx'

/**
 * Hot Lab Instruments QC Component
 * Tracks quality control tests for hot lab instruments
 * Instruments: Capintec CRC-55, Ludlum Survey Meters
 * QC Tests: Survey Meter Battery Check, Constancy, Accuracy, Linearity, Geometry
 */

const instruments = ['Capintec CRC-55', 'Ludlum Survey Meter']
const qcTests = ['Survey Meter Battery Check (Daily)', 'Constancy (Daily)', 'Accuracy (Quarterly)', 'Linearity (Quarterly)', 'Geometry (Install Date & Repair Date)']
const technologistInitials = ['MK', 'JB', 'NB', 'MG']

const sampleQC = [
  { id: 'QC001', date: '2025-11-08', instrument: 'Capintec CRC-55', testType: 'Constancy (Daily)', result: 'Pass', technologist: 'MK', comments: 'Within acceptable range' },
  { id: 'QC002', date: '2025-11-08', instrument: 'Ludlum Survey Meter', testType: 'Survey Meter Battery Check (Daily)', result: 'Pass', technologist: 'JB', comments: 'Battery at 95%' },
  { id: 'QC003', date: '2025-11-07', instrument: 'Capintec CRC-55', testType: 'Accuracy (Quarterly)', result: 'Pass', technologist: 'NB', comments: 'Calibration verified' },
]

const formatDateMMDDYY = (dateStr: string) => {
  const date = new Date(dateStr + 'T00:00:00')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const year = String(date.getFullYear()).slice(-2)
  return `${month}/${day}/${year}`
}

export function HotLabInstruments() {
  const [qcRecords, setQcRecords] = useState(sampleQC)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    instrument: instruments[0],
    testType: qcTests[0],
    result: 'Pass',
    technologist: technologistInitials[0],
    comments: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.technologist) {
      const newRecord = {
        id: `QC${String(qcRecords.length + 1).padStart(3, '0')}`,
        date: formData.date,
        instrument: formData.instrument,
        testType: formData.testType,
        result: formData.result,
        technologist: formData.technologist,
        comments: formData.comments,
      }
      setQcRecords([newRecord, ...qcRecords])
      setFormData({
        date: new Date().toISOString().split('T')[0],
        instrument: instruments[0],
        testType: qcTests[0],
        result: 'Pass',
        technologist: technologistInitials[0],
        comments: '',
      })
    }
  }

  const deleteRecord = (id: string) => {
    setQcRecords(qcRecords.filter((r) => r.id !== id))
  }

  const passCount = qcRecords.filter((r) => r.result === 'Pass').length
  const failCount = qcRecords.filter((r) => r.result === 'Fail').length

  const exportToExcel = () => {
    const ws_data = [
      ['Hot Lab Instruments QC Report'],
      [`Generated: ${new Date().toLocaleString()}`],
      [],
      ['ID', 'Date', 'Instrument', 'Test Type', 'Result', 'Technologist', 'Comments'],
      ...qcRecords.map((record) => [
        record.id,
        formatDateMMDDYY(record.date),
        record.instrument,
        record.testType,
        record.result,
        record.technologist,
        record.comments,
      ]),
      [],
      ['Pass', passCount],
      ['Fail', failCount],
    ]

    const ws = XLSX.utils.aoa_to_sheet(ws_data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'QC Records')
    XLSX.writeFile(wb, `hot-lab-instruments-qc-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Hot Lab Instruments</h3>
          <p className="text-sm text-gray-600 mt-1">{qcRecords.length} QC records</p>
        </div>
        <Button onClick={exportToExcel} className="bg-blue-900 hover:bg-blue-800">
          Export to Excel
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <p className="text-xs text-gray-600 mb-1">Pass</p>
          <p className="text-2xl font-bold text-green-600">{passCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-gray-600 mb-1">Fail</p>
          <p className="text-2xl font-bold text-red-600">{failCount}</p>
        </Card>
      </div>

      {/* Add QC Record Form */}
      <Card className="p-6 border-2 border-blue-900">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Record QC Test</h4>
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
              <Label htmlFor="instrument">Instrument</Label>
              <select
                id="instrument"
                value={formData.instrument}
                onChange={(e) => setFormData({ ...formData, instrument: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {instruments.map((inst) => (
                  <option key={inst} value={inst}>
                    {inst}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="testType">Test Type</Label>
              <select
                id="testType"
                value={formData.testType}
                onChange={(e) => setFormData({ ...formData, testType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {qcTests.map((test) => (
                  <option key={test} value={test}>
                    {test}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="result">Result</Label>
              <select
                id="result"
                value={formData.result}
                onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="Pass">Pass</option>
                <option value="Fail">Fail</option>
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
            <div>
              <Label htmlFor="comments">Comments</Label>
              <Input
                id="comments"
                placeholder="Enter comments"
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              />
            </div>
          </div>

          <Button type="submit" className="bg-green-600 hover:bg-green-700">
            Record QC Test
          </Button>
        </form>
      </Card>

      {/* QC Records Table */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">QC Test Records</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Instrument</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Test Type</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Result</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Technologist</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Comments</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody>
              {qcRecords.map((record) => (
                <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 font-medium">{record.id}</td>
                  <td className="py-3 px-4 text-gray-700">{formatDateMMDDYY(record.date)}</td>
                  <td className="py-3 px-4 text-gray-700">{record.instrument}</td>
                  <td className="py-3 px-4 text-gray-700 text-xs">{record.testType}</td>
                  <td className="text-center py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        record.result === 'Pass'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {record.result}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4 text-gray-700">{record.technologist}</td>
                  <td className="py-3 px-4 text-gray-700 text-xs">{record.comments}</td>
                  <td className="text-center py-3 px-4">
                    <button
                      onClick={() => deleteRecord(record.id)}
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
