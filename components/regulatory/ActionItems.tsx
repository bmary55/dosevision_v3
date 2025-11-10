'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
]

export function ActionItems() {
  const [items, setItems] = useState(sampleActionItems)
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
        item.dueDate,
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

  return (
    <div className="space-y-6">
      {/* Add Action Item Form */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Action Item</h3>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
              >
                {priorities.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="assignee">Assignee</Label>
              <select
                id="assignee"
                value={formData.assignee}
                onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
              >
                {technologistInitials.map((init) => (
                  <option key={init} value={init}>
                    {init}
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
          </div>
          <Button type="submit" className="bg-blue-900 hover:bg-blue-800">
            Add Action Item
          </Button>
        </form>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Total Items</p>
          <p className="text-2xl font-bold text-blue-900">{items.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">In Progress</p>
          <p className="text-2xl font-bold text-blue-600">{inProgressCount}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Completed</p>
          <p className="text-2xl font-bold text-green-600">{completedCount}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Critical</p>
          <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
        </Card>
      </div>

      {/* Action Items Table */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Action Items</h3>
          <Button onClick={exportToExcel} className="bg-blue-900 hover:bg-blue-800">
            Export to Excel
          </Button>
        </div>
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
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className={`border-b border-gray-100 hover:bg-gray-50 ${item.completed ? 'opacity-60' : ''}`}>
                  <td className="py-3 px-4 text-gray-900 font-medium">{item.id}</td>
                  <td className="py-3 px-4 text-gray-700">{item.dueDate}</td>
                  <td className="py-3 px-4 text-gray-700">{item.title}</td>
                  <td className="text-center py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                      item.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                      item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4 text-gray-700">{item.assignee}</td>
                  <td className="text-center py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      item.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <Button
                      onClick={() => toggleComplete(item.id)}
                      variant="outline"
                      size="sm"
                      className={item.completed ? 'bg-green-50' : ''}
                    >
                      {item.completed ? '✓ Done' : 'Mark Done'}
                    </Button>
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
