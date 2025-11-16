import React, { useState, useEffect } from 'react';

const App = () => {
  // State untuk manajemen aplikasi
  const [status, setStatus] = useState('');
  const [deviceStatus, setDeviceStatus] = useState<'active' | 'inactive'>('inactive');
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [serverStatus, setServerStatus] = useState<'up' | 'down'>('down');
  const [currentView, setCurrentView] = useState<'login' | 'activation' | 'product' | 'payment' | 'confirmation' | 'success'>('login');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Simulasi pemeriksaan status awal saat aplikasi dimulai
  useEffect(() => {
    checkDeviceStatus();
  }, []);

  const checkDeviceStatus = () => {
    const savedStatus = localStorage.getItem('deviceStatus') as 'active' | 'inactive' | null;
    if (savedStatus) {
      setDeviceStatus(savedStatus);
      if (savedStatus === 'active') {
        setCurrentView('login');
      } else {
        setCurrentView('activation');
      }
    } else {
      // Default ke inactive jika tidak ditemukan
      setDeviceStatus('inactive');
      setCurrentView('activation');
    }
  };

  const simulateConnectionCheck = (): Promise<boolean> => {
    return new Promise((resolve) => {
      setStatus('Cek Koneksi...');
      setIsLoading(true);
      setTimeout(() => {
        const online = Math.random() > 0.3; // 70% chance online
        setIsOnline(online);
        setIsLoading(false);
        resolve(online);
      }, 1500);
    });
  };

  const simulateServerCheck = (): Promise<boolean> => {
    return new Promise((resolve) => {
      setStatus('Cek Server...');
      setIsLoading(true);
      setTimeout(() => {
        const serverUp = Math.random() > 0.2; // 80% chance server up
        setServerStatus(serverUp ? 'up' : 'down');
        setIsLoading(false);
        resolve(serverUp);
      }, 1000);
    });
  };

  const activateDevice = async () => {
    const online = await simulateConnectionCheck();
    
    if (!online) {
      setStatus('Offline - Arahkan ke Cek Regedit Windows');
      setCurrentView('activation');
      return;
    }
    
    const serverUp = await simulateServerCheck();
    
    if (!serverUp) {
      setStatus('Server Down');
      setCurrentView('activation');
      return;
    }
    
    // Jika online dan server up, lanjut ke proses aktivasi
    setStatus('Device Inactive - Mulai Proses Aktivasi');
    setCurrentView('product');
  };

  const handleProductSelect = (productId: string) => {
    setSelectedProduct(productId);
    setCurrentView('payment');
  };

  const handlePayment = () => {
    setStatus('Proses Pembayaran...');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentView('confirmation');
    }, 2000);
  };

  const handleConfirmation = () => {
    setStatus('Konfirmasi Pembayaran...');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Simpan status active ke localStorage
      localStorage.setItem('deviceStatus', 'active');
      setDeviceStatus('active');
      setCurrentView('success');
    }, 1500);
  };

  const handleLogin = () => {
    if (!email || !password) {
      setStatus('Email dan password harus diisi');
      return;
    }
    
    setStatus('Proses Login...');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (deviceStatus === 'active') {
        setCurrentView('success');
        setStatus('Device Active dan Login Berhasil');
      } else {
        setStatus('Device belum diaktivasi');
      }
    }, 1500);
  };

  const resetDeviceStatus = () => {
    localStorage.setItem('deviceStatus', 'inactive');
    setDeviceStatus('inactive');
    setCurrentView('activation');
    setStatus('');
    setSelectedProduct('');
  };

  // Tampilan untuk masing-masing tahapan
  const renderView = () => {
    switch (currentView) {
      case 'product':
        return (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Pilih Produk</h2>
            <div className="space-y-3">
              <button 
                onClick={() => handleProductSelect('product1')}
                className={`w-full p-3 rounded-md ${
                  selectedProduct === 'product1' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Produk 1 - Lisensi Personal
              </button>
              <button 
                onClick={() => handleProductSelect('product2')}
                className={`w-full p-3 rounded-md ${
                  selectedProduct === 'product2' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Produk 2 - Lisensi Bisnis
              </button>
              <button 
                onClick={() => handleProductSelect('product3')}
                className={`w-full p-3 rounded-md ${
                  selectedProduct === 'product3' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Produk 3 - Lisensi Enterprise
              </button>
            </div>
            <div className="mt-4 flex justify-between">
              <button 
                onClick={() => setCurrentView('activation')}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Kembali
              </button>
              <button 
                onClick={handlePayment}
                disabled={!selectedProduct}
                className={`px-4 py-2 rounded-md ${
                  selectedProduct 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
              >
                Lanjut ke Pembayaran
              </button>
            </div>
          </div>
        );
      
      case 'payment':
        return (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Proses Pembayaran</h2>
            <div className="mb-4">
              <p>Produk: {selectedProduct || 'Silakan pilih produk terlebih dahulu'}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Masukkan email Anda"
              />
            </div>
            <div className="flex justify-between">
              <button 
                onClick={() => setCurrentView('product')}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Kembali
              </button>
              <button 
                onClick={handlePayment}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Proses Pembayaran
              </button>
            </div>
          </div>
        );
      
      case 'confirmation':
        return (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Konfirmasi Pembayaran</h2>
            <p className="mb-4">Silakan konfirmasi pembayaran Anda untuk menyelesaikan proses aktivasi.</p>
            <div className="flex justify-between">
              <button 
                onClick={() => setCurrentView('payment')}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Kembali
              </button>
              <button 
                onClick={handleConfirmation}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Konfirmasi Pembayaran
              </button>
            </div>
          </div>
        );
      
      case 'success':
        return (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4 text-green-600">Berhasil!</h2>
            <p className="mb-4">Device Active dan Login Berhasil</p>
            <div className="flex justify-between">
              <button 
                onClick={resetDeviceStatus}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Reset Status
              </button>
              <button 
                onClick={() => setCurrentView('login')}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Kembali ke Login
              </button>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Login</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Masukkan email Anda"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Masukkan password Anda"
              />
            </div>
            <div className="flex justify-between">
              <button 
                onClick={activateDevice}
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
              >
                Aktivasi Software
              </button>
              <button 
                onClick={handleLogin}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Login
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
        <h1 className="text-2xl font-extrabold text-center mb-6 text-gray-800">Sistem Aktivasi Perangkat</h1>
        
        {/* Status indicator */}
        <div className="mb-4 p-3 bg-blue-100/80 backdrop-blur-sm rounded-md text-center">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
              {status}
            </div>
          ) : (
            status || 'Device Status: ' + deviceStatus
          )}
        </div>
        
        {/* Main content */}
        {renderView()}
        
        {/* Additional information */}
        <div className="mt-6 p-4 bg-gray-200/80 backdrop-blur-sm rounded-md text-sm">
          <p><strong>Info:</strong> Status saat ini: {deviceStatus}</p>
          <p>Server: {serverStatus}</p>
          <p>Koneksi: {isOnline ? 'Online' : 'Offline'}</p>
        </div>
      </div>
    </div>
  );
};

export default App;