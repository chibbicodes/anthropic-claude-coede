import { useState } from 'react'
import { useBudget } from '../contexts/BudgetContext'
import { Project, ProjectStatus, BudgetType } from '../types'
import { TrendingUp, Plus, Calendar, Filter, Edit2, Trash2 } from 'lucide-react'
import Modal from '../components/Modal'

export default function Projects() {
  const { appData, currentView, addProject, updateProject, deleteProject } = useBudget()
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<ProjectStatus | 'all'>('all')
  const [formData, setFormData] = useState<Partial<Project>>({
    name: '',
    budgetType: currentView === 'household' || currentView === 'business' ? currentView : 'household',
    status: 'planned',
    budget: 0,
    description: '',
    notes: '',
  })

  const filteredProjects = appData.projects.filter((project) => {
    const matchesBudget =
      currentView === 'combined' || project.budgetType === currentView
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus
    return matchesBudget && matchesStatus
  })

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setFormData(project)
      setSelectedProject(project)
    } else {
      setFormData({
        name: '',
        budgetType: currentView === 'household' || currentView === 'business' ? currentView : 'household',
        status: 'planned',
        budget: 0,
        description: '',
        notes: '',
      })
      setSelectedProject(null)
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProject(null)
    setFormData({
      name: '',
      budgetType: currentView === 'household' || currentView === 'business' ? currentView : 'household',
      status: 'planned',
      budget: 0,
      description: '',
      notes: '',
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) return

    if (selectedProject) {
      updateProject(selectedProject.id, formData)
    } else {
      addProject(formData as Omit<Project, 'id' | 'createdAt' | 'updatedAt'>)
    }
    handleCloseModal()
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this project? This cannot be undone.')) {
      deleteProject(id)
      if (selectedProject?.id === id) {
        setSelectedProject(null)
      }
    }
  }

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'planned':
        return 'bg-blue-100 text-blue-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'on_hold':
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: ProjectStatus) => {
    switch (status) {
      case 'planned':
        return 'Planned'
      case 'in_progress':
        return 'In Progress'
      case 'completed':
        return 'Completed'
      case 'on_hold':
        return 'On Hold'
    }
  }

  const calculateProjectSpent = (projectId: string) => {
    return appData.transactions
      .filter((t) => t.projectId === projectId && t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">
            {currentView === 'household'
              ? 'Track and manage your household projects and budgets'
              : currentView === 'business'
              ? 'Track profitability by performance, craft project, or event'
              : 'Track and manage all your projects'}
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Project
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-white rounded-lg shadow-sm p-4">
        <Filter className="w-5 h-5 text-gray-400" />
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as ProjectStatus | 'all')}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All</option>
            <option value="planned">Planned</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on_hold">On Hold</option>
          </select>
        </div>
      </div>

      {/* Project List */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Yet</h3>
          <p className="text-gray-600 mb-6">
            Get started by creating your first project
          </p>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => {
            const spent = calculateProjectSpent(project.id)
            const budget = project.budget || 0
            const remaining = budget - spent
            const percentUsed = budget > 0 ? (spent / budget) * 100 : 0

            return (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                    <span className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded ${getStatusColor(project.status)}`}>
                      {getStatusLabel(project.status)}
                    </span>
                  </div>
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleOpenModal(project)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {project.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                )}

                {project.budgetType === 'household' && budget > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Budgeted:</span>
                      <span className="font-medium text-gray-900">${budget.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Used so far:</span>
                      <span className="font-medium text-gray-900">${spent.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Still available:</span>
                      <span className={`font-medium ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${remaining.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          percentUsed > 100 ? 'bg-red-600' : percentUsed > 80 ? 'bg-yellow-600' : 'bg-green-600'
                        }`}
                        style={{ width: `${Math.min(percentUsed, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {project.budgetType === 'business' && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>Business Project</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Project Form Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={selectedProject ? 'Edit Project' : 'New Project'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget Type *
            </label>
            <select
              value={formData.budgetType}
              onChange={(e) => setFormData({ ...formData, budgetType: e.target.value as BudgetType })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="household">Household</option>
              <option value="business">Business</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="planned">Planned</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
            </select>
          </div>

          {formData.budgetType === 'household' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.budget || 0}
                  onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={formData.startDate || ''}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={formData.endDate || ''}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {selectedProject ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Project Detail Modal */}
      {selectedProject && !isModalOpen && (
        <Modal
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          title={selectedProject.name}
        >
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 text-sm font-medium rounded ${getStatusColor(selectedProject.status)}`}>
                {getStatusLabel(selectedProject.status)}
              </span>
              <span className="px-3 py-1 text-sm font-medium rounded bg-gray-100 text-gray-800">
                {selectedProject.budgetType === 'household' ? 'Household' : 'Business'}
              </span>
            </div>

            {selectedProject.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                <p className="text-gray-900">{selectedProject.description}</p>
              </div>
            )}

            {(selectedProject.startDate || selectedProject.endDate) && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Timeline</h3>
                <div className="flex items-center gap-2 text-gray-900">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {selectedProject.startDate && <span>{selectedProject.startDate}</span>}
                  {selectedProject.startDate && selectedProject.endDate && <span>→</span>}
                  {selectedProject.endDate && <span>{selectedProject.endDate}</span>}
                </div>
              </div>
            )}

            {selectedProject.budgetType === 'household' && selectedProject.budget && selectedProject.budget > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Budget Tracking</h3>
                <div className="space-y-3">
                  {(() => {
                    const spent = calculateProjectSpent(selectedProject.id)
                    const budget = selectedProject.budget
                    const remaining = budget - spent
                    const percentUsed = (spent / budget) * 100

                    return (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Budgeted:</span>
                          <span className="font-medium text-gray-900">${budget.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Used so far:</span>
                          <span className="font-medium text-gray-900">${spent.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Still available:</span>
                          <span className={`font-medium ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${remaining.toFixed(2)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              percentUsed > 100 ? 'bg-red-600' : percentUsed > 80 ? 'bg-yellow-600' : 'bg-green-600'
                            }`}
                            style={{ width: `${Math.min(percentUsed, 100)}%` }}
                          />
                        </div>
                        <p className="text-sm text-gray-600">
                          {percentUsed.toFixed(1)}% of budget used
                        </p>
                      </>
                    )
                  })()}
                </div>
              </div>
            )}

            {selectedProject.notes && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Notes</h3>
                <p className="text-gray-900 whitespace-pre-wrap">{selectedProject.notes}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setSelectedProject(null)
                  handleOpenModal(selectedProject)
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Project
              </button>
              <button
                onClick={() => setSelectedProject(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
