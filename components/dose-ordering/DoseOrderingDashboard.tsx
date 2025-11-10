'use client'

import { Card } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

/**
 * Dose Ordering Dashboard Component
 * Displays daily dose orders by vendor with visual charts
 * Shows metrics for the selected dose type (primary or secondary)
 */
interface DoseOrderingDashboardProps {
  doseType: 'primary' | 'secondary'
}

// Sample data for vendors and their daily orders
const vendorData = [
  { name: 'Vendor A', orders: 12, quantity: 45 },
  { name: 'Vendor B', orders: 8, quantity: 32 },
  { name: 'Vendor C', orders: 15, quantity: 58 },
  { name: 'Vendor D', orders: 10, quantity: 40 },
]

export function DoseOrderingDashboard({ doseType }: DoseOrderingDashboardProps) {
  // Calculate totals
  const totalOrders = vendorData.reduce((sum, v) => sum + v.orders, 0)
  const totalQuantity = vendorData.reduce((sum, v) => sum + v.quantity, 0)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Dose Type</p>
          <p className="text-2xl font-bold text-blue-900 capitalize">{doseType}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Total Orders Today</p>
          <p className="text-2xl font-bold text-blue-900">{totalOrders}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Total Quantity</p>
          <p className="text-2xl font-bold text-blue-900">{totalQuantity}</p>
        </Card>
      </div>

      {/* Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Daily Orders by Vendor
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={vendorData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="orders" fill="#1e3a8a" name="Orders" />
            <Bar dataKey="quantity" fill="#3b82f6" name="Quantity" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Vendor Details Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Vendor Summary
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Vendor</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Orders</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Quantity</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Avg/Order</th>
              </tr>
            </thead>
            <tbody>
              {vendorData.map((vendor) => (
                <tr key={vendor.name} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{vendor.name}</td>
                  <td className="text-right py-3 px-4 text-gray-700">{vendor.orders}</td>
                  <td className="text-right py-3 px-4 text-gray-700">{vendor.quantity}</td>
                  <td className="text-right py-3 px-4 text-gray-700">
                    {(vendor.quantity / vendor.orders).toFixed(1)}
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
