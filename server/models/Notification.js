import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['task_assigned', 'deadline_near', 'project_created', 'task_completed', 'added_to_project'],
      required: true,
    },
    message: { type: String, required: true },
    relatedProject: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    relatedTask: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;