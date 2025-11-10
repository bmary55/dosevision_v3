'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DailyAreaSurvey } from '@/components/regulatory/DailyAreaSurvey'
import { WeeklyAreaSurvey } from '@/components/regulatory/WeeklyAreaSurvey'
import { SealedSourceInventory } from '@/components/regulatory/SealedSourceInventory'
import { TracerCheckInOut } from '@/components/regulatory/TracerCheckInOut'
import { PatientDoseInfo } from '@/components/regulatory/PatientDoseInfo'
import { HotLabInstruments } from '@/components/regulatory/HotLabInstruments'
import { DosimeterTracker } from '@/components/regulatory/DosimeterTracker'
import { WasteManagement } from '@/components/regulatory/WasteManagement'
import { ActionItems } from '@/components/regulatory/ActionItems'

/**
 * Regulatory Compliance Page
 * Main page with 9 tabs for all compliance areas
 */

type TabType = 'daily' | 'weekly' | 'sealed' | 'tracer' | 'patient' | 'hotlab' | 'dosimeter' | 'waste' | 'actions'

export default function RegulatoryPage() {
  const [activeTab, setActiveTab] = useState<TabType>('daily')

  const tabs: { id: TabType; label: string; line: 1 | 2 }[] = [
    { id: 'daily', label: 'Daily Area Survey', line: 1 },
    { id: 'weekly', label: 'Weekly Area Survey', line: 1 },
    { id: 'sealed', label: 'Sealed Source Inventory', line: 1 },
    { id: 'tracer', label: 'Tracer Check In/Out', line: 1 },
    { id: 'patient', label: 'Patient Dose Info', line: 2 },
    { id: 'hotlab', label: 'Hot Lab Instruments', line: 2 },
    { id: 'dosimeter', label: 'Dosimeter Tracker', line: 2 },
    { id: 'waste', label: 'Waste Management', line: 2 },
    { id: 'actions', label: 'Action Items', line: 2 },
  ]

  const line1Tabs = tabs.filter((t) => t.line === 1)
  const line2Tabs = tabs.filter((t) => t.line === 2)

  const renderContent = () => {
    switch (activeTab) {
      case 'daily':
        return <DailyAreaSurvey />
      case 'weekly':
        return <WeeklyAreaSurvey />
      case 'sealed':
        return <SealedSourceInventory />
      case 'tracer':
        return <TracerCheckInOut />
      case 'patient':
        return <PatientDoseInfo />
      case 'hotlab':
        return <HotLabInstruments />
      case 'dosimeter':
        return <DosimeterTracker />
      case 'waste':
        return <WasteManagement />
      case 'actions':
        return <ActionItems />
      default:
        return <DailyAreaSurvey />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Regulatory Compliance</h1>
          <p className="text-gray-600 mt-1">
            Manage all compliance requirements and regulatory tracking
          </p>
        </div>

        {/* Tabs - Line 1 */}
        <div className="flex flex-wrap gap-2 mb-3">
          {line1Tabs.map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              className={`whitespace-nowrap text-sm ${
                activeTab === tab.id
                  ? 'bg-blue-900 text-white hover:bg-blue-800'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300'
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Tabs - Line 2 */}
        <div className="flex flex-wrap gap-2 mb-8">
          {line2Tabs.map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              className={`whitespace-nowrap text-sm ${
                activeTab === tab.id
                  ? 'bg-blue-900 text-white hover:bg-blue-800'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300'
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Content */}
        <Card className="p-6">
          {renderContent()}
        </Card>
      </div>
    </div>
  )
}
