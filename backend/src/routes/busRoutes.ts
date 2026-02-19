import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import Bus from '../models/Bus';
import Seat from '../models/Seat';

const router = Router();

/**
 * POST /api/getBusOptions
 * Returns available bus options for a given route from MongoDB
 */
router.post('/getBusOptions', async (req: Request, res: Response) => {
  try {
    const { source, destination } = req.body;

    // Validation
    if (!source || !destination) {
      return res.status(400).json({
        success: false,
        message: 'Source and destination are required'
      });
    }

    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected. Please ensure MongoDB is running and try again.'
      });
    }

    // .lean() returns raw MongoDB docs — Mongoose would strip non-schema fields
    // (price, rating, seatsAvailable) without it, causing ₹0 on the frontend
    const buses = await Bus.find({
      source: { $regex: source, $options: 'i' },
      destination: { $regex: destination, $options: 'i' },
    }).lean();

    // Convert to BusOption format
    // Optimizing this for loop with database calls inside might be slow for many buses.
    // Ideally we aggregate, but for now map with Promise.all
    const busOptions = await Promise.all(buses.map(async (bus: any) => {
      const bookedSeatsCount = await Seat.countDocuments({
        busId: bus._id,
        isBooked: true,
      });

      // DB documents use `price` (manual inserts) or `fare` (seeded via model)
      const price = bus.price ?? bus.fare ?? 0;
      const totalSeatCount = bus.totalSeats ?? bus.seatsAvailable ?? 40;
      const availableSeats = bus.totalSeats
        ? Math.max(bus.totalSeats - bookedSeatsCount, 0)
        : (bus.seatsAvailable ?? 40);

      return {
        _id: bus._id.toString(),
        routeNo: bus.routeNo,
        source: bus.source,
        destination: bus.destination,
        price,                             // single canonical field
        rating: bus.rating ?? null,
        duration: bus.duration ?? '',
        distance: bus.distance ?? 0,
        seatAvailable: availableSeats > 0,
        seatsAvailable: availableSeats,
        totalSeats: totalSeatCount,
        departureTime: bus.departureTime,
        arrivalTime: bus.arrivalTime,
      };
    }));

    res.json({
      success: true,
      data: busOptions,
      count: busOptions.length
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bus options',
      error: error.message
    });
  }
});

/**
 * GET /api/getBus/:id
 * Get bus details including seat availability
 */
router.get('/getBus/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const bus = await Bus.findById(id);

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    res.json({
      success: true,
      data: bus
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bus details',
      error: error.message
    });
  }
});

/**
 * POST /api/getBusDetails
 * Get bus details including seat availability
 */
router.post('/getBusDetails', async (req: Request, res: Response) => {
  try {
    const { busId } = req.body;

    if (!busId) {
      return res.status(400).json({
        success: false,
        message: 'busId is required'
      });
    }

    const bus = await Bus.findById(busId);

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    // Fetch booked seats for this bus
    const bookedSeats = await Seat.find({ busId: bus._id, isBooked: true });

    // Create a map of booked seats
    const bookedSeatMap = new Set(bookedSeats.map(s => s.seatNumber));

    // Merge with bus.seats (structure used by frontend)
    // We clone the bus object to avoid modifying the Mongoose document directly if it's restrictive
    const busObj: any = bus.toObject();

    if (busObj.seats && busObj.seats.length > 0) {
      // Merge with live booked seats from Seat collection
      busObj.seats = busObj.seats.map((seat: any) => ({
        ...seat,
        isBooked: bookedSeatMap.has(seat.seatNumber),
      }));
    } else {
      // Issue 2: Generate seats dynamically if none embedded (e.g., seeded via insertMany)
      busObj.seats = [];
      const count = bus.totalSeats || 40;
      for (let i = 1; i <= count; i++) {
        const seatNum = i.toString().padStart(2, '0');
        busObj.seats.push({
          seatNumber: seatNum,
          isBooked: bookedSeatMap.has(seatNum),
        });
      }
    }

    res.json({
      success: true,
      data: busObj
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bus details',
      error: error.message
    });
  }
});

export { router as busRoutes };

