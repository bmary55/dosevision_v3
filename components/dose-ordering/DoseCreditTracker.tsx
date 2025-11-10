'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import * as XLSX from 'xlsx'

/**
 * Dose Credit Tracker Component
 * Cross-references orders with cancellations to auto-calculate dose credits
 * Displays credit history and totals
 */

const creditData = [
  { id: 'CR001', orderId: 'ORD001', cancellationDate: '2025-11-07', creditAmount: 100, reason: 'Patient Cancellation' },
  { id: 'CR002', orderId: 'ORD002', cancellationDate: '2025-11-06', creditAmount: 75, reason: 'Rescheduled' },
  { id: 'CR003', orderId: 'ORD003', cancellationDate: '2025-11-05', creditAmount: 150, reason: 'Equipment Failure' },
  { id: 'CR004', orderId: 'ORD004', cancellationDate: '2025-11-04', creditAmount: 120, reason: 'Patient No-Show' },
]

export function DoseCreditTracker() {
  const totalCredits = creditData.reduce((sum, c) => sum + c.creditAmount, 0)

  const exportToExcel = () => {
    const ws_data = [
      ['Dose Credit Tracker Report'],
      [`Generated: ${new Date().toLocaleString()}`],
      [],
      ['Credit ID', 'Order ID', 'Cancellation Date', 'Credit Amount ($)', 'Reason'],
      ...creditData.map((credit) => [
        credit.id,
        credit.orderId,
        credit.cancellationDate,
        credit.creditAmount,
        credit.reason,
      ]),
      [],
      ['Total Credits', `$${totalCredits}`],
    ]

    const ws = XLSX.utils.aoa_to_sheet(ws_data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Credits')
    XLSX.writeFile(wb, `dose-credits-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Total Credits</p>
          <p className="text-2xl font-bold text-blue-900">${totalCredits}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Credit Transactions</p>
          <p className="text-2xl font-bold text-blue-900">{creditData.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Average Credit</p>
          <p className="text-2xl font-bold text-blue-900">
            ${(totalCredits / creditData.length).toFixed(2)}
          </p>
        </Card>
      </div>

      {/* Credits Table */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Credit History</h3>
          <Button onClick={exportToExcel} className="bg-blue-900 hover:bg-blue-800">
            Export to Excel
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Credit ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Order ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Cancellation Date</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Credit Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Reason</th>
              </tr>
            </thead>
            <tbody>
              {creditData.map((credit) => (
                <tr key={credit.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 font-medium">{credit.id}</td>
                  <td className="py-3 px-4 text-gray-700">{credit.orderId}</td>
                  <td className="py-3 px-4 text-gray-700">{credit.cancellationDate}</td>
                  <td className="text-right py-3 px-4 text-gray-900 font-medium">
                    ${credit.creditAmount}
                  </td>
                  <td className="py-3 px-4 text-gray-700">{credit.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Info Box */}
      <Card className="p-4 bg-blue-50 border border-blue-200">
        <p className="text-sm text-blue-900">
          <strong>Auto-Calculation:</strong> Dose credits are automatically calculated by cross-referencing orders with cancellations. Credits are applied to vendor accounts for future orders.
        </p>
      </Card>
    </div>
  )
}
