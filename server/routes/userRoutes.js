import express from 'express';
import { getUsers, updateUserRole, toggleUserStatus, deleteUser } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);

router.get('/', getUsers);
router.put('/:id/role', authorize('admin'), updateUserRole);
router.patch('/:id/status', authorize('admin'), toggleUserStatus);
router.delete('/:id', authorize('admin'), deleteUser);

export default router;