/**
 * DoseVision Logo Component
 * Displays the DoseVision branding with the atomic/molecular structure logo image
 */
export function DoseVisionLogo() {
  return (
    <div className="flex items-center gap-3">
      {/* Logo Image */}
      <img
        src="/atomic-logo.png"
        alt="DoseVision Logo"
        width="40"
        height="40"
        className="flex-shrink-0"
      />
      
      {/* Text */}
      <div className="flex flex-col">
        <span className="text-lg font-bold text-blue-900">DoseVision</span>
        <span className="text-xs text-gray-600 leading-tight">Turning Data into Dose Assurance</span>
      </div>
    </div>
  )
}
