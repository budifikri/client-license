const express = require('express');
const path = require('path');
const { checkRegister, readRegister, writeRegister, getSystemData } = require('./src/utils/registryUtils.cjs');

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});