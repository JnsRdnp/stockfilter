import * as userService from '../services/userService.js';

export const getAllUsers = (req, res) => {
  const users = userService.getAll();
  res.json(users);
};

export const createUser = (req, res) => {
  const newUser = userService.create(req.body);
  res.status(201).json(newUser);
};

export default {
  getAllUsers,
  createUser,
  // etc.
};