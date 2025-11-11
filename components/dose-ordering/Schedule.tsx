'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useDoseOrdering } from '@/context/DoseOrderingContext'
import * as XLSX from 'xlsx'

/**
 * Schedule Component
 * Manages patient scan schedules with calendar and list views
 * Uses shared context for live data
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

const formatDateMMDDYY = (dateStr: string) => {
  const date = new Date(dateStr + 'T00:00:00')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const year = String(date.getFullYear()).slice(-2)
  return `${month}/${day}/${year}`
}

export function Schedule() {
  const { schedules, setSchedules } = useDoseOrdering()
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 10, 9))
  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    date: new Date().toISOString().split('T')[0],
    scanTime: '',
    isotope: '',
    status: 'Scheduled' as const,
    insurance: '',
  })
  const [isotopeSearch, setIsotopeSearch] = useState('')
  const [showIsotopeDropdown, setShowIsotopeDropdown] = useState(false)

  // Filters for list view
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterInsurance, setFilterInsurance] = useState<string>('all')
  const [filterIsotope, setFilterIsotope] = useState<string>('all')
  const [filterPatientName, setFilterPatientName] = useState<string>('')
  const [filterDate, setFilterDate] = useState<string>('')

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
    if (formData.patientName && formData.patientId && formData.scanTime && formData.isotope && formData.insurance) {
      const newSchedule = {
        id: `SCH${String(schedules.length + 1).padStart(3, '0')}`,
        patientName: formData.patientName,
        patientId: formData.patientId,
        date: formData.date,
        scanTime: formData.scanTime,
        isotope: formData.isotope,
        status: formData.status,
        insurance: formData.insurance,
      }
      setSchedules([newSchedule, ...schedules])
      setFormData({
        patientName: '',
        patientId: '',
        date: new Date().toISOString().split('T')[0],
        scanTime: '',
        isotope: '',
        status: 'Scheduled',
        insurance: '',
      })
    }
  }

  const updateStatus = (id: string, newStatus: string) => {
    setSchedules(schedules.map((s) => (s.id === id ? { ...s, status: newStatus as any } : s)))
  }

  // Apply filters
  let filteredSchedules = schedules
  if (filterStatus !== 'all') {
    filteredSchedules = filteredSchedules.filter((s) => s.status === filterStatus)
  }
  if (filterInsurance !== 'all') {
    filteredSchedules = filteredSchedules.filter((s) => s.insurance === filterInsurance)
  }
  if (filterIsotope !== 'all') {
    filteredSchedules = filteredSchedules.filter((s) => s.isotope === filterIsotope)
  }
  if (filterPatientName) {
    filteredSchedules = filteredSchedules.filter((s) =>
      s.patientName.toLowerCase().includes(filterPatientName.toLowerCase())
    )
  }
  if (filterDate) {
    filteredSchedules = filteredSchedules.filter((s) => s.date === filterDate)
  }

  const confirmedCount = schedules.filter((s) => s.status === 'Confirmed').length
  const pendingCount = schedules.filter((s) => s.status === 'Pending Auth').length
  const scheduledCount = schedules.filter((s) => s.status === 'Scheduled').length
  const canceledCount = schedules.filter((s) => s.status === 'Canceled').length

  const uniqueInsurances = [...new Set(schedules.map((s) => s.insurance))]
  const uniqueIsotopes = [...new Set(schedules.map((s) => s.isotope))]

  const exportToExcel = () => {
    const ws_data = [
      ['Schedule Report'],
      [`Generated: ${new Date().toLocaleString()}`],
      [],
      ['ID', 'Patient Name', 'Patient ID', 'Date', 'Scan Time', 'Isotope', 'Insurance', 'Status'],
      ...filteredSchedules.map((schedule) => [
        schedule.id,
        schedule.patientName,
        schedule.patientId,
        schedule.date,
        schedule.scanTime,
        schedule.isotope,
        schedule.insurance,
        schedule.status,
      ]),
      [],
      ['Confirmed', confirmedCount],
      ['Pending Auth', pendingCount],
      ['Scheduled', scheduledCount],
      ['Canceled', canceledCount],
    ]

    const ws = XLSX.utils.aoa_to_sheet(ws_data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Schedule')
    XLSX.writeFile(wb, `schedule-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Schedule Management</h3>
          <p className="text-sm text-gray-600 mt-1">
            {confirmedCount} confirmed appointments
          </p>
        </div>
        <Button onClick={exportToExcel} className="bg-blue-900 hover:bg-blue-800">
          Export to Excel
        </Button>
      </div>

      {/* Add New Schedule Form */}
      <Card className="p-6 bg-blue-50">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Add New Schedule</h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="patientName">Patient Name *</Label>
              <Input
                id="patientName"
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                placeholder="Enter patient name"
                required
              />
            </div>
            <div>
              <Label htmlFor="patientId">Patient ID *</Label>
              <Input
                id="patientId"
                value={formData.patientId}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                placeholder="Enter patient ID"
                required
              />
            </div>
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="scanTime">Scan Time *</Label>
              <Input
                id="scanTime"
                type="time"
                value={formData.scanTime}
                onChange={(e) => setFormData({ ...formData, scanTime: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="isotope">Isotope *</Label>
              <div className="relative">
                <Input
                  id="isotope"
                  value={isotopeSearch}
                  onChange={(e) => {
                    setIsotopeSearch(e.target.value)
                    setShowIsotopeDropdown(true)
                  }}
                  onFocus={() => setShowIsotopeDropdown(true)}
                  placeholder="Search isotope..."
                  required={!formData.isotope}
                />
                {showIsotopeDropdown && filteredIsotopes.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredIsotopes.map((iso) => (
                      <button
                        key={iso}
                        type="button"
                        onClick={() => handleIsotopeSelect(iso)}
                        className="w-full text-left px-4 py-2 hover:bg-blue-100 text-sm"
                      >
                        {iso}
                      </button>
                    ))}
                  </div>
                )}
                {formData.isotope && (
                  <div className="mt-2 text-sm text-gray-700">
                    Selected: <span className="font-semibold">{formData.isotope}</span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="insurance">Insurance *</Label>
              <Input
                id="insurance"
                value={formData.insurance}
                onChange={(e) => setFormData({ ...formData, insurance: e.target.value })}
                placeholder="Enter insurance provider"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800">
            Add Schedule
          </Button>
        </form>
      </Card>

      {/* View Mode Toggle */}
      <div className="flex gap-2">
        <Button
          onClick={() => setViewMode('list')}
          variant={viewMode === 'list' ? 'default' : 'outline'}
          className={viewMode === 'list' ? 'bg-blue-900' : ''}
        >
          List View
        </Button>
        <Button
          onClick={() => setViewMode('calendar')}
          variant={viewMode === 'calendar' ? 'default' : 'outline'}
          className={viewMode === 'calendar' ? 'bg-blue-900' : ''}
        >
          Calendar View
        </Button>
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Schedules</h4>
          
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div>
              <Label htmlFor="filterPatientName">Patient Name</Label>
              <Input
                id="filterPatientName"
                value={filterPatientName}
                onChange={(e) => setFilterPatientName(e.target.value)}
                placeholder="Filter by name"
              />
            </div>
            <div>
              <Label htmlFor="filterDate">Date</Label>
              <Input
                id="filterDate"
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="filterStatus">Status</Label>
              <select
                id="filterStatus"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Pending Auth">Pending Auth</option>
                <option value="Canceled">Canceled</option>
              </select>
            </div>
            <div>
              <Label htmlFor="filterInsurance">Insurance</Label>
              <select
                id="filterInsurance"
                value={filterInsurance}
                onChange={(e) => setFilterInsurance(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Insurance</option>
                {uniqueInsurances.map((ins) => (
                  <option key={ins} value={ins}>
                    {ins}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="filterIsotope">Isotope</Label>
              <select
                id="filterIsotope"
                value={filterIsotope}
                onChange={(e) => setFilterIsotope(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Isotopes</option>
                {uniqueIsotopes.map((iso) => (
                  <option key={iso} value={iso}>
                    {iso}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Patient Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Patient ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Scan Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Isotope</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Insurance</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedules.map((schedule) => (
                  <tr key={schedule.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900 font-medium">{schedule.id}</td>
                    <td className="py-3 px-4 text-gray-700">{schedule.patientName}</td>
                    <td className="py-3 px-4 text-gray-700 font-medium">{schedule.patientId}</td>
                    <td className="py-3 px-4 text-gray-700">{formatDateMMDDYY(schedule.date)}</td>
                    <td className="py-3 px-4 text-gray-700">{schedule.scanTime}</td>
                    <td className="py-3 px-4 text-gray-700 text-xs">{schedule.isotope}</td>
                    <td className="py-3 px-4 text-gray-700">{schedule.insurance}</td>
                    <td className="py-3 px-4">
                      <select
                        value={schedule.status}
                        onChange={(e) => updateStatus(schedule.id, e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-xs"
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Pending Auth">Pending Auth</option>
                        <option value="Canceled">Canceled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
