/**
 * DoseVision Logo Component
 * Displays the DoseVision branding with the exact logo image
 */
export function DoseVisionLogo() {
  return (
    <div className="flex items-center gap-3">
      {/* Logo Image */}
      <img
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Ccircle cx='100' cy='100' r='95' fill='%23001f3f' stroke='%23001f3f' stroke-width='2'/%3E%3Ccircle cx='100' cy='100' r='85' fill='none' stroke='%23ffffff' stroke-width='3'/%3E%3Ccircle cx='100' cy='100' r='50' fill='%23ffffff'/%3E%3Ccircle cx='100' cy='50' r='15' fill='%23001f3f'/%3E%3Ccircle cx='150' cy='75' r='15' fill='%23001f3f'/%3E%3Ccircle cx='150' cy='125' r='15' fill='%23001f3f'/%3E%3Ccircle cx='100' cy='150' r='15' fill='%23001f3f'/%3E%3Ccircle cx='50' cy='125' r='15' fill='%23001f3f'/%3E%3Ccircle cx='50' cy='75' r='15' fill='%23001f3f'/%3E%3Cline x1='100' y1='100' x2='100' y2='50' stroke='%23001f3f' stroke-width='2'/%3E%3Cline x1='100' y1='100' x2='150' y2='75' stroke='%23001f3f' stroke-width='2'/%3E%3Cline x1='100' y1='100' x2='150' y2='125' stroke='%23001f3f' stroke-width='2'/%3E%3Cline x1='100' y1='100' x2='100' y2='150' stroke='%23001f3f' stroke-width='2'/%3E%3Cline x1='100' y1='100' x2='50' y2='125' stroke='%23001f3f' stroke-width='2'/%3E%3Cline x1='100' y1='100' x2='50' y2='75' stroke='%23001f3f' stroke-width='2'/%3E%3C/svg%3E"
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
