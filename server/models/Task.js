import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'review', 'completed'],
      default: 'todo',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    labels: [{ type: String }],
    deadline: { type: Date },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    checklist: [
      {
        text: { type: String, required: true },
        completed: { type: Boolean, default: false },
      },
    ],
    order: { type: Number, default: 0 }, // for kanban drag-drop ordering
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);
export default Task;