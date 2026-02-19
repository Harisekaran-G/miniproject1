const API_URL = 'http://localhost:3000/api';

async function verifyPaymentFlow() {
    console.log('💳 Starting Payment Flow Verification...');

    try {
        // 1. Simulate "Confirm & Pay" from Frontend
        // We send a booking with paymentStatus='paid'
        const bookingPayload = {
            userEmail: 'user_paid@test.com',
            passengerName: 'Paid User',
            route: { from: 'Chennai', to: 'Bangalore' },
            busId: 'BUS-TEST-101',
            busName: 'Test Travels',
            seatNumbers: ['A1', 'A2'],
            busFare: 1000,
            taxiFare: 500,
            totalFare: 1500,
            taxiSelected: true, // Hybrid booking
            taxiPickup: { address: 'Home', selected: true },
            // The frontend sends these:
            paymentStatus: 'paid',
            transactionId: 'TXN_TEST_12345',
            status: 'confirmed'
        };

        console.log('\n1. Creating Paid Component...');
        const createRes = await fetch(`${API_URL}/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingPayload)
        });
        const createData = await createRes.json();
        console.log('Create Response:', createData.success ? 'Success' : createData.message);

        if (!createData.success) {
            console.error('Create Failed:', createData);
            return;
        }

        // 2. BUS OPERATOR View
        // In Mock Mode, operator/bookings returns filtered mockBookings.
        // It filters by operatorEmail in DB, but in Mock Fallback (if DB offline), 
        // it returns ALL confirmed bookings (or filters if I implemented it).
        // Let's check what I implemented:
        // "const operatorMockBookings = mockBookings.filter(b => b.status === 'confirmed' && b.paymentStatus === 'paid');"
        // So it should return it.

        console.log('\n2. Verifying Bus Operator Dashboard...');
        const opRes = await fetch(`${API_URL}/operator/bookings?operatorEmail=any@operator.com`);
        const opData = await opRes.json();
        console.log(`Fetched ${opData.data?.length} bookings for Operator.`);

        const busBookingFound = opData.data?.find(b => b.transactionId === 'TXN_TEST_12345');
        if (busBookingFound) {
            console.log('✅ Bus Operator sees the paid booking!');
            console.log('   Status:', busBookingFound.status);
            console.log('   Payment:', busBookingFound.paymentStatus);
        } else {
            console.error('❌ Bus Operator did NOT see the booking.');
        }

        // 3. TAXI OPERATOR View
        console.log('\n3. Verifying Taxi Dashboard...');
        const taxiRes = await fetch(`${API_URL}/taxi/bookings`);
        const taxiData = await taxiRes.json();
        console.log(`Fetched ${taxiData.data?.length} bookings for Taxi.`);

        const taxiBookingFound = taxiData.data?.find(b => b.transactionId === 'TXN_TEST_12345');
        if (taxiBookingFound) {
            console.log('✅ Taxi Operator sees the paid booking!');
            console.log('   Taxi Pickup:', taxiBookingFound.taxiPickup);
        } else {
            console.error('❌ Taxi Operator did NOT see the booking.');
        }

    } catch (error) {
        console.error('❌ Verification Error:', error.message);
    }
}

verifyPaymentFlow();
