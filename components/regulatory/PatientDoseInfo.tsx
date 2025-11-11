'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import * as XLSX from 'xlsx'

/**
 * Patient Dose Log Component
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
  { 
    id: 'PD001', 
    date: '2025-11-08', 
    patientName: 'John Doe',
    patientDOB: '1965-03-15',
    patientID: 'P001',
    doseName: 'F18 FDG (Fluorodeoxyglucose)',
    preInjectionTime: '09:00',
    injectionTime: '09:15',
    postInjectionTime: '09:30',
    dose: 10.0, 
    technologist: 'MK' 
  },
  { 
    id: 'PD002', 
    date: '2025-11-08', 
    patientName: 'Jane Smith',
    patientDOB: '1972-07-22',
    patientID: 'P002',
    doseName: 'Ga-68 Dotatate (NetSpot)',
    preInjectionTime: '10:00',
    injectionTime: '10:15',
    postInjectionTime: '10:30',
    dose: 8.5, 
    technologist: 'JB' 
  },
  { 
    id: 'PD003', 
    date: '2025-11-07', 
    patientName: 'Robert Johnson',
    patientDOB: '1958-11-10',
    patientID: 'P003',
    doseName: 'F18 Florbetapir (Amyvid)',
    preInjectionTime: '14:00',
    injectionTime: '14:15',
    postInjectionTime: '14:30',
    dose: 9.2, 
    technologist: 'NB' 
  },
]

const formatDateMMDDYY = (dateStr: string) => {
  const date = new Date(dateStr + 'T00:00:00')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const year = String(date.getFullYear()).slice(-2)
  return `${month}/${day}/${year}`
}

export function PatientDoseInfo() {
  const [doses, setDoses] = useState(sampleDoses)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    patientName: '',
    patientDOB: '',
    patientID: '',
    doseName: isotopes[0],
    preInjectionTime: '',
    injectionTime: '',
    postInjectionTime: '',
    dose: '',
    technologist: technologistInitials[0],
  })
  const [isotopeSearch, setIsotopeSearch] = useState('')
  const [showIsotopeDropdown, setShowIsotopeDropdown] = useState(false)

  const filteredIsotopes = isotopes.filter((iso) =>
    iso.toLowerCase().includes(isotopeSearch.toLowerCase())
  )

  const handleIsotopeSelect = (iso: string) => {
    setFormData({ ...formData, doseName: iso })
    setIsotopeSearch('')
    setShowIsotopeDropdown(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.patientName && formData.patientID && formData.dose) {
      const newDose = {
        id: `PD${String(doses.length + 1).padStart(3, '0')}`,
        date: formData.date,
        patientName: formData.patientName,
        patientDOB: formData.patientDOB,
        patientID: formData.patientID,
        doseName: formData.doseName,
        preInjectionTime: formData.preInjectionTime,
        injectionTime: formData.injectionTime,
        postInjectionTime: formData.postInjectionTime,
        dose: parseFloat(formData.dose),
        technologist: formData.technologist,
      }
      setDoses([newDose, ...doses])
      setFormData({
        date: new Date().toISOString().split('T')[0],
        patientName: '',
        patientDOB: '',
        patientID: '',
        doseName: isotopes[0],
        preInjectionTime: '',
        injectionTime: '',
        postInjectionTime: '',
        dose: '',
        technologist: technologistInitials[0],
      })
    }
  }

  const deleteDose = (id: string) => {
    setDoses(doses.filter((d) => d.id !== id))
  }

  const totalDose = doses.reduce((sum, d) => sum + d.dose, 0)

  const exportToExcel = () => {
    const ws_data = [
      ['Patient Dose Log Report'],
      [`Generated: ${new Date().toLocaleString()}`],
      [],
      ['ID', 'Date', 'Patient Name', 'Patient ID', 'DOB', 'Isotope', 'Pre-Inj Time', 'Inj Time', 'Post-Inj Time', 'Dose (mCi)', 'Technologist'],
      ...doses.map((dose) => [
        dose.id,
        formatDateMMDDYY(dose.date),
        dose.patientName,
        dose.patientID,
        formatDateMMDDYY(dose.patientDOB),
        dose.doseName,
        dose.preInjectionTime,
        dose.injectionTime,
        dose.postInjectionTime,
        dose.dose,
        dose.technologist,
      ]),
      [],
      ['Total Dose', `${totalDose.toFixed(1)} mCi`],
    ]

    const ws = XLSX.utils.aoa_to_sheet(ws_data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Patient Doses')
    XLSX.writeFile(wb, `patient-dose-log-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Patient Dose Log</h3>
          <p className="text-sm text-gray-600 mt-1">{doses.length} patient doses recorded</p>
        </div>
        <Button onClick={exportToExcel} className="bg-blue-900 hover:bg-blue-800">
          Export to Excel
        </Button>
      </div>

      {/* Total Dose */}
      <Card className="p-4 bg-blue-50">
        <p className="text-xs text-gray-600 mb-1">Total Dose Administered</p>
        <p className="text-2xl font-bold text-blue-900">{totalDose.toFixed(1)} mCi</p>
      </Card>

      {/* Add Dose Form */}
      <Card className="p-6 border-2 border-blue-900">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Record Patient Dose</h4>
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
              <Label htmlFor="patientID">Patient ID</Label>
              <Input
                id="patientID"
                placeholder="e.g., P001"
                value={formData.patientID}
                onChange={(e) => setFormData({ ...formData, patientID: e.target.value })}
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
              <Label htmlFor="patientDOB">Patient DOB</Label>
              <Input
                id="patientDOB"
                type="date"
                value={formData.patientDOB}
                onChange={(e) => setFormData({ ...formData, patientDOB: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="doseName">Isotope</Label>
              <div className="relative">
                <Input
                  id="doseName"
                  placeholder="Search isotope..."
                  value={isotopeSearch || formData.doseName}
                  onChange={(e) => {
                    setIsotopeSearch(e.target.value)
                    setShowIsotopeDropdown(true)
                  }}
                  onFocus={() => setShowIsotopeDropdown(true)}
                />
                {showIsotopeDropdown && filteredIsotopes.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto z-10">
                    {filteredIsotopes.map((iso) => (
                      <button
                        key={iso}
                        type="button"
                        onClick={() => handleIsotopeSelect(iso)}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 text-sm"
                      >
                        {iso}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="preInjectionTime">Pre-Injection Time</Label>
              <Input
                id="preInjectionTime"
                type="time"
                value={formData.preInjectionTime}
                onChange={(e) => setFormData({ ...formData, preInjectionTime: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="injectionTime">Injection Time</Label>
              <Input
                id="injectionTime"
                type="time"
                value={formData.injectionTime}
                onChange={(e) => setFormData({ ...formData, injectionTime: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="postInjectionTime">Post-Injection Time</Label>
              <Input
                id="postInjectionTime"
                type="time"
                value={formData.postInjectionTime}
                onChange={(e) => setFormData({ ...formData, postInjectionTime: e.target.value })}
              />
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
            Record Dose
          </Button>
        </form>
      </Card>

      {/* Doses Table */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Patient Dose Records</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Patient Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Patient ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">DOB</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Isotope</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Dose (mCi)</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Technologist</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody>
              {doses.map((dose) => (
                <tr key={dose.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 font-medium">{dose.id}</td>
                  <td className="py-3 px-4 text-gray-700">{formatDateMMDDYY(dose.date)}</td>
                  <td className="py-3 px-4 text-gray-700">{dose.patientName}</td>
                  <td className="py-3 px-4 text-gray-700">{dose.patientID}</td>
                  <td className="py-3 px-4 text-gray-700">{formatDateMMDDYY(dose.patientDOB)}</td>
                  <td className="py-3 px-4 text-gray-700 text-xs">{dose.doseName}</td>
                  <td className="text-center py-3 px-4 text-gray-700">{dose.dose}</td>
                  <td className="text-center py-3 px-4 text-gray-700">{dose.technologist}</td>
                  <td className="text-center py-3 px-4">
                    <button
                      onClick={() => deleteDose(dose.id)}
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
