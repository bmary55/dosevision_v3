'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as XLSX from 'xlsx'

/**
 * Action Items Component
 * Calendar-based task management with priority levels and assignees
 */

const technologistInitials = ['MK', 'JB', 'NB', 'MG']
const priorities = ['Low', 'Medium', 'High', 'Critical']

const sampleActionItems = [
  { id: 'AI001', dueDate: '2025-11-10', title: 'Quarterly Accuracy Test - Capintec', priority: 'High', assignee: 'MK', status: 'Pending', completed: false },
  { id: 'AI002', dueDate: '2025-11-12', title: 'Sealed Source Inventory Check', priority: 'Medium', assignee: 'JB', status: 'In Progress', completed: false },
  { id: 'AI003', dueDate: '2025-11-08', title: 'Daily Area Survey - Hot Lab', priority: 'High', assignee: 'NB', status: 'Completed', completed: true },
  { id: 'AI004', dueDate: '2025-11-15', title: 'Dosimeter Exchange', priority: 'Medium', assignee: 'MG', status: 'Pending', completed: false },
  { id: 'AI005', dueDate: '2025-11-20', title: 'Monthly Compliance Review', priority: 'Critical', assignee: 'MK', status: 'Pending', completed: false },
]

const formatDateMMDDYY = (dateStr: string) => {
  const date = new Date(dateStr + 'T00:00:00')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const year = String(date.getFullYear()).slice(-2)
  return `${month}/${day}/${year}`
}

export function ActionItems() {
  const [items, setItems] = useState(sampleActionItems)
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 10, 11))
  const [formData, setFormData] = useState({
    dueDate: new Date().toISOString().split('T')[0],
    title: '',
    priority: 'Medium',
    assignee: technologistInitials[0],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.title) {
      const newItem = {
        id: `AI${String(items.length + 1).padStart(3, '0')}`,
        dueDate: formData.dueDate,
        title: formData.title,
        priority: formData.priority,
        assignee: formData.assignee,
        status: 'Pending',
        completed: false,
      }
      setItems([newItem, ...items])
      setFormData({
        dueDate: new Date().toISOString().split('T')[0],
        title: '',
        priority: 'Medium',
        assignee: technologistInitials[0],
      })
    }
  }

  const toggleComplete = (id: string) => {
    setItems(items.map((item) =>
      item.id === id
        ? { ...item, completed: !item.completed, status: !item.completed ? 'Completed' : 'Pending' }
        : item
    ))
  }

  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const pendingCount = items.filter((i) => i.status === 'Pending').length
  const inProgressCount = items.filter((i) => i.status === 'In Progress').length
  const completedCount = items.filter((i) => i.status === 'Completed').length
  const criticalCount = items.filter((i) => i.priority === 'Critical' && !i.completed).length

  const exportToExcel = () => {
    const ws_data = [
      ['Action Items Report'],
      [`Generated: ${new Date().toLocaleString()}`],
      [],
      ['ID', 'Due Date', 'Title', 'Priority', 'Assignee', 'Status', 'Completed'],
      ...items.map((item) => [
        item.id,
        formatDateMMDDYY(item.dueDate),
        item.title,
        item.priority,
        item.assignee,
        item.status,
        item.completed ? 'Yes' : 'No',
      ]),
      [],
      ['Pending', pendingCount],
      ['In Progress', inProgressCount],
      ['Completed', completedCount],
      ['Critical Items', criticalCount],
    ]

    const ws = XLSX.utils.aoa_to_sheet(ws_data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Action Items')
    XLSX.writeFile(wb, `action-items-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getItemsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return items.filter((item) => item.dueDate === dateStr)
  }

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth)
    const days = []

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      const dayItems = getItemsForDate(date)
      days.push(
        <div key={day} className="border border-gray-200 p-2 min-h-24 bg-white hover:bg-gray-50">
          <div className="font-semibold text-sm mb-1">{day}</div>
          <div className="space-y-1">
            {dayItems.slice(0, 2).map((item) => (
              <div
                key={item.id}
                className={`text-xs p-1 rounded truncate ${
                  item.priority === 'Critical'
                    ? 'bg-red-100 text-red-800'
                    : item.priority === 'High'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-blue-100 text-blue-800'
                }`}
              >
                {item.title}
              </div>
            ))}
            {dayItems.length > 2 && <div className="text-xs text-gray-500">+{dayItems.length - 2} more</div>}
          </div>
        </div>
      )
    }

    return days
  }

  const sortedItems = [...items].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Action Items</h3>
          <p className="text-sm text-gray-600 mt-1">{items.length} total items</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
            variant="outline"
          >
            {viewMode === 'list' ? 'Calendar View' : 'List View'}
          </Button>
          <Button onClick={exportToExcel} className="bg-blue-900 hover:bg-blue-800">
            Export to Excel
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs text-gray-600 mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-gray-600 mb-1">In Progress</p>
          <p className="text-2xl font-bold text-blue-600">{inProgressCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-gray-600 mb-1">Completed</p>
          <p className="text-2xl font-bold text-green-600">{completedCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-gray-600 mb-1">Critical</p>
          <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
        </Card>
      </div>

      {/* Add Action Item Form */}
      <Card className="p-6 border-2 border-blue-900">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Add Action Item</h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {priorities.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter action item title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="assignee">Assignee</Label>
              <select
                id="assignee"
                value={formData.assignee}
                onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {technologistInitials.map((tech) => (
                  <option key={tech} value={tech}>
                    {tech}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button type="submit" className="bg-green-600 hover:bg-green-700">
            Add Item
          </Button>
        </form>
      </Card>

      {/* View Toggle */}
      {viewMode === 'calendar' ? (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-gray-900">
              {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h4>
            <div className="flex gap-2">
              <button onClick={previousMonth} className="p-2 hover:bg-gray-100 rounded">
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-semibold text-sm text-gray-600 p-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
        </Card>
      ) : (
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Action Items List</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Due Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Title</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Priority</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Assignee</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Status</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedItems.map((item) => (
                  <tr key={item.id} className={`border-b border-gray-100 hover:bg-gray-50 ${item.completed ? 'opacity-60' : ''}`}>
                    <td className="py-3 px-4 text-gray-900 font-medium">{item.id}</td>
                    <td className="py-3 px-4 text-gray-700">{formatDateMMDDYY(item.dueDate)}</td>
                    <td className="py-3 px-4 text-gray-700">{item.title}</td>
                    <td className="text-center py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.priority === 'Critical'
                            ? 'bg-red-100 text-red-800'
                            : item.priority === 'High'
                              ? 'bg-orange-100 text-orange-800'
                              : item.priority === 'Medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {item.priority}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4 text-gray-700">{item.assignee}</td>
                    <td className="text-center py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === 'Completed'
                            ? 'bg-green-100 text-green-800'
                            : item.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4 space-x-2">
                      <button
                        onClick={() => toggleComplete(item.id)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                        title={item.completed ? 'Mark Incomplete' : 'Mark Complete'}
                      >
                        {item.completed ? '↩' : '✓'}
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                        title="Delete"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
