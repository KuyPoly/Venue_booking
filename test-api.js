const https = require('https');

const testEndpoints = [
  '/api/dashboard/stats',
  '/booking/requests', 
  '/earnings/weekly'
];

const baseUrl = 'venuebooking-production.up.railway.app';

console.log('Testing backend endpoints...');

testEndpoints.forEach(endpoint => {
  const options = {
    hostname: baseUrl,
    port: 443,
    path: endpoint,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = https.request(options, (res) => {
    console.log(`${endpoint}: ${res.statusCode} ${res.statusMessage}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log(`  Response: ${JSON.stringify(response).substring(0, 100)}...`);
      } catch (e) {
        console.log(`  Raw response: ${data.substring(0, 100)}...`);
      }
    });
  });

  req.on('error', (error) => {
    console.log(`${endpoint}: ERROR - ${error.message}`);
  });

  req.end();
});
