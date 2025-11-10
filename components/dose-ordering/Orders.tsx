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
  avgReimbursement: number
  profitMargin: number
}

export function Orders() {
  const { schedules, vendors, insurances } = useDoseOrdering()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [orders, setOrders] = useState<OrderRecommendation[]>([])
  const [dateRange, setDateRange] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Build insurance reimbursement map from live data
  const insuranceReimbursement: { [key: string]: number } = {}
  insurances.forEach((ins) => {
    insuranceReimbursement[ins.name] = ins.reimbursementPercentage
  })

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

    // Count isotopes needed from confirmed schedules
    const isotopeCount: { [key: string]: number } = {}
    const isotopeInsurances: { [key: string]: string[] } = {}

    filteredSchedules.forEach((schedule) => {
      isotopeCount[schedule.isotope] = (isotopeCount[schedule.isotope] || 0) + 1
      if (!isotopeInsurances[schedule.isotope]) {
        isotopeInsurances[schedule.isotope] = []
      }
      isotopeInsurances[schedule.isotope].push(schedule.insurance)
    })

    // Calculate recommendations
    const recommendations: OrderRecommendation[] = []

    Object.entries(isotopeCount).forEach(([isotope, quantity]) => {
      // Calculate average reimbursement for this isotope from LIVE insurance data
      const insuranceList = isotopeInsurances[isotope]
      const avgReimbursement =
        insuranceList.reduce((sum, ins) => sum + (insuranceReimbursement[ins] || 0), 0) / insuranceList.length

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
        const profitMargin = (avgReimbursement / 100) * totalCost - totalCost

        recommendations.push({
          isotope,
          quantity,
          vendor: lowestCostVendor,
          unitPrice,
          totalCost,
          avgReimbursement,
          profitMargin,
        })
      }
    })

    setOrders(recommendations.sort((a, b) => b.quantity - a.quantity))
  }

  const totalOrderCost = orders.reduce((sum, order) => sum + order.totalCost, 0)
  const totalProfitMargin = orders.reduce((sum, order) => sum + order.profitMargin, 0)
  const totalQuantity = orders.reduce((sum, order) => sum + order.quantity, 0)
  const confirmedCount = schedules.filter((s) => s.status === 'Confirmed').length

  const exportToExcel = () => {
    const dateLabel =
      dateRange === 'single'
        ? selectedDate
        : dateRange === 'range'
          ? `${startDate} to ${endDate}`
          : 'All Dates'

    const ws_data = [
      ['Dose Ordering Report'],
      [`Generated: ${new Date().toLocaleString()}`],
      [`Date Filter: ${dateLabel}`],
      [`Based on Confirmed Appointments Only`],
      [`Data Source: Live Schedule, Vendor, and Insurance Data`],
      [],
      ['Isotope', 'Quantity', 'Vendor', 'Unit Price', 'Total Cost', 'Avg Reimbursement %', 'Profit Margin'],
      ...orders.map((order) => [
        order.isotope,
        order.quantity,
        order.vendor,
        `$${order.unitPrice}`,
        `$${order.totalCost.toFixed(2)}`,
        `${order.avgReimbursement.toFixed(1)}%`,
        `$${order.profitMargin.toFixed(2)}`,
      ]),
      [],
      ['Total Quantity', totalQuantity],
      ['Total Order Cost', `$${totalOrderCost.toFixed(2)}`],
      ['Total Profit Margin', `$${totalProfitMargin.toFixed(2)}`],
    ]

    const ws = XLSX.utils.aoa_to_sheet(ws_data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Orders')
    XLSX.writeFile(wb, `dose-ordering-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Intelligent Dose Ordering</h3>
        <p className="text-sm text-gray-600 mt-1">
          🔄 Live data from Schedule, Vendors, and Health Insurance pages | Based on confirmed appointments, highest reimbursement rates, and lowest vendor costs
        </p>
      </div>

      {/* Date Filter */}
      <Card className="p-6 bg-blue-50">
        <div className="space-y-4">
          <div>
            <Label className="text-base font-semibold">Filter by Date Range</Label>
            <div className="flex gap-4 mt-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="dateRange"
                  value="all"
                  checked={dateRange === 'all'}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">All Confirmed Appointments</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="dateRange"
                  value="single"
                  checked={dateRange === 'single'}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Single Date</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="dateRange"
                  value="range"
                  checked={dateRange === 'range'}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Date Range</span>
              </label>
            </div>
          </div>

          {dateRange === 'single' && (
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="singleDate">Select Date</Label>
                <Input
                  id="singleDate"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          )}

          {dateRange === 'range' && (
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          )}

          <Button onClick={calculateOrders} className="bg-blue-900 hover:bg-blue-800">
            Calculate Orders
          </Button>
        </div>
        <p className="text-sm text-gray-600 mt-4">
          📊 Total Confirmed Appointments: <strong>{confirmedCount}</strong> | Active Vendors: <strong>{vendors.length}</strong> | Insurance Providers: <strong>{insurances.length}</strong>
        </p>
      </Card>

      {/* Summary Statistics */}
      {orders.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-2">Total Isotopes</p>
            <p className="text-2xl font-bold text-blue-900">{orders.length}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-2">Total Quantity</p>
            <p className="text-2xl font-bold text-blue-900">{totalQuantity}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-2">Total Order Cost</p>
            <p className="text-2xl font-bold text-blue-900">${totalOrderCost.toFixed(2)}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-2">Projected Profit Margin</p>
            <p className="text-2xl font-bold text-green-600">${totalProfitMargin.toFixed(2)}</p>
          </Card>
        </div>
      )}

      {/* Orders Table */}
      {orders.length > 0 ? (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>
            <Button onClick={exportToExcel} className="bg-blue-900 hover:bg-blue-800">
              Export to Excel
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Isotope</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Qty</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Recommended Vendor</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Unit Price</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Total Cost</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Avg Reimbursement</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Profit Margin</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900 font-medium">{order.isotope}</td>
                    <td className="text-center py-3 px-4 text-gray-700 font-semibold">{order.quantity}</td>
                    <td className="py-3 px-4 text-gray-700">{order.vendor}</td>
                    <td className="text-right py-3 px-4 text-gray-700">${order.unitPrice}</td>
                    <td className="text-right py-3 px-4 text-gray-900 font-medium">${order.totalCost.toFixed(2)}</td>
                    <td className="text-center py-3 px-4">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        {order.avgReimbursement.toFixed(1)}%
                      </span>
                    </td>
                    <td className="text-right py-3 px-4 text-green-600 font-medium">${order.profitMargin.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Row */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 text-sm font-semibold">
              <div className="text-gray-900">TOTALS</div>
              <div className="text-center text-gray-900">{totalQuantity}</div>
              <div></div>
              <div></div>
              <div className="text-right text-gray-900">${totalOrderCost.toFixed(2)}</div>
              <div></div>
              <div className="text-right text-green-600">${totalProfitMargin.toFixed(2)}</div>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-gray-600 mb-4">Click "Calculate Orders" to generate recommendations based on confirmed appointments</p>
          <Button onClick={calculateOrders} className="bg-blue-900 hover:bg-blue-800">
            Calculate Orders
          </Button>
        </Card>
      )}

      {/* Information Card */}
      <Card className="p-6 bg-gray-50">
        <h4 className="font-semibold text-gray-900 mb-3">🔄 Live Data Integration</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>✓ Pulls <strong>live confirmed appointments</strong> from the Schedule page</li>
          <li>✓ Uses <strong>live vendor pricing</strong> from the Vendors page</li>
          <li>✓ Applies <strong>live insurance reimbursement rates</strong> from the Health Insurance page</li>
          <li>✓ Filters by date range (single date, date range, or all confirmed)</li>
          <li>✓ Calculates average insurance reimbursement rate for each isotope</li>
          <li>✓ Identifies the lowest-cost vendor for each isotope</li>
          <li>✓ Recommends optimal order quantities and vendors</li>
          <li>✓ Projects profit margins based on reimbursement rates</li>
        </ul>
      </Card>
    </div>
  )
}
