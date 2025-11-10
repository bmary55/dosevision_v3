'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'

/**
 * Patient Table Component
 * Displays 20-30 sample patients with their appointment status
 * Only confirmed appointments are used for ordering
 * Includes filtering and sorting capabilities
 */
interface PatientTableProps {
  doseType: 'primary' | 'secondary'
}

// Sample patient data - 25 patients
const samplePatients = [
  { id: 'P001', name: 'John Smith', patientId: 'MRN001', scanType: 'Thyroid', duration: 30, insurance: 'Blue Cross', status: 'Confirmed' },
  { id: 'P002', name: 'Sarah Johnson', patientId: 'MRN002', scanType: 'Cardiac', duration: 45, insurance: 'Aetna', status: 'Confirmed' },
  { id: 'P003', name: 'Michael Brown', patientId: 'MRN003', scanType: 'Bone', duration: 60, insurance: 'United', status: 'Pending' },
  { id: 'P004', name: 'Emily Davis', patientId: 'MRN004', scanType: 'Thyroid', duration: 30, insurance: 'Cigna', status: 'Confirmed' },
  { id: 'P005', name: 'David Wilson', patientId: 'MRN005', scanType: 'Renal', duration: 45, insurance: 'Blue Cross', status: 'Confirmed' },
  { id: 'P006', name: 'Jessica Martinez', patientId: 'MRN006', scanType: 'Cardiac', duration: 45, insurance: 'Aetna', status: 'Cancelled' },
  { id: 'P007', name: 'Robert Taylor', patientId: 'MRN007', scanType: 'Bone', duration: 60, insurance: 'United', status: 'Confirmed' },
  { id: 'P008', name: 'Lisa Anderson', patientId: 'MRN008', scanType: 'Thyroid', duration: 30, insurance: 'Cigna', status: 'Pending' },
  { id: 'P009', name: 'James Thomas', patientId: 'MRN009', scanType: 'Renal', duration: 45, insurance: 'Blue Cross', status: 'Confirmed' },
  { id: 'P010', name: 'Patricia Jackson', patientId: 'MRN010', scanType: 'Cardiac', duration: 45, insurance: 'Aetna', status: 'Confirmed' },
  { id: 'P011', name: 'Christopher White', patientId: 'MRN011', scanType: 'Bone', duration: 60, insurance: 'United', status: 'Confirmed' },
  { id: 'P012', name: 'Mary Harris', patientId: 'MRN012', scanType: 'Thyroid', duration: 30, insurance: 'Cigna', status: 'Pending' },
  { id: 'P013', name: 'Daniel Martin', patientId: 'MRN013', scanType: 'Renal', duration: 45, insurance: 'Blue Cross', status: 'Confirmed' },
  { id: 'P014', name: 'Jennifer Lee', patientId: 'MRN014', scanType: 'Cardiac', duration: 45, insurance: 'Aetna', status: 'Confirmed' },
  { id: 'P015', name: 'Mark Perez', patientId: 'MRN015', scanType: 'Bone', duration: 60, insurance: 'United', status: 'Cancelled' },
  { id: 'P016', name: 'Linda Thompson', patientId: 'MRN016', scanType: 'Thyroid', duration: 30, insurance: 'Cigna', status: 'Confirmed' },
  { id: 'P017', name: 'Paul Garcia', patientId: 'MRN017', scanType: 'Renal', duration: 45, insurance: 'Blue Cross', status: 'Confirmed' },
  { id: 'P018', name: 'Barbara Rodriguez', patientId: 'MRN018', scanType: 'Cardiac', duration: 45, insurance: 'Aetna', status: 'Pending' },
  { id: 'P019', name: 'Steven Clark', patientId: 'MRN019', scanType: 'Bone', duration: 60, insurance: 'United', status: 'Confirmed' },
  { id: 'P020', name: 'Donna Lewis', patientId: 'MRN020', scanType: 'Thyroid', duration: 30, insurance: 'Cigna', status: 'Confirmed' },
  { id: 'P021', name: 'Kevin Walker', patientId: 'MRN021', scanType: 'Renal', duration: 45, insurance: 'Blue Cross', status: 'Confirmed' },
  { id: 'P022', name: 'Carol Hall', patientId: 'MRN022', scanType: 'Cardiac', duration: 45, insurance: 'Aetna', status: 'Confirmed' },
  { id: 'P023', name: 'Brian Allen', patientId: 'MRN023', scanType: 'Bone', duration: 60, insurance: 'United', status: 'Pending' },
  { id: 'P024', name: 'Sandra Young', patientId: 'MRN024', scanType: 'Thyroid', duration: 30, insurance: 'Cigna', status: 'Confirmed' },
  { id: 'P025', name: 'Edward King', patientId: 'MRN025', scanType: 'Renal', duration: 45, insurance: 'Blue Cross', status: 'Confirmed' },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Confirmed':
      return 'bg-green-100 text-green-800'
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'Cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function PatientTable({ doseType }: PatientTableProps) {
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Filter patients based on status and search term
  const filteredPatients = samplePatients.filter((patient) => {
    const matchesStatus = !filterStatus || patient.status === filterStatus
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patientId.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Count confirmed appointments
  const confirmedCount = samplePatients.filter((p) => p.status === 'Confirmed').length

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total Patients</p>
          <p className="text-2xl font-bold text-blue-900">{samplePatients.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Confirmed</p>
          <p className="text-2xl font-bold text-green-600">{confirmedCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {samplePatients.filter((p) => p.status === 'Pending').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Cancelled</p>
          <p className="text-2xl font-bold text-red-600">
            {samplePatients.filter((p) => p.status === 'Cancelled').length}
          </p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by name or patient ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
          <select
            value={filterStatus || ''}
            onChange={(e) => setFilterStatus(e.target.value || null)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
          >
            <option value="">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </Card>

      {/* Patient Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Patient Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Patient ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Scan Type</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Duration (min)</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Insurance</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 font-medium">{patient.name}</td>
                  <td className="py-3 px-4 text-gray-700">{patient.patientId}</td>
                  <td className="py-3 px-4 text-gray-700">{patient.scanType}</td>
                  <td className="text-center py-3 px-4 text-gray-700">{patient.duration}</td>
                  <td className="py-3 px-4 text-gray-700">{patient.insurance}</td>
                  <td className="text-center py-3 px-4">
                    <Badge className={getStatusColor(patient.status)}>
                      {patient.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600 mt-4">
          Showing {filteredPatients.length} of {samplePatients.length} patients
        </p>
      </Card>

      {/* Note */}
      <Card className="p-4 bg-blue-50 border border-blue-200">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> Only patients with "Confirmed" appointment status are included in dose ordering calculations.
        </p>
      </Card>
    </div>
  )
}
