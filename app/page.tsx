import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

/**
 * Home Page
 * Landing page with overview of the two main sections:
 * 1. Dose Ordering Optimization
 * 2. Regulatory Compliance
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-blue-900 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-4xl">DV</span>
            </div>
          </div>
          
          {/* Name */}
          <h1 className="text-5xl font-bold text-gray-900 mb-2">
            DoseVision
          </h1>
          
          {/* Slogan */}
          <p className="text-xl text-gray-600 mb-8">
            Turning Data into Dose Assurance
          </p>
          
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Comprehensive software for dose ordering optimization and regulatory compliance management in medical imaging facilities
          </p>
        </div>

        {/* Main Sections */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Dose Ordering Section */}
          <Card className="p-8 hover:shadow-lg transition-shadow">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Dose Ordering Optimization
              </h2>
            </div>
            <p className="text-gray-600 mb-6">
              Simplify and optimize your dose workflow with profit-driven, margin-focused ordering, centralized vendor coordination, and automatic dose credit reconciliation; all managed through one cohesive platform.
            </p>
            <ul className="space-y-3 mb-8 text-sm text-gray-700">
              <li>✓ Dose optimization that integrates financial parameters directly into the dose ordering workflow.</li>
              <li>✓ It uses automated logic to recommend the most cost-effective radiopharmaceutical and vendor, based on real-time vendor contracts, insurance reimbursement data, and unit pricing.</li>
              <li>✓ This ensures that users, such as technologists who may not have financial insight, can select the primary and secondary ordering options aligned with the organization's financial goals.</li>
            </ul>
            <Link href="/dose-ordering">
              <Button className="w-full bg-blue-900 hover:bg-blue-800">
                Access Dose Ordering
              </Button>
            </Link>
          </Card>

          {/* Regulatory Compliance Section */}
          <Card className="p-8 hover:shadow-lg transition-shadow">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Regulatory Compliance
              </h2>
            </div>
            <p className="text-gray-600 mb-6">
              Maintain compliance with comprehensive tracking, automated calculations, and exportable reports for all regulatory requirements.
            </p>
            <ul className="space-y-2 mb-8 text-sm text-gray-700">
              <li>✓ Daily & weekly area surveys</li>
              <li>✓ Sealed source inventory tracking</li>
              <li>✓ Tracer check-in/check-out management</li>
              <li>✓ Hot lab instruments QC</li>
              <li>✓ Dosimeter tracking & reporting</li>
              <li>✓ Waste management</li>
              <li>✓ Action items calendar</li>
            </ul>
            <Link href="/regulatory">
              <Button className="w-full bg-blue-900 hover:bg-blue-800">
                Access Regulatory
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Key Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Clean & Minimalist UI
              </h3>
              <p className="text-gray-600">
                Dark navy blue and light gray color scheme for professional appearance and reduced eye strain
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Real-Time Data
              </h3>
              <p className="text-gray-600">
                Live dashboards with instant updates for orders, compliance tracking, and inventory management
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Excel Export
              </h3>
              <p className="text-gray-600">
                Export all compliance data to Excel with conditional formatting for easy analysis and reporting
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
