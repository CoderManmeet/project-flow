import Project from '../models/Project.js';
import Task from '../models/Task.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const projectFilter = { $or: [{ createdBy: userId }, { members: userId }] };
  const userProjects = await Project.find(projectFilter).select('_id');
  const projectIds = userProjects.map((p) => p._id);

  const [totalProjects, totalTasks, completedTasks, pendingTasks, lateTasks] = await Promise.all([
    Project.countDocuments(projectFilter),
    Task.countDocuments({ project: { $in: projectIds } }),
    Task.countDocuments({ project: { $in: projectIds }, status: 'completed' }),
    Task.countDocuments({ project: { $in: projectIds }, status: { $ne: 'completed' } }),
    Task.countDocuments({
      project: { $in: projectIds },
      status: { $ne: 'completed' },
      deadline: { $lt: new Date() },
    }),
  ]);

  // Task status breakdown for pie chart
  const statusBreakdown = await Task.aggregate([
    { $match: { project: { $in: projectIds } } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  // Task priority breakdown for bar chart
  const priorityBreakdown = await Task.aggregate([
    { $match: { project: { $in: projectIds } } },
    { $group: { _id: '$priority', count: { $sum: 1 } } },
  ]);

  res.json({
    success: true,
    stats: { totalProjects, totalTasks, completedTasks, pendingTasks, lateTasks },
    statusBreakdown,
    priorityBreakdown,
  });
});