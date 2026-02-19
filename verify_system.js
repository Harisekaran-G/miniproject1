// using fetch since Node 18+ support it native.

const API_URL = 'http://localhost:3000/api';

async function checkSystem() {
    console.log('🔍 Starting System Connectivity Check...\n');

    // 1. Check Database Port (Simulated via Backend Health or just assuming if backend works)
    // We'll rely on Backend's ability to talk to DB.

    // 2. Check Backend Health
    try {
        console.log('📡 Checking Backend Health...');
        // Note: server.ts define /health, not /api/health
        const healthRes = await fetch('http://localhost:3000/health');
        const health = await healthRes.json();
        if (health.status === 'OK') {
            console.log('✅ Backend is UP and Running.');
        } else {
            console.error('❌ Backend is running but reported unhealthy:', health);
        }
    } catch (e) {
        console.error('❌ Backend is DOWN or Unreachable on port 3000.');
        console.error('   Hint: npm run dev in backend folder.');
        return;
    }

    // 3. Verify Database Connection via Auth
    console.log('\n💾 Verifying Database Connection (via Registration)...');
    const testUser = {
        email: `systest_${Date.now()}@check.com`,
        password: 'password123',
        name: 'System Verify',
        role: 'user'
    };

    try {
        const regRes = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });
        const regData = await regRes.json();

        if (regRes.ok && regData.success) {
            console.log('✅ Database Write Success: User Registered.');
        } else {
            console.error('❌ Database Write Failed:', regData.message);
            if (regData.message.includes('Mock')) {
                console.warn('⚠️ WARNING: Backend is using MOCK Data (DB might be disconnected).');
            }
            return;
        }

        // 4. Verify Login (Read)
        console.log('\n🔐 Verifying Login (Database Read)...');
        const loginRes = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: testUser.email, password: testUser.password })
        });
        const loginData = await loginRes.json();

        if (loginRes.ok && loginData.success) {
            console.log('✅ Database Read Success: Check passed.');
            console.log(`   User ID: ${loginData.user.id}`);
            console.log(`   Token: ${loginData.token.substring(0, 15)}...`);
        } else {
            console.error('❌ Database Read Failed:', loginData.message);
        }

    } catch (e) {
        console.error('❌ API Error:', e.message);
    }

    console.log('\n🎉 System Verification Complete.');
}

checkSystem();
