import { Router, Request, Response } from 'express';
import { mockBusRoutes, BusOption } from '../data/mockData';

const router = Router();

/**
 * POST /api/getBusOptions
 * Returns available bus options for a given route
 */
router.post('/getBusOptions', (req: Request, res: Response) => {
  try {
    const { source, destination } = req.body;

    // Validation
    if (!source || !destination) {
      return res.status(400).json({
        success: false,
        message: 'Source and destination are required'
      });
    }

    // Filter bus routes matching source and destination
    const matchingBuses = mockBusRoutes.filter(
      bus => 
        bus.source.toLowerCase() === source.toLowerCase() &&
        bus.destination.toLowerCase() === destination.toLowerCase()
    );

    // If no exact match, return buses with similar routes
    const availableBuses = matchingBuses.length > 0 
      ? matchingBuses 
      : mockBusRoutes.filter(bus => bus.seatAvailable);

    res.json({
      success: true,
      data: availableBuses,
      count: availableBuses.length
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bus options',
      error: error.message
    });
  }
});

export { router as busRoutes };

