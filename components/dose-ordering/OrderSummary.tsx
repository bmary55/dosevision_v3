'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import * as XLSX from 'xlsx'

/**
 * Order Summary Component
 * Summarizes all placed orders based on selected dose type
 * Provides export to Excel functionality
 */
interface OrderSummaryProps {
  doseType: 'primary' | 'secondary'
}

const sampleOrders = [
  { id: 'ORD001', vendor: 'Vendor A', quantity: 5, date: '2025-11-08', status: 'Confirmed', total: 500 },
  { id: 'ORD002', vendor: 'Vendor B', quantity: 3, date: '2025-11-08', status: 'Pending', total: 300 },
  { id: 'ORD003', vendor: 'Vendor C', quantity: 7, date: '2025-11-08', status: 'Confirmed', total: 700 },
  { id: 'ORD004', vendor: 'Vendor A', quantity: 4, date: '2025-11-07', status: 'Delivered', total: 400 },
  { id: 'ORD005', vendor: 'Vendor D', quantity: 6, date: '2025-11-07', status: 'Confirmed', total: 600 },
]

export function OrderSummary({ doseType }: OrderSummaryProps) {
  const totalOrders = sampleOrders.length
  const totalQuantity = sampleOrders.reduce((sum, o) => sum + o.quantity, 0)
  const totalValue = sampleOrders.reduce((sum, o) => sum + o.total, 0)

  const exportToExcel = () => {
    // Create worksheet data
    const ws_data = [
      ['Order Summary Report'],
      [`Dose Type: ${doseType}`],
      [`Generated: ${new Date().toLocaleString()}`],
      [],
      ['Order ID', 'Vendor', 'Quantity', 'Date', 'Status', 'Total ($)'],
      ...sampleOrders.map((order) => [
        order.id,
        order.vendor,
        order.quantity,
        order.date,
        order.status,
        order.total,
      ]),
      [],
      ['Total Orders', totalOrders],
      ['Total Quantity', totalQuantity],
      ['Total Value', `$${totalValue}`],
    ]

    // Create workbook and worksheet
    const ws = XLSX.utils.aoa_to_sheet(ws_data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Orders')

    // Download file
    XLSX.writeFile(wb, `order-summary-${doseType}-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Total Orders</p>
          <p className="text-2xl font-bold text-blue-900">{totalOrders}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Total Quantity</p>
          <p className="text-2xl font-bold text-blue-900">{totalQuantity}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Total Value</p>
          <p className="text-2xl font-bold text-blue-900">${totalValue}</p>
        </Card>
      </div>

      {/* Orders Table */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {doseType.charAt(0).toUpperCase() + doseType.slice(1)} Dose Orders
          </h3>
          <Button onClick={exportToExcel} className="bg-blue-900 hover:bg-blue-800">
            Export to Excel
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Order ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Vendor</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Quantity</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Status</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Total</th>
              </tr>
            </thead>
            <tbody>
              {sampleOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 font-medium">{order.id}</td>
                  <td className="py-3 px-4 text-gray-700">{order.vendor}</td>
                  <td className="text-center py-3 px-4 text-gray-700">{order.quantity}</td>
                  <td className="py-3 px-4 text-gray-700">{order.date}</td>
                  <td className="text-center py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="text-right py-3 px-4 text-gray-900 font-medium">${order.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
