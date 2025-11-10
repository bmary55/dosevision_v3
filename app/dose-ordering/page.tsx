'use client'

import { useState } from 'react'
import { DoseOrderingProvider } from '@/context/DoseOrderingContext'
import { Orders } from '@/components/dose-ordering/Orders'
import { Schedule } from '@/components/dose-ordering/Schedule'
import { VendorManagement } from '@/components/dose-ordering/VendorManagement'
import { HealthInsurance } from '@/components/dose-ordering/HealthInsurance'
import { DoseCredit } from '@/components/dose-ordering/DoseCredit'

export default function DoseOrderingPage() {
  const [activeTab, setActiveTab] = useState('dosing')

  return (
    <DoseOrderingProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dose Ordering System</h1>
            <p className="text-gray-600 mt-2">
              Intelligent dose ordering with live data integration from schedules, vendors, and insurance providers
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-gray-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab('dosing')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'dosing'
                  ? 'border-blue-900 text-blue-900'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              📋 Dose Ordering
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'schedule'
                  ? 'border-blue-900 text-blue-900'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              📅 Schedule
            </button>
            <button
              onClick={() => setActiveTab('vendors')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'vendors'
                  ? 'border-blue-900 text-blue-900'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              🏢 Vendors
            </button>
            <button
              onClick={() => setActiveTab('insurance')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'insurance'
                  ? 'border-blue-900 text-blue-900'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              🏥 Health Insurance
            </button>
            <button
              onClick={() => setActiveTab('credits')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'credits'
                  ? 'border-blue-900 text-blue-900'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              💳 Dose Credits
            </button>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'dosing' && <Orders />}
            {activeTab === 'schedule' && <Schedule />}
            {activeTab === 'vendors' && <VendorManagement />}
            {activeTab === 'insurance' && <HealthInsurance />}
            {activeTab === 'credits' && <DoseCredit />}
          </div>
        </div>
      </div>
    </DoseOrderingProvider>
  )
}
