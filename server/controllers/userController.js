import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc All users (any logged-in user can view team members)
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort('name');
  res.json({ success: true, users });
});

// @desc Admin: update a user's role
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  user.role = role;
  await user.save();
  res.json({ success: true, user });
});

// @desc Admin: activate/deactivate a user
export const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  user.status = user.status === 'active' ? 'inactive' : 'active';
  await user.save();
  res.json({ success: true, user });
});

// @desc Admin: delete a user
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  await user.deleteOne();
  res.json({ success: true, message: 'User deleted' });
});