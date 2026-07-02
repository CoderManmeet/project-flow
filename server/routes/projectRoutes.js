import express from 'express';
import {
  getProjects, getProject, createProject, updateProject, deleteProject,
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect); // every route below requires login

router.route('/').get(getProjects).post(createProject);
router.route('/:id').get(getProject).put(updateProject).delete(deleteProject);

export default router;