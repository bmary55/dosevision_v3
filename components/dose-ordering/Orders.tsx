'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDoseOrdering } from '@/context/DoseOrderingContext'
import * as XLSX from 'xlsx'

/**
 * Orders Component - Dose Ordering
 * Intelligent ordering system based on confirmed schedules, insurance reimbursement, and vendor pricing
 * Pulls LIVE data from Schedule, Vendors, and Health Insurance pages
 */

interface OrderRecommendation {
  isotope: string
  quantity: number
  vendor: string
  unitPrice: number
  totalCost: number
}

interface OrderDetail {
  date: string
  isotope: string
  vendor: string
  patientName: string
  patientId: string
  scanTime: string
  quantity: number
}

export function Orders() {
  const { schedules, vendors, insurances } = useDoseOrdering()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [orders, setOrders] = useState<OrderRecommendation[]>([])
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([])
  const [dateRange, setDateRange] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [noAppointmentsMessage, setNoAppointmentsMessage] = useState('')

  // Build vendor pricing map from live data
  const vendorPricing: { [key: string]: { [key: string]: number } } = {}
  vendors.forEach((vendor) => {
    vendorPricing[vendor.name] = vendor.pricing
  })

  const calculateOrders = () => {
    // Filter schedules based on date range and only CONFIRMED status
    let filteredSchedules = schedules.filter((s) => s.status === 'Confirmed')

    if (dateRange === 'single') {
      filteredSchedules = filteredSchedules.filter((s) => s.date === selectedDate)
    } else if (dateRange === 'range' && startDate && endDate) {
      filteredSchedules = filteredSchedules.filter((s) => s.date >= startDate && s.date <= endDate)
    }

    // Check if there are any confirmed appointments
    if (filteredSchedules.length === 0) {
      setNoAppointmentsMessage('No confirmed appointments found for the selected date.')
      setOrders([])
      setOrderDetails([])
      return
    }

    setNoAppointmentsMessage('')

    // Count isotopes needed from confirmed schedules
    const isotopeCount: { [key: string]: number } = {}
    const isotopeDetails: { [key: string]: OrderDetail[] } = {}

    filteredSchedules.forEach((schedule) => {
      isotopeCount[schedule.isotope] = (isotopeCount[schedule.isotope] || 0) + 1
      
      if (!isotopeDetails[schedule.isotope]) {
        isotopeDetails[schedule.isotope] = []
      }
      
      isotopeDetails[schedule.isotope].push({
        date: schedule.date,
        isotope: schedule.isotope,
        vendor: '', // Will be filled in
        patientName: schedule.patientName,
        patientId: schedule.patientId || 'N/A',
        scanTime: schedule.scanTime,
        quantity: 1
      })
    })

    // Calculate recommendations
    const recommendations: OrderRecommendation[] = []
    const allDetails: OrderDetail[] = []

    Object.entries(isotopeCount).forEach(([isotope, quantity]) => {
      // Find lowest cost vendor for this isotope from LIVE vendor data
      let lowestCostVendor = ''
      let lowestPrice = Infinity

      Object.entries(vendorPricing).forEach(([vendor, pricing]) => {
        if (pricing[isotope] && pricing[isotope] < lowestPrice) {
          lowestPrice = pricing[isotope]
          lowestCostVendor = vendor
        }
      })

      if (lowestCostVendor) {
        const unitPrice = vendorPricing[lowestCostVendor][isotope]
        const totalCost = unitPrice * quantity

        recommendations.push({
          isotope,
          quantity,
          vendor: lowestCostVendor,
          unitPrice,
          totalCost,
        })

        // Add details for this isotope
        if (isotopeDetails[isotope]) {
          isotopeDetails[isotope].forEach((detail) => {
            allDetails.push({
              ...detail,
              vendor: lowestCostVendor,
            })
          })
        }
      }
    })

    // Sort by vendor then isotope
    allDetails.sort((a, b) => {
      if (a.vendor !== b.vendor) return a.vendor.localeCompare(b.vendor)
      return a.isotope.localeCompare(b.isotope)
    })

    setOrders(recommendations.sort((a, b) => b.quantity - a.quantity))
    setOrderDetails(allDetails)
  }

  const formatDateMMDDYY = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const year = String(date.getFullYear()).slice(-2)
    return `${month}/${day}/${year}`
  }

  const totalOrderCost = orders.reduce((sum, order) => sum + order.totalCost, 0)
  const totalQuantity = orders.reduce((sum, order) => sum + order.quantity, 0)
  const confirmedCount = schedules.filter((s) => s.status === 'Confirmed').length

  // Group orders by vendor
  const ordersByVendor: { [key: string]: { [key: string]: number } } = {}
  orders.forEach((order) => {
    if (!ordersByVendor[order.vendor]) {
      ordersByVendor[order.vendor] = {}
    }
    ordersByVendor[order.vendor][order.isotope] = order.quantity
  })

  const exportToExcel = () => {
    const ws_data = [
      ['Dose Order Report'],
      [`Generated: ${new Date().toLocaleString()}`],
      [],
      ['Order Summary'],
      ['Total Orders', orders.length],
      ['Total Quantity', totalQuantity],
      ['Total Cost', `$${totalOrderCost.toFixed(2)}`],
      [],
      ['Orders by Vendor'],
      ...Object.entries(ordersByVendor).map(([vendor, isotopes]) => [
        vendor,
        Object.entries(isotopes)
          .map(([iso, qty]) => `${iso}: ${qty}`)
          .join(', '),
      ]),
      [],
      ['Order Details'],
      ['Date', 'Isotope', 'Vendor', 'Patient Name', 'Patient ID', 'Scan Time', 'Quantity'],
      ...orderDetails.map((detail) => [
        detail.date,
        detail.isotope,
        detail.vendor,
        detail.patientName,
        detail.patientId,
        detail.scanTime,
        detail.quantity,
      ]),
    ]

    const ws = XLSX.utils.aoa_to_sheet(ws_data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Orders')
    XLSX.writeFile(wb, `dose-orders-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Dose Ordering</h3>
          <p className="text-sm text-gray-600 mt-1">
            {confirmedCount} confirmed appointments available for ordering
          </p>
        </div>
        <Button onClick={exportToExcel} className="bg-blue-900 hover:bg-blue-800">
          Export to Excel
        </Button>
      </div>

      {/* Date Range Selection */}
      <Card className="p-6 bg-blue-50">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Select Date Range</h4>
        <div className="space-y-4">
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="single"
                checked={dateRange === 'single'}
                onChange={(e) => setDateRange(e.target.value)}
              />
              <span>Single Date</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="range"
                checked={dateRange === 'range'}
                onChange={(e) => setDateRange(e.target.value)}
              />
              <span>Date Range</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="all"
                checked={dateRange === 'all'}
                onChange={(e) => setDateRange(e.target.value)}
              />
              <span>All Dates</span>
            </label>
          </div>

          {dateRange === 'single' && (
            <div>
              <Label htmlFor="selectedDate">Select Date</Label>
              <Input
                id="selectedDate"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          )}

          {dateRange === 'range' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          )}

          <Button onClick={calculateOrders} className="bg-green-600 hover:bg-green-700">
            Calculate Orders
          </Button>
        </div>
      </Card>

      {/* No Appointments Message */}
      {noAppointmentsMessage && (
        <Card className="p-4 bg-yellow-50 border border-yellow-200">
          <p className="text-yellow-800">{noAppointmentsMessage}</p>
        </Card>
      )}

      {/* Summary Statistics */}
      {orders.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <p className="text-xs text-gray-600 mb-1">Total Orders</p>
            <p className="text-2xl font-bold text-blue-900">{orders.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-gray-600 mb-1">Total Quantity</p>
            <p className="text-2xl font-bold text-blue-900">{totalQuantity}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-gray-600 mb-1">Total Cost</p>
            <p className="text-2xl font-bold text-green-600">${totalOrderCost.toFixed(2)}</p>
          </Card>
        </div>
      )}

      {/* Orders by Vendor Summary */}
      {orders.length > 0 && (
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Orders by Vendor</h4>
          <div className="space-y-3">
            {Object.entries(ordersByVendor).map(([vendor, isotopes]) => (
              <div key={vendor} className="border-l-4 border-blue-900 pl-4">
                <p className="font-semibold text-gray-900">{vendor}</p>
                <div className="text-sm text-gray-600 mt-1">
                  {Object.entries(isotopes).map(([iso, qty]) => (
                    <div key={iso}>
                      {iso}: <span className="font-medium">{qty} unit(s)</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Order Details Table */}
      {orderDetails.length > 0 && (
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Isotope</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Vendor</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Patient Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Patient ID</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Scan Time</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Qty</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.map((detail, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-700">{formatDateMMDDYY(detail.date)}</td>
                    <td className="py-3 px-4 text-gray-700 text-xs">{detail.isotope}</td>
                    <td className="py-3 px-4 text-gray-700">{detail.vendor}</td>
                    <td className="py-3 px-4 text-gray-700">{detail.patientName}</td>
                    <td className="py-3 px-4 text-gray-900 font-medium">{detail.patientId}</td>
                    <td className="text-center py-3 px-4 text-gray-700">{detail.scanTime}</td>
                    <td className="text-center py-3 px-4 text-gray-700">{detail.quantity}</td>
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
