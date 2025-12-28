import { Router, Request, Response } from 'express';
import { mockTaxiData, TaxiOption } from '../data/mockData';

const router = Router();

/**
 * POST /api/getTaxiOptions
 * Returns available taxi options for a given route
 */
router.post('/getTaxiOptions', (req: Request, res: Response) => {
  try {
    const { source, destination } = req.body;

    // Validation
    if (!source || !destination) {
      return res.status(400).json({
        success: false,
        message: 'Source and destination are required'
      });
    }

    // Filter available taxis
    const availableTaxis = mockTaxiData.filter(taxi => taxi.available);

    // Calculate fare based on distance if needed
    // For MVP, return mock data
    const taxiOptions = availableTaxis.map(taxi => ({
      ...taxi,
      source,
      destination
    }));

    res.json({
      success: true,
      data: taxiOptions,
      count: taxiOptions.length
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching taxi options',
      error: error.message
    });
  }
});

export { router as taxiRoutes };

