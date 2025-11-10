/**
 * MNK Logo Component
 * Displays the MNK initials in a dark navy blue square
 * Used in the top-left corner of each section
 */
export function MNKLogo() {
  return (
    <div className="flex items-center justify-center w-10 h-10 bg-blue-900 rounded-lg">
      <span className="text-white font-bold text-sm">MNK</span>
    </div>
  )
}
