import Task from '../models/Task.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getTasksByProject = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ project: req.params.projectId })
    .populate('assignedTo', 'name email avatar')
    .sort('order');
  res.json({ success: true, tasks });
});

export const createTask = asyncHandler(async (req, res) => {
  const { title, description, priority, labels, deadline, assignedTo, project, status } = req.body;

  const lastTask = await Task.findOne({ project, status: status || 'todo' }).sort('-order');
  const order = lastTask ? lastTask.order + 1 : 0;

  const task = await Task.create({
    title,
    description,
    priority,
    labels,
    deadline,
    assignedTo,
    project,
    status: status || 'todo',
    order,
    createdBy: req.user._id,
  });
  res.status(201).json({ success: true, task });
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  Object.assign(task, req.body);
  await task.save();
  res.json({ success: true, task });
});

// Special endpoint for Kanban drag-drop
export const moveTask = asyncHandler(async (req, res) => {
  const { status, order } = req.body; // new column + new position
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  task.status = status;
  task.order = order;
  await task.save();
  res.json({ success: true, task });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  await task.deleteOne();
  res.json({ success: true, message: 'Task deleted' });
});