import Task from '../models/Task.js';
import { createNotification } from '../utils/notificationHelper.js';

export const checkUpcomingDeadlines = async () => {
  const in24Hours = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const tasks = await Task.find({
    deadline: { $lte: in24Hours, $gte: new Date() },
    status: { $ne: 'completed' },
    deadlineNotified: false,
  }).populate('project', 'title').populate('assignedTo', '_id');

  for (const task of tasks) {
    const recipients = task.assignedTo.length > 0 ? task.assignedTo.map((u) => u._id) : [task.createdBy];
    for (const userId of recipients) {
      await createNotification({
        recipient: userId,
        type: 'deadline_near',
        message: `"${task.title}" is due soon in ${task.project.title}`,
        relatedProject: task.project._id,
        relatedTask: task._id,
      });
    }
    task.deadlineNotified = true;
    await task.save();
  }
};