'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDoseOrdering } from '@/context/DoseOrderingContext'
import * as XLSX from 'xlsx'

/**
 * Dose Credit Component
 * Tracks dose credits with submission and receipt dates
 * Uses shared context for live data
 */

const creditReasons = [
  'Dose decay - patient rescheduled',
  'Patient no-show',
  'Dose preparation error',
  'Equipment malfunction',
  'Patient cancellation',
  'Dose contamination',
  'Expired dose',
  'Other',
]

export function DoseCredit() {
  const { doseCredits, setDoseCredits, schedules } = useDoseOrdering()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    id: '',
    submittedDate: new Date().toISOString().split('T')[0],
    receivedDate: '',
    isotopeName: '',
    patientName: '',
    scheduleDate: '',
    reasonForCredit: '',
    patientId: '',
  })

  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterReason, setFilterReason] = useState<string>('all')

  const handleNewCredit = () => {
    setEditingId(null)
    setFormData({
      id: `DC${String(doseCredits.length + 1).padStart(3, '0')}`,
      submittedDate: new Date().toISOString().split('T')[0],
      receivedDate: '',
      isotopeName: '',
      patientName: '',
      scheduleDate: '',
      reasonForCredit: '',
      patientId: '',
    })
    setShowForm(true)
  }

  const handleEditCredit = (credit: any) => {
    setEditingId(credit.id)
    setFormData(credit)
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (
      formData.submittedDate &&
      formData.isotopeName &&
      formData.patientName &&
      formData.scheduleDate &&
      formData.reasonForCredit &&
      formData.patientId
    ) {
      if (editingId) {
        setDoseCredits(doseCredits.map((c) => (c.id === editingId ? formData : c)))
      } else {
        setDoseCredits([...doseCredits, formData])
      }

      setShowForm(false)
      setFormData({
        id: '',
        submittedDate: new Date().toISOString().split('T')[0],
        receivedDate: '',
        isotopeName: '',
        patientName: '',
        scheduleDate: '',
        reasonForCredit: '',
        patientId: '',
      })
    }
  }

  const handleDeleteCredit = (id: string) => {
    setDoseCredits(doseCredits.filter((c) => c.id !== id))
  }

  // Apply filters
  let filteredCredits = doseCredits
  if (filterStatus === 'pending') {
    filteredCredits = filteredCredits.filter((c) => !c.receivedDate)
  } else if (filterStatus === 'received') {
    filteredCredits = filteredCredits.filter((c) => c.receivedDate)
  }
  if (filterReason !== 'all') {
    filteredCredits = filteredCredits.filter((c) => c.reasonForCredit === filterReason)
  }

  const pendingCredits = doseCredits.filter((c) => !c.receivedDate).length
  const receivedCredits = doseCredits.filter((c) => c.receivedDate).length

  const exportToExcel = () => {
    const ws_data = [
      ['Dose Credit Report'],
      [`Generated: ${new Date().toLocaleString()}`],
      [],
      ['ID', 'Patient ID', 'Patient Name', 'Isotope', 'Schedule Date', 'Submitted Date', 'Received Date', 'Reason for Credit', 'Status'],
      ...filteredCredits.map((credit) => [
        credit.id,
        credit.patientId,
        credit.patientName,
        credit.isotopeName,
        credit.scheduleDate,
        credit.submittedDate,
        credit.receivedDate || 'Pending',
        credit.reasonForCredit,
        credit.receivedDate ? 'Received' : 'Pending',
      ]),
      [],
      ['Total Credits', doseCredits.length],
      ['Pending', pendingCredits],
      ['Received', receivedCredits],
    ]

    const ws = XLSX.utils.aoa_to_sheet(ws_data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Dose Credits')
    XLSX.writeFile(wb, `dose-credits-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const uniqueReasons = [...new Set(doseCredits.map((c) => c.reasonForCredit))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Dose Credits</h3>
          <p className="text-sm text-gray-600 mt-1">Track dose credits and reimbursements</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToExcel} className="bg-blue-900 hover:bg-blue-800">
            Export to Excel
          </Button>
          <Button onClick={handleNewCredit} className="bg-green-600 hover:bg-green-700">
            + New Credit
          </Button>
        </div>
      </div>

      {/* Add/Edit Credit Form */}
      {showForm && (
        <Card className="p-6 border-2 border-blue-900">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-gray-900">
              {editingId ? 'Edit Dose Credit' : 'Add New Dose Credit'}
            </h4>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patientId">Patient ID</Label>
                <Input
                  id="patientId"
                  placeholder="e.g., P001"
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                />
              </div>
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
                <Label htmlFor="isotopeName">Isotope Name</Label>
                <Input
                  id="isotopeName"
                  placeholder="e.g., F18 FDG (Fluorodeoxyglucose)"
                  value={formData.isotopeName}
                  onChange={(e) => setFormData({ ...formData, isotopeName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="scheduleDate">Schedule Date</Label>
                <Input
                  id="scheduleDate"
                  type="date"
                  value={formData.scheduleDate}
                  onChange={(e) => setFormData({ ...formData, scheduleDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="submittedDate">Submitted Date</Label>
                <Input
                  id="submittedDate"
                  type="date"
                  value={formData.submittedDate}
                  onChange={(e) => setFormData({ ...formData, submittedDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="receivedDate">Received Date (Optional)</Label>
                <Input
                  id="receivedDate"
                  type="date"
                  value={formData.receivedDate}
                  onChange={(e) => setFormData({ ...formData, receivedDate: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="reasonForCredit">Reason for Credit</Label>
                <select
                  id="reasonForCredit"
                  value={formData.reasonForCredit}
                  onChange={(e) => setFormData({ ...formData, reasonForCredit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 mt-2"
                >
                  <option value="">Select a reason</option>
                  {creditReasons.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="bg-blue-900 hover:bg-blue-800">
                {editingId ? 'Update Credit' : 'Add Credit'}
              </Button>
              <Button
                type="button"
                onClick={() => setShowForm(false)}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Total Credits</p>
          <p className="text-2xl font-bold text-blue-900">{doseCredits.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{pendingCredits}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Received</p>
          <p className="text-2xl font-bold text-green-600">{receivedCredits}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Completion Rate</p>
          <p className="text-2xl font-bold text-blue-900">
            {doseCredits.length > 0 ? ((receivedCredits / doseCredits.length) * 100).toFixed(0) : 0}%
          </p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 bg-gray-50">
        <h4 className="font-semibold text-gray-900 mb-4">Filters</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="filterStatus">Status</Label>
            <select
              id="filterStatus"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 mt-2"
            >
              <option value="all">All Credits</option>
              <option value="pending">Pending</option>
              <option value="received">Received</option>
            </select>
          </div>
          <div>
            <Label htmlFor="filterReason">Reason</Label>
            <select
              id="filterReason"
              value={filterReason}
              onChange={(e) => setFilterReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 mt-2"
            >
              <option value="all">All Reasons</option>
              {uniqueReasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Button
          onClick={() => {
            setFilterStatus('all')
            setFilterReason('all')
          }}
          variant="outline"
          className="mt-4"
        >
          Clear Filters
        </Button>
      </Card>

      {/* Dose Credits Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Dose Credits ({filteredCredits.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Patient ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Patient Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Isotope</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Schedule Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Submitted</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Received</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Reason</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Status</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCredits.map((credit) => (
                <tr key={credit.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 font-medium">{credit.id}</td>
                  <td className="py-3 px-4 text-gray-700">{credit.patientId}</td>
                  <td className="py-3 px-4 text-gray-700">{credit.patientName}</td>
                  <td className="py-3 px-4 text-gray-700 text-xs">{credit.isotopeName}</td>
                  <td className="py-3 px-4 text-gray-700">{credit.scheduleDate}</td>
                  <td className="py-3 px-4 text-gray-700">{credit.submittedDate}</td>
                  <td className="py-3 px-4 text-gray-700">{credit.receivedDate || '-'}</td>
                  <td className="py-3 px-4 text-gray-700 text-xs">{credit.reasonForCredit}</td>
                  <td className="text-center py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        credit.receivedDate
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {credit.receivedDate ? 'Received' : 'Pending'}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <div className="flex gap-1 justify-center">
                      <button
                        onClick={() => handleEditCredit(credit)}
                        className="p-1 text-blue-900 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => handleDeleteCredit(credit.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Information Card */}
      <Card className="p-6 bg-blue-50">
        <h4 className="font-semibold text-gray-900 mb-3">📋 Dose Credit Tracking</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>✓ Track dose credits from submission to receipt</li>
          <li>✓ Record patient information and isotope details</li>
          <li>✓ Document reasons for credits (decay, no-show, errors, etc.)</li>
          <li>✓ Monitor pending vs. received credits</li>
          <li>✓ Filter by status and reason for credit</li>
          <li>✓ Export credit data to Excel for reporting</li>
        </ul>
      </Card>
    </div>
  )
}
