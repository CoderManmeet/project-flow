import Project from '../models/Project.js';
import Task from '../models/Task.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc Get all projects user is a member of or created
export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({
    $or: [{ createdBy: req.user._id }, { members: req.user._id }],
  })
    .populate('members', 'name email avatar')
    .populate('createdBy', 'name email avatar')
    .sort('-createdAt');

  // attach live progress % for each project
  const projectsWithProgress = await Promise.all(
    projects.map(async (project) => {
      const totalTasks = await Task.countDocuments({ project: project._id });
      const completedTasks = await Task.countDocuments({
        project: project._id,
        status: 'completed',
      });
      const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
      return { ...project.toObject(), progress, totalTasks, completedTasks };
    })
  );

  res.json({ success: true, projects: projectsWithProgress });
});

export const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('members', 'name email avatar')
    .populate('createdBy', 'name email avatar');

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  res.json({ success: true, project });
});

export const createProject = asyncHandler(async (req, res) => {
  const { title, description, deadline, color, members } = req.body;
  const project = await Project.create({
    title,
    description,
    deadline,
    color,
    members: members || [],
    createdBy: req.user._id,
  });
  res.status(201).json({ success: true, project });
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  Object.assign(project, req.body);
  await project.save();
  res.json({ success: true, project });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }
  await Task.deleteMany({ project: project._id }); // cascade delete tasks
  await project.deleteOne();
  res.json({ success: true, message: 'Project deleted' });
});