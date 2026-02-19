import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  userEmail: string;
  passengerName: string;
  passengerPhone: string;
  route: {
    from: string;
    to: string;
  };
  busId: string;
  busName: string;
  seatNumbers: string[];
  busFare: number;
  taxiFare: number;
  totalFare: number;
  taxiSelected: boolean;
  taxiPickup?: { address: string; time: string; selected: boolean };
  taxiDrop?: { address: string; time: string; selected: boolean };
  paymentStatus: 'pending' | 'paid' | 'failed';
  transactionId?: string;
  bookingDate: Date;
  status: 'confirmed' | 'cancelled';
}

const BookingSchema: Schema = new Schema(
  {
    userEmail: { type: String, required: true },
    passengerName: { type: String, required: true },
    passengerPhone: String,
    route: {
      from: String,
      to: String,
    },
    busId: String,
    busName: String,
    seatNumbers: [String],
    busFare: Number,
    taxiFare: Number,
    totalFare: Number,
    taxiSelected: Boolean,
    // Detailed Taxi Fields
    taxiPickup: {
      address: String,
      time: String,
      selected: Boolean
    },
    taxiDrop: {
      address: String,
      time: String,
      selected: Boolean
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },
    transactionId: {
      type: String,
      default: null
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IBooking>('Booking', BookingSchema);
