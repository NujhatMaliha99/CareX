async function testLogin() {
    try {
        console.log('🔌 Attempting login to http://127.0.0.1:3000/api/auth/login...');
        const response = await fetch('http://127.0.0.1:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@carex.com',
                password: 'admin123'
            })
        });
        
        const data = await response.json();
        if (response.ok) {
            console.log('✅ Login Successful:', data);
        } else {
            console.error('❌ Login Failed (Status):', response.status, data);
        }
    } catch (err) {
        console.error('❌ Login Failed (Error):', err.message);
    }
}

testLogin();
