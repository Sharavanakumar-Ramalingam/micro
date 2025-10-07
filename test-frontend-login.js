// Test script to verify frontend login works
// This simulates exactly what the React app does

const testLogin = async () => {
  console.log('=== Testing MicroMerge Frontend Login ===');
  
  try {
    // Step 1: Test login
    const response = await fetch('http://localhost:8000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'surajramalingam33@gmail.com',
        password: 'suraj@123'
      })
    });

    console.log('Login status:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Login successful!');
      console.log('User:', data.user.email, '| Role:', data.user.role);
      
      // Step 2: Test protected endpoint
      const meResponse = await fetch('http://localhost:8000/api/v1/auth/me', {
        headers: { 
          'Authorization': `Bearer ${data.access_token}` 
        }
      });
      
      console.log('Protected endpoint status:', meResponse.status);
      
      if (meResponse.ok) {
        const userData = await meResponse.json();
        console.log('✅ Authentication working perfectly!');
        console.log('Authenticated as:', userData.email);
      } else {
        console.log('❌ Protected endpoint failed');
      }
      
    } else {
      const error = await response.json();
      console.log('❌ Login failed:', error);
    }
    
  } catch (error) {
    console.log('❌ Network error:', error);
  }
};

testLogin();