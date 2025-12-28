import { Router, Request, Response } from 'express';
import { calculateRoute } from '../data/mockData';

const router = Router();

/**
 * POST /api/getRoutes
 * Calculates route information between source and destination
 */
router.post('/getRoutes', (req: Request, res: Response) => {
  try {
    const { source, destination } = req.body;

    // Validation
    if (!source || !destination) {
      return res.status(400).json({
        success: false,
        message: 'Source and destination are required'
      });
    }

    // Calculate route using mock routing service
    const routeData = calculateRoute(source, destination);

    res.json({
      success: true,
      data: routeData
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error calculating route',
      error: error.message
    });
  }
});

export { router as routeRoutes };

