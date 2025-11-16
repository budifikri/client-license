import React, { useState, useEffect } from "react";

const App = () => {
  const [status, setStatus] = useState("");
  const [deviceStatus, setDeviceStatus] = useState<"active" | "inactive">("inactive");
  const [isOnline, setIsOnline] = useState(false);
  const [serverStatus, setServerStatus] = useState<"up" | "down">("down");
  const [currentView, setCurrentView] = useState<
    "login" | "activation" | "product" | "payment" | "confirmation" | "success"
  >("login");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedStatus = localStorage.getItem("deviceStatus") as "active" | "inactive" | null;
    if (savedStatus) {
      setDeviceStatus(savedStatus);
      setCurrentView(savedStatus === "active" ? "login" : "activation");
    } else {
      setDeviceStatus("inactive");
      setCurrentView("activation");
    }
  }, []);

  const simulateConnectionCheck = async (): Promise<boolean> => {
    setStatus("🔍 Mengecek koneksi...");
    setIsLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const online = Math.random() > 0.3;
        setIsOnline(online);
        setIsLoading(false);
        resolve(online);
      }, 1200);
    });
  };

  const simulateServerCheck = async (): Promise<boolean> => {
    setStatus("🌐 Mengecek server...");
    setIsLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const up = Math.random() > 0.2;
        setServerStatus(up ? "up" : "down");
        setIsLoading(false);
        resolve(up);
      }, 1000);
    });
  };

  const activateDevice = async () => {
    const online = await simulateConnectionCheck();
    if (!online) return setStatus("⚠️ Offline — periksa koneksi Anda.");

    const serverUp = await simulateServerCheck();
    if (!serverUp) return setStatus("❌ Server sedang down.");

    setStatus("🔧 Perangkat belum aktif — mulai aktivasi...");
    setCurrentView("product");
  };

  const handleLogin = () => {
    if (!email || !password) return setStatus("⚠️ Email dan password wajib diisi!");
    setStatus("🔐 Login...");
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (deviceStatus === "active") {
        setStatus("✅ Device aktif & login berhasil!");
        setCurrentView("success");
      } else setStatus("⚠️ Device belum diaktivasi!");
    }, 1500);
  };

  const handleProductSelect = (id: string) => {
    setSelectedProduct(id);
    setCurrentView("payment");
  };

  const handlePayment = () => {
    setIsLoading(true);
    setStatus("💳 Memproses pembayaran...");
    setTimeout(() => {
      setIsLoading(false);
      setCurrentView("confirmation");
    }, 2000);
  };

  const handleConfirmation = () => {
    setIsLoading(true);
    setStatus("🔄 Mengonfirmasi pembayaran...");
    setTimeout(() => {
      localStorage.setItem("deviceStatus", "active");
      setDeviceStatus("active");
      setIsLoading(false);
      setCurrentView("success");
    }, 1500);
  };

  const resetDevice = () => {
    localStorage.setItem("deviceStatus", "inactive");
    setDeviceStatus("inactive");
    setCurrentView("activation");
    setStatus("");
    setSelectedProduct("");
  };

  const renderView = () => {
    switch (currentView) {
      case "product":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-800">Pilih Produk</h2>
            <div className="space-y-3">
              {["Personal", "Bisnis", "Enterprise"].map((name, i) => (
                <button
                  key={i}
                  onClick={() => handleProductSelect(name)}
                  className={`w-full py-3 rounded-lg border transition-all duration-200 ${
                    selectedProduct === name
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-white hover:bg-gray-100 text-gray-800"
                  }`}
                >
                  {`Produk ${i + 1} - Lisensi ${name}`}
                </button>
              ))}
            </div>
            <div className="flex justify-between mt-5">
              <button
                onClick={() => setCurrentView("activation")}
                className="text-gray-600 hover:text-gray-800"
              >
                ← Kembali
              </button>
              <button
                onClick={handlePayment}
                disabled={!selectedProduct}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedProduct
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Lanjut ke Pembayaran
              </button>
            </div>
          </div>
        );

      case "payment":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-800">Pembayaran</h2>
            <p className="mb-2 text-sm text-gray-600">Produk: {selectedProduct}</p>
            <input
              type="email"
              className="w-full p-2 border rounded-lg mb-3"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="flex justify-between mt-3">
              <button
                onClick={() => setCurrentView("product")}
                className="text-gray-600 hover:text-gray-800"
              >
                ← Kembali
              </button>
              <button
                onClick={handlePayment}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                Proses Pembayaran
              </button>
            </div>
          </div>
        );

      case "confirmation":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-800">Konfirmasi</h2>
            <p className="text-gray-600 mb-4">Konfirmasi pembayaran Anda untuk menyelesaikan aktivasi.</p>
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentView("payment")}
                className="text-gray-600 hover:text-gray-800"
              >
                ← Kembali
              </button>
              <button
                onClick={handleConfirmation}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Konfirmasi Pembayaran
              </button>
            </div>
          </div>
        );

      case "success":
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-3">✅ Berhasil!</h2>
            <p className="text-gray-700 mb-5">Device Active dan Login Berhasil</p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={resetDevice}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Reset Status
              </button>
              <button
                onClick={() => setCurrentView("login")}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                Kembali ke Login
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">Login</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-between">
              <button
                onClick={activateDevice}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
              >
                Aktivasi Software
              </button>
              <button
                onClick={handleLogin}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
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
        <h1 className="text-2xl font-extrabold text-center mb-6 text-gray-800">
          🚀 Sistem Aktivasi Perangkat
        </h1>

        <div className="mb-4 p-3 bg-blue-100 rounded-lg text-center text-blue-700 font-medium">
          {isLoading ? (
            <div className="flex justify-center items-center space-x-2">
              <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              <span>{status}</span>
            </div>
          ) : (
            status || `Device Status: ${deviceStatus}`
          )}
        </div>

        {renderView()}

        <div className="mt-6 text-xs text-gray-600 text-center">
          Server: {serverStatus} • Koneksi: {isOnline ? "Online" : "Offline"}
        </div>
      </div>
    </div>
  );
};

export default App;
