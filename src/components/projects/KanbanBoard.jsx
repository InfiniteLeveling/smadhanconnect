import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { Input } from '../ui/Input';
import { 
  Plus, 
  Clock, 
  User, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  ListTodo,
  AlertCircle
} from 'lucide-react';

const COLUMNS = [
  { id: 'TODO', label: 'To Do', color: 'border-t-slate-400' },
  { id: 'IN_PROGRESS', label: 'In Progress', color: 'border-t-amber-500' },
  { id: 'REVIEW', label: 'Under Review', color: 'border-t-blue-500' },
  { id: 'DONE', label: 'Completed', color: 'border-t-emerald-500' }
];

export const KanbanBoard = ({ tasks, onUpdateStatus, onCreateTask, projectId }) => {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    assigneeName: '',
    dueDate: ''
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    await onCreateTask({
      ...taskForm,
      projectId,
      status: 'TODO'
    });
    setShowTaskModal(false);
    setTaskForm({
      title: '',
      description: '',
      priority: 'MEDIUM',
      assigneeName: '',
      dueDate: ''
    });
  };

  const getNextStatus = (current) => {
    switch (current) {
      case 'TODO': return 'IN_PROGRESS';
      case 'IN_PROGRESS': return 'REVIEW';
      case 'REVIEW': return 'DONE';
      default: return null;
    }
  };

  const getPrevStatus = (current) => {
    switch (current) {
      case 'DONE': return 'REVIEW';
      case 'REVIEW': return 'IN_PROGRESS';
      case 'IN_PROGRESS': return 'TODO';
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListTodo className="w-5 h-5 text-brand-600" />
          <h2 className="text-xl font-bold font-display text-slate-900">Sprint Kanban Board</h2>
        </div>

        <Button 
          variant="primary" 
          size="sm" 
          icon={Plus} 
          onClick={() => setShowTaskModal(true)}
        >
          Add Sprint Task
        </Button>
      </div>

      {/* 4 Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map((col) => {
          const columnTasks = tasks.filter(t => t.status === col.id);

          return (
            <div 
              key={col.id} 
              className={`bg-slate-100/70 rounded-2xl p-4 border border-slate-200/80 border-t-4 ${col.color} space-y-3 min-h-[350px] flex flex-col`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {col.label}
                </span>
                <span className="bg-white text-slate-700 text-xs px-2 py-0.5 rounded-full font-bold shadow-sm">
                  {columnTasks.length}
                </span>
              </div>

              <div className="space-y-3 flex-1">
                {columnTasks.length === 0 ? (
                  <div className="h-32 flex items-center justify-center text-slate-400 text-xs text-center border-2 border-dashed border-slate-200 rounded-xl">
                    No tasks in {col.label}
                  </div>
                ) : (
                  columnTasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <StatusBadge status={task.priority} />
                        {task.due_date && (
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {task.due_date}
                          </span>
                        )}
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-600 font-medium flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" />
                          {task.assignee_name || 'Unassigned'}
                        </span>

                        <div className="flex items-center gap-1">
                          {getPrevStatus(task.status) && (
                            <button
                              title="Move backward"
                              onClick={() => onUpdateStatus(task.id, getPrevStatus(task.status))}
                              className="p-1 hover:bg-slate-100 text-slate-500 rounded"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {getNextStatus(task.status) && (
                            <button
                              title="Move forward"
                              onClick={() => onUpdateStatus(task.id, getNextStatus(task.status))}
                              className="p-1 hover:bg-slate-100 text-slate-800 font-bold rounded"
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Creation Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold font-display text-slate-900">Add Sprint Kanban Task</h3>
              <button 
                onClick={() => setShowTaskModal(false)}
                className="text-slate-400 hover:text-slate-700 text-2xl font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <Input
                label="Task Title"
                placeholder="e.g. Conduct water titration assay #2"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                required
              />

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  className="w-full rounded-lg border-0 py-2.5 px-3 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-brand-500 text-sm"
                  rows="2"
                  placeholder="Task execution details..."
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>

                <Input
                  label="Due Date"
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                />
              </div>

              <Input
                label="Assignee Name"
                placeholder="e.g. Pooja Kumari (Lead Researcher)"
                value={taskForm.assigneeName}
                onChange={(e) => setTaskForm({ ...taskForm, assigneeName: e.target.value })}
              />

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => setShowTaskModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Create Task
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
