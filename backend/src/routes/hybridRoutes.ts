import { Router, Request, Response } from 'express';
import { mockBusRoutes, mockTaxiData } from '../data/mockData';
import { optimizeRoute } from '../services/hybridOptimization';

const router = Router();

/**
 * POST /api/getHybridRecommendation
 * Returns optimized hybrid recommendation comparing all options
 */
router.post('/getHybridRecommendation', (req: Request, res: Response) => {
  try {
    const { source, destination } = req.body;

    // Validation
    if (!source || !destination) {
      return res.status(400).json({
        success: false,
        message: 'Source and destination are required'
      });
    }

    // Get bus options for the route
    const busOptions = mockBusRoutes.filter(
      bus => 
        bus.source.toLowerCase() === source.toLowerCase() &&
        bus.destination.toLowerCase() === destination.toLowerCase()
    );

    // If no exact match, use available buses
    const availableBuses = busOptions.length > 0 
      ? busOptions 
      : mockBusRoutes.filter(bus => bus.seatAvailable);

    // Get taxi options
    const taxiOptions = mockTaxiData.filter(taxi => taxi.available);

    // Run optimization algorithm
    const recommendation = optimizeRoute(availableBuses, taxiOptions);

    res.json({
      success: true,
      data: recommendation,
      source,
      destination
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error generating hybrid recommendation',
      error: error.message
    });
  }
});

export { router as hybridRoutes };

