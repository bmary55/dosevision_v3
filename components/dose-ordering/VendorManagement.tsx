'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDoseOrdering } from '@/context/DoseOrderingContext'
import * as XLSX from 'xlsx'

/**
 * Vendor Management Component
 * Manages vendor information with pricing and availability
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

export function VendorManagement() {
  const { vendors, setVendors } = useDoseOrdering()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    paymentTerms: '',
    availableIsotopes: [] as string[],
    deliveryWindow: '',
    pricing: {} as { [key: string]: number },
  })

  const handleNewVendor = () => {
    setEditingId(null)
    setFormData({
      id: `V${String(vendors.length + 1).padStart(3, '0')}`,
      name: '',
      paymentTerms: '',
      availableIsotopes: [],
      deliveryWindow: '',
      pricing: {},
    })
    setShowForm(true)
  }

  const handleEditVendor = (vendor: any) => {
    setEditingId(vendor.id)
    setFormData(vendor)
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.paymentTerms && formData.availableIsotopes.length > 0) {
      if (editingId) {
        setVendors(vendors.map((v) => (v.id === editingId ? formData : v)))
      } else {
        setVendors([...vendors, formData])
      }

      setShowForm(false)
      setFormData({
        id: '',
        name: '',
        paymentTerms: '',
        availableIsotopes: [],
        deliveryWindow: '',
        pricing: {},
      })
    }
  }

  const handleDeleteVendor = (id: string) => {
    setVendors(vendors.filter((v) => v.id !== id))
  }

  const toggleIsotope = (isotope: string) => {
    const updated = formData.availableIsotopes.includes(isotope)
      ? formData.availableIsotopes.filter((i) => i !== isotope)
      : [...formData.availableIsotopes, isotope]
    setFormData({ ...formData, availableIsotopes: updated })
  }

  const updatePrice = (isotope: string, price: number) => {
    setFormData({
      ...formData,
      pricing: { ...formData.pricing, [isotope]: price },
    })
  }

  const exportToExcel = () => {
    const ws_data = [
      ['Vendor Management Report'],
      [`Generated: ${new Date().toLocaleString()}`],
      [],
      ['ID', 'Vendor Name', 'Payment Terms', 'Delivery Window', 'Available Isotopes', 'Pricing'],
      ...vendors.map((vendor) => [
        vendor.id,
        vendor.name,
        vendor.paymentTerms,
        vendor.deliveryWindow,
        vendor.availableIsotopes.join('; '),
        Object.entries(vendor.pricing)
          .map(([iso, price]) => `${iso}: $${price}`)
          .join('; '),
      ]),
    ]

    const ws = XLSX.utils.aoa_to_sheet(ws_data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Vendors')
    XLSX.writeFile(wb, `vendor-management-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Vendor Management</h3>
          <p className="text-sm text-gray-600 mt-1">{vendors.length} vendors</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToExcel} className="bg-blue-900 hover:bg-blue-800">
            Export to Excel
          </Button>
          <Button onClick={handleNewVendor} className="bg-green-600 hover:bg-green-700">
            + New Vendor
          </Button>
        </div>
      </div>

      {/* Add/Edit Vendor Form */}
      {showForm && (
        <Card className="p-6 border-2 border-blue-900">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-gray-900">
              {editingId ? 'Edit Vendor' : 'Add New Vendor'}
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
                <Label htmlFor="name">Vendor Name</Label>
                <Input
                  id="name"
                  placeholder="Enter vendor name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <Input
                  id="paymentTerms"
                  placeholder="e.g., Net 30"
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="deliveryWindow">Delivery Window</Label>
                <Input
                  id="deliveryWindow"
                  placeholder="e.g., 24-48 hours"
                  value={formData.deliveryWindow}
                  onChange={(e) => setFormData({ ...formData, deliveryWindow: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>Available Isotopes</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 max-h-64 overflow-y-auto border border-gray-200 p-3 rounded-lg">
                {isotopes.map((iso) => (
                  <label key={iso} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.availableIsotopes.includes(iso)}
                      onChange={() => toggleIsotope(iso)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">{iso}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label>Pricing for Selected Isotopes</Label>
              <div className="space-y-2 mt-2 max-h-64 overflow-y-auto border border-gray-200 p-3 rounded-lg">
                {formData.availableIsotopes.map((iso) => (
                  <div key={iso} className="flex gap-2 items-center">
                    <span className="text-sm text-gray-700 flex-1">{iso}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm">$</span>
                      <Input
                        type="number"
                        min="0"
                        step="10"
                        placeholder="Price"
                        value={formData.pricing[iso] || ''}
                        onChange={(e) => updatePrice(iso, parseFloat(e.target.value) || 0)}
                        className="w-24"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="bg-blue-900 hover:bg-blue-800">
                {editingId ? 'Update Vendor' : 'Add Vendor'}
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

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vendors.map((vendor) => (
          <Card key={vendor.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 text-lg">{vendor.name}</h4>
                <p className="text-xs text-gray-500">{vendor.id}</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEditVendor(vendor)}
                  className="p-1 text-blue-900 hover:bg-blue-50 rounded"
                  title="Edit"
                >
                  ✎
                </button>
                <button
                  onClick={() => handleDeleteVendor(vendor.id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                  title="Delete"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-gray-600">Payment Terms</p>
                <p className="text-gray-900 font-medium">{vendor.paymentTerms}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Delivery Window</p>
                <p className="text-gray-900 font-medium">{vendor.deliveryWindow}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-2">Available Isotopes ({vendor.availableIsotopes.length})</p>
                <div className="space-y-1">
                  {vendor.availableIsotopes.map((iso) => (
                    <div key={iso} className="text-xs bg-blue-50 text-blue-800 p-2 rounded">
                      {iso}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Vendors Table with Pricing */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">All Vendors with Pricing</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Vendor Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Payment Terms</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Delivery</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Isotopes</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Unit Pricing</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 font-medium">{vendor.id}</td>
                  <td className="py-3 px-4 text-gray-700">{vendor.name}</td>
                  <td className="py-3 px-4 text-gray-700">{vendor.paymentTerms}</td>
                  <td className="py-3 px-4 text-gray-700">{vendor.deliveryWindow}</td>
                  <td className="text-center py-3 px-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {vendor.availableIsotopes.length}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700 text-xs">
                    <div className="space-y-1">
                      {vendor.availableIsotopes.map((iso) => (
                        <div key={iso} className="flex justify-between gap-4">
                          <span className="font-medium">{iso}:</span>
                          <span className="text-blue-900 font-semibold">${vendor.pricing[iso] || 'N/A'}</span>
                        </div>
                      ))}
                    </div>
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
