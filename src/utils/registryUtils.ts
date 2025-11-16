// Browser-side registry utilities using localStorage

interface DeviceInfo {
  [key: string]: string | number;
}

// Function to get system data using browser APIs
export async function getSystemData() {
  try {
    const systemDataResponse = await fetch("/api/system-data");
    const deviceInfo = await systemDataResponse.json();
    return deviceInfo;
  } catch (error) {
    console.error("Error fetching system data:", error);
    return {
      "Nama Komputer": "Unknown",
      "User": "Unknown",
      "Platform": navigator.platform,
      "Arsitektur": "Unknown",
      "CPU": "Unknown",
      "Memory": "Unknown",
    };
  }
}

// Function to check if deviceInfo exists in localStorage
export function checkRegister(): boolean {
  if (typeof localStorage !== "undefined") {
    const deviceInfo = localStorage.getItem("deviceInfo");
    return deviceInfo !== null;
  }
  return false;
}

// Function to read deviceInfo from localStorage
export function readRegister(): DeviceInfo | null {
  if (typeof localStorage !== "undefined") {
    const deviceInfo = localStorage.getItem("deviceInfo");
    if (deviceInfo) {
      try {
        return JSON.parse(deviceInfo);
      } catch (error) {
        console.error("Error parsing deviceInfo:", error);
        return null;
      }
    }
  }
  return null;
}

// Function to write deviceInfo to localStorage
export function writeRegister(data: DeviceInfo): boolean {
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem("deviceInfo", JSON.stringify(data));
      return true;
    } catch (error) {
      console.error("Error writing to localStorage:", error);
      return false;
    }
  }
  return false;
}
