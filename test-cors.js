// test-cors.js - Simple script to test CORS configuration
const axios = require('axios');

async function testCORS() {
  const baseURL = 'http://task-tracker.test/api';

  console.log('🧪 Testing CORS Configuration...\n');

  try {
    // Test 1: OPTIONS preflight request
    console.log('1. Testing OPTIONS preflight request...');
    const optionsResponse = await axios.options(`${baseURL}/login`, {
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'content-type,authorization'
      }
    });
    console.log('✅ OPTIONS request successful');
    console.log('CORS Headers:', {
      'Access-Control-Allow-Origin': optionsResponse.headers['access-control-allow-origin'],
      'Access-Control-Allow-Methods': optionsResponse.headers['access-control-allow-methods'],
      'Access-Control-Allow-Headers': optionsResponse.headers['access-control-allow-headers'],
      'Access-Control-Allow-Credentials': optionsResponse.headers['access-control-allow-credentials']
    });

  } catch (error) {
    console.log('❌ OPTIONS request failed:', error.response?.status, error.response?.statusText);
  }

  try {
    // Test 2: Actual POST request
    console.log('\n2. Testing POST login request...');
    const postResponse = await axios.post(`${baseURL}/login`, {
      email: 'test@example.com',
      password: 'password'
    }, {
      headers: {
        'Origin': 'http://localhost:3000',
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ POST request successful');
    console.log('Response:', postResponse.data);

  } catch (error) {
    console.log('❌ POST request failed:', error.response?.status, error.response?.statusText);
    if (error.response?.data) {
      console.log('Error details:', error.response.data);
    }
  }

  try {
    // Test 3: GET user request (requires auth)
    console.log('\n3. Testing GET user request (should fail without token)...');
    const getResponse = await axios.get(`${baseURL}/user`, {
      headers: {
        'Origin': 'http://localhost:3000'
      }
    });
    console.log('✅ GET request successful (unexpected)');
    console.log('Response:', getResponse.data);

  } catch (error) {
    console.log('✅ GET request failed as expected:', error.response?.status, error.response?.statusText);
    if (error.response?.status === 401) {
      console.log('This is correct - authentication required');
    }
  }
}

// Run the test
testCORS().catch(console.error);