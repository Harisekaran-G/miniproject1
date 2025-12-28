import { Router, Request, Response } from 'express';
import { mockUsers } from '../data/mockData';

const router = Router();

/**
 * POST /api/login
 * Authenticates user with email and password
 */
router.post('/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user in mock database
    const user = mockUsers.find(
      u => u.email === email && u.password === password
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Success response (in production, return JWT token)
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      token: 'mock-jwt-token-' + user.id // Mock token for MVP
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
});

export { router as authRoutes };

