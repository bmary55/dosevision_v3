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
    if (formData.patientName && formData.scanTime && formData.isotope && formData.insurance) {
      const newSchedule = {
        id: `SCH${String(schedules.length + 1).padStart(3, '0')}`,
        patientName: formData.patientName,
        date: formData.date,
        scanTime: formData.scanTime,
        isotope: formData.isotope,
        status: formData.status,
        insurance: formData.insurance,
      }
      setSchedules([newSchedule, ...schedules])
      setFormData({
        patientName: '',
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
      ['ID', 'Patient Name', 'Date', 'Scan Time', 'Isotope', 'Insurance', 'Status'],
      ...filteredSchedules.map((schedule) => [
        schedule.id,
        schedule.patientName,
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

  // Calendar view helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getSchedulesForDate = (date: string) => {
    return schedules.filter((s) => s.date === date)
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth)
    const days = []

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="bg-gray-50 p-2"></div>)
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const daySchedules = getSchedulesForDate(dateStr)
      const isToday = dateStr === new Date().toISOString().split('T')[0]

      days.push(
        <div
          key={day}
          className={`border p-2 min-h-24 ${isToday ? 'bg-blue-50 border-blue-300' : 'bg-white'}`}
        >
          <div className={`font-semibold mb-1 ${isToday ? 'text-blue-900' : 'text-gray-900'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {daySchedules.slice(0, 2).map((s) => (
              <div key={s.id} className="text-xs bg-blue-100 text-blue-800 p-1 rounded truncate">
                {s.patientName}
              </div>
            ))}
            {daySchedules.length > 2 && (
              <div className="text-xs text-gray-600">+{daySchedules.length - 2} more</div>
            )}
          </div>
        </div>
      )
    }

    return days
  }

  return (
    <div className="space-y-6">
      {/* Add Schedule Form */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Schedule</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="patientName">Patient Name</Label>
              <Input
                id="patientName"
                placeholder="Enter patient name"
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              />
            </div>
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
              <Label htmlFor="scanTime">Scan Time</Label>
              <Input
                id="scanTime"
                type="time"
                value={formData.scanTime}
                onChange={(e) => setFormData({ ...formData, scanTime: e.target.value })}
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
              <Label htmlFor="insurance">Insurance Provider</Label>
              <select
                id="insurance"
                value={formData.insurance}
                onChange={(e) => setFormData({ ...formData, insurance: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
              >
                <option value="">Select Insurance</option>
                <option>Blue Cross</option>
                <option>Aetna</option>
                <option>United Healthcare</option>
                <option>Cigna</option>
                <option>Humana</option>
                <option>Medicare</option>
              </select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
              >
                <option>Confirmed</option>
                <option>Pending Auth</option>
                <option>Scheduled</option>
                <option>Canceled</option>
              </select>
            </div>
          </div>
          <Button type="submit" className="bg-blue-900 hover:bg-blue-800">
            Add Schedule
          </Button>
        </form>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Total Schedules</p>
          <p className="text-2xl font-bold text-blue-900">{schedules.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Confirmed</p>
          <p className="text-2xl font-bold text-green-600">{confirmedCount}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Pending Auth</p>
          <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Scheduled</p>
          <p className="text-2xl font-bold text-blue-600">{scheduledCount}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Canceled</p>
          <p className="text-2xl font-bold text-red-600">{canceledCount}</p>
        </Card>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        <Button
          onClick={() => setViewMode('list')}
          variant={viewMode === 'list' ? 'default' : 'outline'}
          className={viewMode === 'list' ? 'bg-blue-900 hover:bg-blue-800' : ''}
        >
          List View
        </Button>
        <Button
          onClick={() => setViewMode('calendar')}
          variant={viewMode === 'calendar' ? 'default' : 'outline'}
          className={viewMode === 'calendar' ? 'bg-blue-900 hover:bg-blue-800' : ''}
        >
          Calendar View
        </Button>
        <Button onClick={exportToExcel} className="ml-auto bg-blue-900 hover:bg-blue-800">
          Export to Excel
        </Button>
      </div>

      {/* List View with Filters */}
      {viewMode === 'list' && (
        <>
          {/* Filters */}
          <Card className="p-6 bg-gray-50">
            <h4 className="font-semibold text-gray-900 mb-4">Filters</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="filterPatientName">Patient Name</Label>
                <Input
                  id="filterPatientName"
                  placeholder="Search patient..."
                  value={filterPatientName}
                  onChange={(e) => setFilterPatientName(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="filterStatus">Status</Label>
                <select
                  id="filterStatus"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 mt-2"
                >
                  <option value="all">All Statuses</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending Auth">Pending Auth</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Canceled">Canceled</option>
                </select>
              </div>
              <div>
                <Label htmlFor="filterInsurance">Insurance</Label>
                <select
                  id="filterInsurance"
                  value={filterInsurance}
                  onChange={(e) => setFilterInsurance(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 mt-2"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 mt-2"
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
            <Button
              onClick={() => {
                setFilterStatus('all')
                setFilterInsurance('all')
                setFilterIsotope('all')
                setFilterPatientName('')
              }}
              variant="outline"
              className="mt-4"
            >
              Clear Filters
            </Button>
          </Card>

          {/* Schedules Table */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Schedules ({filteredSchedules.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Patient Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Scan Time</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Isotope</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Insurance</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchedules.map((schedule) => (
                    <tr key={schedule.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900 font-medium">{schedule.id}</td>
                      <td className="py-3 px-4 text-gray-700">{schedule.patientName}</td>
                      <td className="py-3 px-4 text-gray-700">{formatDateMMDDYY(schedule.date)}</td>
                      <td className="py-3 px-4 text-gray-700">{schedule.scanTime}</td>
                      <td className="py-3 px-4 text-gray-700 text-xs">{schedule.isotope}</td>
                      <td className="py-3 px-4 text-gray-700">{schedule.insurance}</td>
                      <td className="text-center py-3 px-4">
                        <select
                          value={schedule.status}
                          onChange={(e) => updateStatus(schedule.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${
                            schedule.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                            schedule.status === 'Pending Auth' ? 'bg-yellow-100 text-yellow-800' :
                            schedule.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}
                        >
                          <option>Confirmed</option>
                          <option>Pending Auth</option>
                          <option>Scheduled</option>
                          <option>Canceled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="flex gap-2">
              <Button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                variant="outline"
                size="sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                variant="outline"
                size="sm"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-semibold text-gray-700 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {renderCalendar()}
          </div>
        </Card>
      )}
    </div>
  )
}
