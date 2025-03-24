import bcrypt from 'bcrypt';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import signupModel from '../models/signup.model.js';

const secretKey = process.env.JWT_SECRET;

const signup = async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new signupModel({ name, role : 'resident', email, password: hashedPassword, phoneNumber });
    await user.save();
    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await signupModel.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user._id, email: user.email }, secretKey, { expiresIn: '24h' });
    res.status(200).send({ user, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const allUsers = async (req, res) => {
  try {
    const users = await signupModel.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await signupModel.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const userProfile = async (req, res) => {
  try {
    const user = await signupModel.findById(req.user._id);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const user = await signupModel.findById(req.user._id);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    updates.forEach(update => user[update] = req.body[update]);
    await user.save();
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await signupModel.findById(req.user._id);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).send({ error: 'Invalid old password' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).send({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

export { allUsers, changePassword, getUserById, login, signup, updateProfile, userProfile };
