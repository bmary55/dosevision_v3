'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import * as XLSX from 'xlsx'

/**
 * Patient Dose Info Component
 * Tracks patient dose information for regulatory compliance
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

const sampleDoses = [
  { id: 'PD001', date: '2025-11-08', patientName: 'John Doe', isotope: 'F18 FDG (Fluorodeoxyglucose)', dose: 10.0, technologist: 'MK' },
  { id: 'PD002', date: '2025-11-08', patientName: 'Jane Smith', isotope: 'Ga-68 Dotatate (NetSpot)', dose: 8.5, technologist: 'JB' },
  { id: 'PD003', date: '2025-11-07', patientName: 'Robert Johnson', isotope: 'F18 Florbetapir (Amyvid)', dose: 9.2, technologist: 'NB' },
]

export function PatientDoseInfo() {
  const [doses, setDoses] = useState(sampleDoses)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    patientName: '',
    isotope: isotopes[0],
    dose: '',
    technologist: technologistInitials[0],
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
    if (formData.patientName && formData.dose) {
      const newDose = {
        id: `PD${String(doses.length + 1).padStart(3, '0')}`,
        date: formData.date,
        patientName: formData.patientName,
        isotope: formData.isotope,
        dose: parseFloat(formData.dose),
        technologist: formData.technologist,
      }
      setDoses([newDose, ...doses])
      setFormData({
        date: new Date().toISOString().split('T')[0],
        patientName: '',
        isotope: isotopes[0],
        dose: '',
        technologist: technologistInitials[0],
      })
    }
  }

  const totalDose = doses.reduce((sum, d) => sum + d.dose, 0)
  const averageDose = doses.length > 0 ? (totalDose / doses.length).toFixed(1) : 0

  const exportToExcel = () => {
    const ws_data = [
      ['Patient Dose Log'],
      [`Generated: ${new Date().toLocaleString()}`],
      [],
      ['ID', 'Date', 'Patient Name', 'Isotope', 'Dose (mCi)', 'Technologist'],
      ...doses.map((dose) => [
        dose.id,
        dose.date,
        dose.patientName,
        dose.isotope,
        dose.dose,
        dose.technologist,
      ]),
      [],
      ['Total Dose', `${totalDose.toFixed(1)} mCi`],
      ['Average Dose', `${averageDose} mCi`],
      ['Total Patients', doses.length],
    ]

    const ws = XLSX.utils.aoa_to_sheet(ws_data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Patient Doses')
    XLSX.writeFile(wb, `patient-dose-log-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  return (
    <div className="space-y-6">
      {/* Add Patient Dose Form */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Dose Log</h3>
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
              <Label htmlFor="patientName">Patient Name</Label>
              <Input
                id="patientName"
                placeholder="Enter patient name"
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
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
              <Label htmlFor="dose">Dose (mCi)</Label>
              <Input
                id="dose"
                type="number"
                step="0.1"
                placeholder="Enter dose"
                value={formData.dose}
                onChange={(e) => setFormData({ ...formData, dose: e.target.value })}
              />
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
          </div>
          <Button type="submit" className="bg-blue-900 hover:bg-blue-800">
            Add Dose Entry
          </Button>
        </form>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Total Patients</p>
          <p className="text-2xl font-bold text-blue-900">{doses.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Total Dose</p>
          <p className="text-2xl font-bold text-blue-900">{totalDose.toFixed(1)} mCi</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Average Dose</p>
          <p className="text-2xl font-bold text-blue-900">{averageDose} mCi</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Last Entry</p>
          <p className="text-2xl font-bold text-blue-900">{doses.length > 0 ? doses[0].date : 'N/A'}</p>
        </Card>
      </div>

      {/* Patient Dose Table */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Dose Log</h3>
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
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Patient Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Isotope</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Dose (mCi)</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Technologist</th>
              </tr>
            </thead>
            <tbody>
              {doses.map((dose) => (
                <tr key={dose.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 font-medium">{dose.id}</td>
                  <td className="py-3 px-4 text-gray-700">{dose.date}</td>
                  <td className="py-3 px-4 text-gray-700">{dose.patientName}</td>
                  <td className="py-3 px-4 text-gray-700">{dose.isotope}</td>
                  <td className="text-right py-3 px-4 text-gray-700">{dose.dose}</td>
                  <td className="text-center py-3 px-4 text-gray-700">{dose.technologist}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
