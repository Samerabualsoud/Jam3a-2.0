// Test script for Jam3a-2.0 functionality
const axios = require('axios');
const mongoose = require('mongoose');
const connectDB = require('./db');
const { sendEmail } = require('./emailService');

// Base URL for API requests
const API_BASE_URL = 'http://localhost:3000/api';

// Test MongoDB connection
const testMongoDBConnection = async () => {
  console.log('Testing MongoDB connection...');
  try {
    const conn = await connectDB();
    if (conn) {
      console.log('✅ MongoDB connection successful');
      return true;
    } else {
      console.error('❌ MongoDB connection failed');
      return false;
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    return false;
  }
};

// Test API endpoints
const testAPIEndpoints = async () => {
  console.log('\nTesting API endpoints...');
  
  // Test endpoints
  const endpoints = [
    { url: '/products', name: 'Products API' },
    { url: '/deals', name: 'Deals API' },
    { url: '/analytics/config', name: 'Analytics API' },
    { url: '/users', name: 'Users API' }
  ];
  
  let allSuccessful = true;
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint.name}...`);
      const response = await axios.get(`${API_BASE_URL}${endpoint.url}`);
      
      if (response.status === 200) {
        console.log(`✅ ${endpoint.name} is working`);
        
        // Check if response contains data
        if (response.data) {
          if (Array.isArray(response.data)) {
            console.log(`   - Received ${response.data.length} items`);
          } else if (response.data.data && Array.isArray(response.data.data)) {
            console.log(`   - Received ${response.data.data.length} items`);
          } else {
            console.log('   - Received data in non-array format');
          }
        } else {
          console.log('   - No data received');
          allSuccessful = false;
        }
      } else {
        console.error(`❌ ${endpoint.name} returned status ${response.status}`);
        allSuccessful = false;
      }
    } catch (error) {
      console.error(`❌ ${endpoint.name} error:`, error.message);
      allSuccessful = false;
    }
  }
  
  return allSuccessful;
};

// Test email functionality
const testEmailFunctionality = async () => {
  console.log('\nTesting email functionality...');
  
  try {
    // Test email template loading
    console.log('Testing email template loading...');
    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Test Email',
      template: 'welcome',
      data: { name: 'Test User' }
    });
    
    if (result.success) {
      console.log('✅ Email functionality is working');
      return true;
    } else {
      console.error('❌ Email functionality error:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Email functionality error:', error);
    return false;
  }
};

// Run all tests
const runTests = async () => {
  console.log('=== STARTING TESTS ===');
  
  // Test MongoDB connection
  const mongoDBSuccess = await testMongoDBConnection();
  
  // Test API endpoints
  const apiSuccess = await testAPIEndpoints();
  
  // Test email functionality
  const emailSuccess = await testEmailFunctionality();
  
  console.log('\n=== TEST SUMMARY ===');
  console.log(`MongoDB Connection: ${mongoDBSuccess ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`API Endpoints: ${apiSuccess ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Email Functionality: ${emailSuccess ? '✅ PASS' : '❌ FAIL'}`);
  
  // Overall result
  const overallSuccess = mongoDBSuccess && apiSuccess && emailSuccess;
  console.log(`\nOverall Result: ${overallSuccess ? '✅ PASS' : '❌ FAIL'}`);
  
  // Clean up
  mongoose.connection.close();
  
  return overallSuccess;
};

// Run tests if this file is executed directly
if (require.main === module) {
  runTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Test execution error:', error);
      process.exit(1);
    });
}

module.exports = { runTests };
