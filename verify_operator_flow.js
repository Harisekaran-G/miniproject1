// Native fetch is available in Node 18+
const API_URL = 'http://localhost:3000/api';

async function testOperatorFlow() {
    console.log('🚀 Starting Operator System Verification (using fetch)...');

    try {
        // 1. Creating User & Booking via /book-seats
        const userEmail = `user_${Date.now()}@test.com`;
        console.log(`\n1. Creating User & Booking via /book-seats for ${userEmail}...`);

        // Note: older node versions might need headers object explicitly
        const bookingPayload = {
            userId: userEmail,
            busId: 'BUS-101',
            routeId: 'EXP-45A',
            from: 'Chennai',
            to: 'Coimbatore',
            seats: ['S1'],
            fare: 500,
            bookingDate: new Date().toISOString()
        };

        const bookingRes = await fetch(`${API_URL}/book-seats`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingPayload)
        });

        // Check if response is ok
        if (!bookingRes.ok) {
            console.error(`❌ /book-seats failed with status ${bookingRes.status}`);
            const text = await bookingRes.text();
            console.error('Response:', text);
            return;
        }

        const bookingData = await bookingRes.json();

        if (bookingData.success) {
            console.log('✅ User & Initial Booking Created! ID:', bookingData.data._id);
        } else {
            console.error('❌ Failed to create user/booking:', bookingData);
            return;
        }

        // 2. Simulate Payment & persistence via /create
        console.log('\n2. Simulating Payment Success & Calling /create...');
        const finalBookingData = {
            userEmail: userEmail,
            passengerName: 'Test Passenger',
            passengerPhone: '1234567890',
            route: { from: 'Chennai', to: 'Coimbatore' },
            busId: 'BUS-101',
            busName: 'Test Operator Bus',
            seatNumbers: ['S1'],
            busFare: 500,
            taxiFare: 0,
            totalFare: 500,
            taxiSelected: false,
            bookingDate: new Date(),
            status: 'confirmed'
        };

        const createRes = await fetch(`${API_URL}/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(finalBookingData)
        });

        if (!createRes.ok) {
            console.error(`❌ /create failed with status ${createRes.status}`);
            console.error('Response:', await createRes.text());
            return;
        }

        const createData = await createRes.json();

        if (createData.success) {
            console.log('✅ Final Booking Created via /create!');
        } else {
            console.error('❌ Failed to create final booking:', createData);
            return;
        }

        // 3. Testing Operator Fetch
        console.log('\n3. Testing Operator Fetch (Expect Empty or Success)...');
        const operatorEmail = 'kpn@operator.com';
        const opRes = await fetch(`${API_URL}/operator/bookings?operatorEmail=${operatorEmail}`);

        if (!opRes.ok) {
            console.error(`❌ /operator/bookings failed with status ${opRes.status}`);
            console.error('Response:', await opRes.text());
            return;
        }

        const opData = await opRes.json();

        console.log('Operator Response Data Count:', opData.data ? opData.data.length : 'N/A');

        if (opData.success) {
            console.log('✅ Operator API Request Successful');
        } else {
            console.error('❌ Operator API Request Failed');
        }

    } catch (error) {
        console.error('❌ Test Failed (Network/Exception):', error.message);
        if (error.cause) console.error('Cause:', error.cause);
    }
}

testOperatorFlow();
