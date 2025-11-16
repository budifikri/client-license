const { exec } = require('child_process');
const os = require('os');

const REG_PATH = 'HKCU\\SOFTWARE\\Fikrisoftware_LICENSE';

// Function to get system data
function getSystemData() {
  return {
    'Nama Komputer': os.hostname(),
    'User': os.userInfo().username,
    'Platform': os.platform(),
    'Arsitektur': os.arch(),
    'CPU': os.cpus()[0].model,
    'Memory': Math.round(os.totalmem() / 1024 / 1024).toString() + ' MB'
  };
}

// Function to check if deviceInfo exists in localStorage
function checkRegister(callback) {
  // Note: localStorage is not available in Node.js, this is for browser use
  if (typeof localStorage !== 'undefined') {
    const deviceInfo = localStorage.getItem('deviceInfo');
    callback(deviceInfo !== null);
  } else {
    callback(false);
  }
}

// Function to read deviceInfo from localStorage
function readRegister(callback) {
  // Note: localStorage is not available in Node.js, this is for browser use
  if (typeof localStorage !== 'undefined') {
    const deviceInfo = localStorage.getItem('deviceInfo');
    if (deviceInfo) {
      try {
        const parsed = JSON.parse(deviceInfo);
        callback(parsed, null);
      } catch (error) {
        callback(null, error);
      }
    } else {
      callback(null, new Error('deviceInfo not found'));
    }
  } else {
    callback(null, new Error('localStorage not available'));
  }
}

// Function to write deviceInfo to localStorage
function writeRegister(data, callback) {
  // Note: localStorage is not available in Node.js, this is for browser use
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem('deviceInfo', JSON.stringify(data));
      if (callback) callback(true, null);
    } catch (error) {
      if (callback) callback(false, error);
    }
  } else {
    if (callback) callback(false, new Error('localStorage not available'));
  }
}

module.exports = {
  getSystemData,
  checkRegister,
  readRegister,
  writeRegister
};