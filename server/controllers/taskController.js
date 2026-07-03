import Task from '../models/Task.js';
import Project from '../models/Project.js';
import asyncHandler from '../utils/asyncHandler.js';
import { createNotification } from '../utils/notificationHelper.js';

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
    title, description, priority, labels, deadline, assignedTo,
    project, status: status || 'todo', order, createdBy: req.user._id,
  });

  // Notify assigned members
  if (assignedTo && assignedTo.length > 0) {
    const projectDoc = await Project.findById(project);
    for (const userId of assignedTo) {
      if (userId.toString() !== req.user._id.toString()) {
        await createNotification({
          recipient: userId,
          type: 'task_assigned',
          message: `You were assigned to "${title}" in ${projectDoc.title}`,
          relatedProject: project,
          relatedTask: task._id,
        });
      }
    }
  }

  res.status(201).json({ success: true, task });
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).populate('project', 'title createdBy');
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const wasCompleted = task.status === 'completed';
  const previousAssignees = task.assignedTo.map((id) => id.toString());

  Object.assign(task, req.body);
  await task.save();

  // Notify newly assigned members
  if (req.body.assignedTo) {
    const newAssignees = req.body.assignedTo.filter((id) => !previousAssignees.includes(id));
    for (const userId of newAssignees) {
      if (userId.toString() !== req.user._id.toString()) {
        await createNotification({
          recipient: userId,
          type: 'task_assigned',
          message: `You were assigned to "${task.title}"`,
          relatedProject: task.project._id,
          relatedTask: task._id,
        });
      }
    }
  }

  // Notify project owner when task newly completed
  if (!wasCompleted && task.status === 'completed') {
    const ownerId = task.project.createdBy.toString();
    if (ownerId !== req.user._id.toString()) {
      await createNotification({
        recipient: ownerId,
        type: 'task_completed',
        message: `"${task.title}" was marked completed in ${task.project.title}`,
        relatedProject: task.project._id,
        relatedTask: task._id,
      });
    }
  }

  res.json({ success: true, task });
});

export const moveTask = asyncHandler(async (req, res) => {
  const { status, order } = req.body;
  const task = await Task.findById(req.params.id).populate('project', 'title createdBy');
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const wasCompleted = task.status === 'completed';
  task.status = status;
  task.order = order;
  await task.save();

  if (!wasCompleted && status === 'completed') {
    const ownerId = task.project.createdBy.toString();
    if (ownerId !== req.user._id.toString()) {
      await createNotification({
        recipient: ownerId,
        type: 'task_completed',
        message: `"${task.title}" was marked completed in ${task.project.title}`,
        relatedProject: task.project._id,
        relatedTask: task._id,
      });
    }
  }

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

export const getAllTasksForUser = asyncHandler(async (req, res) => {
  const Project = (await import('../models/Project.js')).default;
  const userProjects = await Project.find({
    $or: [{ createdBy: req.user._id }, { members: req.user._id }],
  }).select('_id');
  const projectIds = userProjects.map((p) => p._id);

  const tasks = await Task.find({ project: { $in: projectIds }, deadline: { $exists: true, $ne: null } })
    .populate('project', 'title color')
    .sort('deadline');

  res.json({ success: true, tasks });
});