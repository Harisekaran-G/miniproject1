const API_URL = 'http://localhost:3000/api';

async function verifyAuth() {
    console.log('🔐 Starting Secure Auth Verification...');

    try {
        // 1. Register a NEW unique user
        const userEmail = `auth_test_${Date.now()}@example.com`;
        const password = 'securePass123';

        console.log(`\n1. Registering User: ${userEmail}`);
        const regRes = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: userEmail,
                password: password,
                name: 'Auth Tester',
                role: 'user'
            })
        });

        const regData = await regRes.json();
        console.log('Register Response:', regData);
        if (!regData.success) {
            console.error('❌ Registration Failed');
            return;
        }

        // 2. Login with CORRECT password
        console.log('\n2. Logging in with CORRECT password...');
        const loginRes = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: userEmail,
                password: password
            })
        });

        const loginData = await loginRes.json();
        if (loginData.success && loginData.token) {
            console.log('✅ Login Successful! JWT Token received.');
        } else {
            console.error('❌ Login Failed (Expected Success):', loginData);
        }

        // 3. Login with INCORRECT password
        console.log('\n3. Logging in with INCORRECT password...');
        const failRes = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: userEmail,
                password: 'wrongPassword'
            })
        });

        const failData = await failRes.json();
        if (failData.success === false) {
            console.log('✅ Login Failed as expected for wrong password.');
        } else {
            console.error('❌ Login Succeeded (Expected Failure):', failData);
        }

        // 4. Operator Verification (go@operator.com)
        console.log('\n4. Verifying Operator Registration (go@operator.com)...');
        const operatorEmail = 'go@operator.com';
        // Attempt register (might fail if exists, which is fine)
        const opRegRes = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: operatorEmail,
                password: 'operatorPass123',
                name: 'Go Operator',
                role: 'operator'
            })
        });
        const opRegData = await opRegRes.json();
        console.log('Operator Register Response:', opRegData);
        // Could be "User already exists", which is OK.

        // Login Operator
        console.log('Logging in as Operator...');
        const opLoginRes = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: operatorEmail,
                password: 'operatorPass123'
            })
        });
        const opLoginData = await opLoginRes.json();

        if (opLoginData.success) {
            console.log('✅ Operator Login Successful!');
            console.log('Role:', opLoginData.user.role);
            if (opLoginData.user.role === 'operator') {
                console.log('✅ Role Verified: Operator');
            } else {
                console.error('❌ Role Mismatch:', opLoginData.user.role);
            }
        } else {
            console.error('❌ Operator Login Failed:', opLoginData);
        }

    } catch (error) {
        console.error('❌ Verification Error:', error.message);
    }
}

verifyAuth();
