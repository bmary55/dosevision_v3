'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDoseOrdering } from '@/context/DoseOrderingContext'
import * as XLSX from 'xlsx'

/**
 * Health Insurance Component
 * Manages health insurance providers and their reimbursement percentages
 * Uses shared context for live data
 */

export function HealthInsurance() {
  const { insurances, setInsurances } = useDoseOrdering()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    reimbursementPercentage: 0,
    contactEmail: '',
    contactPhone: '',
  })

  const handleNewInsurance = () => {
    setEditingId(null)
    setFormData({
      id: `INS${String(insurances.length + 1).padStart(3, '0')}`,
      name: '',
      reimbursementPercentage: 0,
      contactEmail: '',
      contactPhone: '',
    })
    setShowForm(true)
  }

  const handleEditInsurance = (insurance: any) => {
    setEditingId(insurance.id)
    setFormData(insurance)
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.reimbursementPercentage > 0) {
      if (editingId) {
        setInsurances(insurances.map((i) => (i.id === editingId ? formData : i)))
      } else {
        setInsurances([...insurances, formData])
      }

      setShowForm(false)
      setFormData({
        id: '',
        name: '',
        reimbursementPercentage: 0,
        contactEmail: '',
        contactPhone: '',
      })
    }
  }

  const handleDeleteInsurance = (id: string) => {
    setInsurances(insurances.filter((i) => i.id !== id))
  }

  const exportToExcel = () => {
    const ws_data = [
      ['Health Insurance Reimbursement Report'],
      [`Generated: ${new Date().toLocaleString()}`],
      [],
      ['ID', 'Insurance Provider', 'Reimbursement %', 'Contact Email', 'Contact Phone'],
      ...insurances.map((insurance) => [
        insurance.id,
        insurance.name,
        `${insurance.reimbursementPercentage}%`,
        insurance.contactEmail,
        insurance.contactPhone,
      ]),
      [],
      ['Average Reimbursement', `${(insurances.reduce((sum, i) => sum + i.reimbursementPercentage, 0) / insurances.length).toFixed(1)}%`],
      ['Highest Reimbursement', `${Math.max(...insurances.map((i) => i.reimbursementPercentage))}%`],
      ['Lowest Reimbursement', `${Math.min(...insurances.map((i) => i.reimbursementPercentage))}%`],
    ]

    const ws = XLSX.utils.aoa_to_sheet(ws_data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Insurance')
    XLSX.writeFile(wb, `health-insurance-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const avgReimbursement = (insurances.reduce((sum, i) => sum + i.reimbursementPercentage, 0) / insurances.length).toFixed(1)
  const maxReimbursement = Math.max(...insurances.map((i) => i.reimbursementPercentage))
  const minReimbursement = Math.min(...insurances.map((i) => i.reimbursementPercentage))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Health Insurance Providers</h3>
          <p className="text-sm text-gray-600 mt-1">{insurances.length} insurance providers</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToExcel} className="bg-blue-900 hover:bg-blue-800">
            Export to Excel
          </Button>
          <Button onClick={handleNewInsurance} className="bg-green-600 hover:bg-green-700">
            + New Insurance
          </Button>
        </div>
      </div>

      {/* Add/Edit Insurance Form */}
      {showForm && (
        <Card className="p-6 border-2 border-blue-900">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-gray-900">
              {editingId ? 'Edit Insurance' : 'Add New Insurance'}
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
                <Label htmlFor="name">Insurance Provider Name</Label>
                <Input
                  id="name"
                  placeholder="Enter insurance name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="reimbursement">Reimbursement Percentage (%)</Label>
                <Input
                  id="reimbursement"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Enter percentage"
                  value={formData.reimbursementPercentage}
                  onChange={(e) => setFormData({ ...formData, reimbursementPercentage: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="email">Contact Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Contact Phone</Label>
                <Input
                  id="phone"
                  placeholder="Enter phone number"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="bg-blue-900 hover:bg-blue-800">
                {editingId ? 'Update Insurance' : 'Add Insurance'}
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

      {/* Insurance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insurances
          .sort((a, b) => b.reimbursementPercentage - a.reimbursementPercentage)
          .map((insurance) => (
            <Card key={insurance.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-lg">{insurance.name}</h4>
                  <p className="text-xs text-gray-500">{insurance.id}</p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEditInsurance(insurance)}
                    className="p-1 text-blue-900 hover:bg-blue-50 rounded"
                    title="Edit"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => handleDeleteInsurance(insurance.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Reimbursement Percentage */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Reimbursement Rate</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${insurance.reimbursementPercentage}%` }}
                    ></div>
                  </div>
                  <span className="text-2xl font-bold text-green-600">
                    {insurance.reimbursementPercentage}%
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-600">Email</p>
                  <p className="text-sm text-gray-900 break-all">{insurance.contactEmail}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Phone</p>
                  <p className="text-sm text-gray-900">{insurance.contactPhone}</p>
                </div>
              </div>
            </Card>
          ))}
      </div>

      {/* Summary Statistics */}
      <Card className="p-6 bg-blue-50">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Reimbursement Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Total Providers</p>
            <p className="text-2xl font-bold text-blue-900">{insurances.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Average Reimbursement</p>
            <p className="text-2xl font-bold text-blue-900">{avgReimbursement}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Highest Reimbursement</p>
            <p className="text-2xl font-bold text-green-600">{maxReimbursement}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Lowest Reimbursement</p>
            <p className="text-2xl font-bold text-orange-600">{minReimbursement}%</p>
          </div>
        </div>
      </Card>

      {/* Insurance Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">All Insurance Providers</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Provider Name</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Reimbursement %</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Phone</th>
              </tr>
            </thead>
            <tbody>
              {insurances
                .sort((a, b) => b.reimbursementPercentage - a.reimbursementPercentage)
                .map((insurance) => (
                  <tr key={insurance.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900 font-medium">{insurance.id}</td>
                    <td className="py-3 px-4 text-gray-700">{insurance.name}</td>
                    <td className="text-center py-3 px-4">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        {insurance.reimbursementPercentage}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{insurance.contactEmail}</td>
                    <td className="py-3 px-4 text-gray-700">{insurance.contactPhone}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
