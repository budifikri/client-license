import dotenv from "dotenv";
dotenv.config();

const express = require('express');
const path = require('path');
const { checkRegister, readRegister, writeRegister, getSystemData } = require('./src/utils/registryUtils.cjs');
const { execSync } = require('child_process');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'dist')));

// API routes for registry operations
app.get('/api/check-register', (req, res) => {
  checkRegister((exists) => {
    res.json({ exists });
  });
});

app.get('/api/read-register', (req, res) => {
  readRegister((data, error) => {
    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.json(data);
    }
  });
});

app.post('/api/write-register', (req, res) => {
  const data = req.body;
  writeRegister(data, (success, error) => {
    if (success) {
      res.json({ message: 'Registry updated successfully' });
    } else {
      res.status(500).json({ error: error.message });
    }
  });
});

app.get('/api/system-data', (req, res) => {
  const data = getSystemData();
  res.json(data);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Product license activation endpoint
app.post('/product_license', (req, res) => {
  let data;
  if (req.body.data) {
    // Form data with JSON string
    data = JSON.parse(req.body.data);
  } else {
    // Direct JSON
    data = req.body;
  }
  const { productId, deviceInfo, base_url } = data;
  console.log('Product License Activation Request:');
  console.log('Product ID:', productId);
  console.log('Device Info:', deviceInfo);
  console.log('Base URL:', base_url);

  // Here you can add activation logic
  // For now, just respond with success
  res.json({
    success: true,
    message: 'License activation request received',
    productId,
    deviceInfo,
    base_url
  });
});

// Catch all handler: send back React's index.html file for client-side routing
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Function to send heartbeat from server to remote endpoint
function sendServerHeartbeat() {
  // Use environment variables or defaults
const apiUrl = process.env.URL_API || 'http://localhost:3000';
const computerId = process.env.COMPUTER_ID;


  console.log('Sending server-side heartbeat to:', apiUrl, 'with computerId:', computerId);

  const heartbeatData = {
    computerId: computerId
  };

  const postData = JSON.stringify(heartbeatData);

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  // Parse the URL to extract hostname, port, and path
  const url = new URL(`${apiUrl}/api/devices/heartbeat`);

  const requestOptions = {
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: url.pathname + url.search,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(requestOptions, (res) => {
    console.log('Server heartbeat response status:', res.statusCode);
    res.on('data', (chunk) => {
      console.log('Server heartbeat response body:', chunk.toString());
    });
    res.on('end', () => {
      console.log('Server heartbeat request completed at:', new Date().toISOString());
    });
  });

  req.on('error', (e) => {
    console.error('Server heartbeat error:', e.message);
  });

  req.write(postData);
  req.end();
}

// Start the server-side heartbeat every 10 seconds after server starts
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  // Send initial heartbeat and then every 10 seconds
  sendServerHeartbeat();
  setInterval(sendServerHeartbeat, 10000);
  console.log('Server-side heartbeat scheduled every 10 seconds');
});