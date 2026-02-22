const mongoose = require('mongoose');

// Connect to the actual db
mongoose.connect('mongodb://127.0.0.1:27017/busBookingDB')
    .then(async () => {
        // We can define a temporary generic schema just to read the collection
        const BookingSchema = new mongoose.Schema({}, { strict: false });
        const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);

        // Find the latest booking
        const latest = await Booking.findOne().sort({ _id: -1 });
        if (latest) {
            console.log('LATEST BOOKING:');
            console.log(JSON.stringify(latest, null, 2));
        } else {
            console.log('NO BOOKINGS FOUND');
        }
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
