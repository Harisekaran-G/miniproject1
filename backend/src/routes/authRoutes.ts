import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/User';

const router = Router();

/**
 * POST /api/login
 * Authenticates user with email and password
 */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// ... (Router import)

const JWT_SECRET = process.env.JWT_SECRET || 'SECRET_KEY';

// In-memory mock users for fallback
const mockUsers: any[] = [];

/**
 * POST /api/register
 * Register a new user or operator
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, role, name, phone } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: 'Email, password, and name are required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      email,
      password, // Will be hashed by pre-save hook
      name,
      role: role || 'user',
      phone
    });

    await user.save();

    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/login
 * Authenticates user with email and password
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Success response
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role || 'user',
      },
      token
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
});

export { router as authRoutes };

