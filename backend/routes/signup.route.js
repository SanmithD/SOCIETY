import express from 'express';
import { allUsers, changePassword, getUserById, login, signup, updateProfile, userProfile } from '../controllers/signup.controllers.js';
import authMiddleware from '../middleware/auth.middleware.js';

const signupRouter = express.Router();

signupRouter.post('/signup', signup);

signupRouter.post('/login', login);

signupRouter.get('/users', authMiddleware, allUsers);

signupRouter.get('/users/:id', authMiddleware, getUserById);

signupRouter.get('/profile', authMiddleware, userProfile);

signupRouter.put('/profile', authMiddleware, updateProfile);

signupRouter.put('/change-password', authMiddleware, changePassword);

export default signupRouter;