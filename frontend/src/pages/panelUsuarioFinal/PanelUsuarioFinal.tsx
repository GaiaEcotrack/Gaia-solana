import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useTypewriter } from "react-simple-typewriter";
import { IoIosAddCircle, IoIosRefresh } from "react-icons/io";
import { getAuth } from "firebase/auth";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

import { ApiLoader } from "../../components/loaders/api-loader/ApiLoader";
import { fetchDataGrowattDevice, fetchDataHoymilesDevices } from "./Hoymiles";

// Fallbacks para imágenes
const FALLBACKS = {
  device: "https://via.placeholder.com/56?text=DV",
  brand: "https://via.placeholder.com/48x16?text=Brand",
  banner: "https://via.placeholder.com/64?text=IO",
};

interface Dispositivo {
  id: number;
  model_no: string;
  hard_ver: string;
  productId: number;
  warn_data: { connect?: boolean };
  soft_ver: string;
  dtu_sn: string;
  generatorPower: number;
  timezone: string;
  sn?: string;
  extend_data?: { grid_name?: string };
}

interface User {
  device_brand: string;
  username: string;
}

interface RootState {
  app: {
    loggedInUser: User[];
  };
}

const PanelUsuarioFinal = () => {
  const userRedux = useSelector((state: RootState) => state.app.loggedInUser);
  const user = userRedux?.[0];
  const brand = user?.device_brand;
  const username = user?.username;

  const [devices, setDevices] = useState<Dispositivo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Dispositivo | null>(null);
  const [name, setName] = useState("");
  const [userError, setUserError] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) setName(storedName);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [typeEffect] = useTypewriter({
    words: [`Manage your energy devices • ${brand || "Unknown Brand"}`],
    loop: true,
    typeSpeed: 70,
    deleteSpeed: 30,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!brand || !username) {
        setIsLoading(false);
        setUserError(true);
        return;
      }

      try {
        setIsLoading(true);
        let result: Dispositivo[] | undefined;

        if (brand === "Hoymiles") {
          result = await fetchDataHoymilesDevices(username, setDevices, setIsLoading);
        } else if (brand === "Growatt") {
          result = await fetchDataGrowattDevice(username, setDevices, setIsLoading);
        }

        if (Array.isArray(result)) {
          setDevices(result);
        } else {
          console.error("Expected array but got:", result);
          setDevices([]);
        }
      } catch (error) {
        console.error("Error fetching devices:", error);
        setUserError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) fetchData();
  }, [user]);

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser || !username || !brand) {
        console.error("User not logged in or brand missing");
        setUserError(true);
        return;
      }

      let result: Dispositivo[] | undefined;
      if (brand === "Hoymiles") {
        result = await fetchDataHoymilesDevices(username, setDevices, setIsLoading);
      } else if (brand === "Growatt") {
        result = await fetchDataGrowattDevice(username, setDevices, setIsLoading);
      } else {
        console.warn("Unknown brand:", brand);
      }

      if (Array.isArray(result)) {
        setDevices(result);
      } else if (result !== undefined) {
        console.warn("Unexpected response:", result);
        setDevices([]);
      }
    } catch (error) {
      console.error("Error updating devices:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (device: Dispositivo) => {
    setSelectedDevice(device);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDevice(null);
  };

  const deviceImages = [
    "https://cdn-icons-png.flaticon.com/512/3095/3095119.png",
  ];

  const brandImages: Record<string, string> = {
    Hoymiles: "https://www.hoymiles.com/wp-content/uploads/2022/05/Hoymiles-logo.png",
    Growatt: "/Growatt-logo.png",
  };

  const imagenSrc = brandImages[brand || ""] || "";

  const handleImgError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
    fallbackSrc: string
  ) => {
    const target = e.currentTarget;
    target.onerror = null;
    target.src = fallbackSrc;
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pl-0 lg:pl-80 transition-all duration-300">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Device Management</h1>
              <p className="text-gray-500 text-sm mt-1">{typeEffect}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <motion.button
                onClick={handleUpdate}
                disabled={isLoading || !brand}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isLoading || !brand
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                    : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                }`}
                whileHover={(!isLoading && brand) ? { scale: 1.05 } : {}}
                whileTap={{ scale: 0.95 }}
              >
                <IoIosRefresh className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
              </motion.button>

              <NavLink to="/deviceReg">
                <motion.button
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IoIosAddCircle className="w-5 h-5" />
                  <span className="hidden sm:inline">Add Device</span>
                  <span className="sm:hidden">Add</span>
                </motion.button>
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        {/* Stats Overview */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-sm text-gray-500">Total Devices</div>
            <div className="text-xl sm:text-2xl font-bold text-gray-800">{devices.length}</div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-sm text-gray-500">Connected</div>
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {devices.filter(d => d.warn_data?.connect).length}
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-sm text-gray-500">Disconnected</div>
            <div className="text-xl sm:text-2xl font-bold text-gray-600">
              {devices.filter(d => !d.warn_data?.connect).length}
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-sm text-gray-500">Brand</div>
            <div className="text-xl sm:text-2xl font-bold text-blue-600 truncate">{brand || "None"}</div>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <ApiLoader />
          </div>
        ) : userError ? (
          // Error State
          <motion.div
            className="flex flex-col items-center justify-center h-96 bg-white rounded-2xl border border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center p-8">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Authentication Required</h3>
              <p className="text-gray-600 mb-6">Please log in to access device management</p>
              <NavLink to="/">
                <motion.button
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Go to Login
                </motion.button>
              </NavLink>
            </div>
          </motion.div>
        ) : (
          // Devices Grid
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Your Energy Devices</h2>
              <span className="text-sm text-gray-500">{devices.length} device{devices.length !== 1 ? 's' : ''}</span>
            </div>

            {devices.length === 0 ? (
              <motion.div
                className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-gray-200 border-dashed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <IoIosAddCircle className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Devices Found</h3>
                <p className="text-gray-600 mb-4 text-center px-4">Add your first energy device to start tracking energy production</p>
                <NavLink to="/deviceReg">
                  <motion.button
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add Your First Device
                  </motion.button>
                </NavLink>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {devices.map((device, index) => (
                  <motion.div
                    key={device.id || index}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                    onClick={() => openModal(device)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -5 }}
                  >
                    {/* Device Header */}
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center">
                            <img
                              src={deviceImages[0]}
                              alt="Device"
                              className="w-6 h-6"
                              onError={(e) => handleImgError(e, FALLBACKS.device)}
                            />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-gray-800 truncate">{device.model_no}</h3>
                            <p className="text-xs text-gray-500 truncate">{brand}</p>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          device.warn_data?.connect
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-gray-50 text-gray-600 border border-gray-200"
                        }`}>
                          {device.warn_data?.connect ? "Online" : "Offline"}
                        </div>
                      </div>
                    </div>

                    {/* Device Info */}
                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs mb-1">Serial</p>
                          <p className="font-medium text-gray-800 truncate">{device.dtu_sn || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-1">Power</p>
                          <p className="font-medium text-gray-800">{device.generatorPower || "0"} W</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-1">Hardware</p>
                          <p className="font-medium text-gray-800 truncate">{device.hard_ver}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-1">Software</p>
                          <p className="font-medium text-gray-800 truncate">{device.soft_ver}</p>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <div className="text-center text-blue-600 text-sm font-medium hover:text-blue-700">
                          View Details
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && selectedDevice && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            />
            
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center">
                        <img
                          src={deviceImages[0]}
                          alt="Device"
                          className="w-8 h-8"
                          onError={(e) => handleImgError(e, FALLBACKS.device)}
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 truncate max-w-[200px]">{selectedDevice.model_no}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-500 truncate max-w-[120px]">{brand}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            selectedDevice.warn_data?.connect
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "bg-gray-50 text-gray-600 border border-gray-200"
                          }`}>
                            {selectedDevice.warn_data?.connect ? "Connected" : "Disconnected"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={closeModal}
                      className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Serial Number</p>
                        <p className="font-medium text-gray-800 break-all">{selectedDevice.dtu_sn || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Product ID</p>
                        <p className="font-medium text-gray-800">{selectedDevice.productId}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Hardware Version</p>
                        <p className="font-medium text-gray-800">{selectedDevice.hard_ver}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Power Output</p>
                        <p className="font-medium text-gray-800">{selectedDevice.generatorPower || "0"} W</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Timezone</p>
                        <p className="font-medium text-gray-800">{selectedDevice.timezone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Software Version</p>
                        <p className="font-medium text-gray-800">{selectedDevice.soft_ver}</p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Device ID</p>
                    <p className="font-medium text-gray-800">#{selectedDevice.id}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex gap-3">
                      <button
                        onClick={closeModal}
                        className="flex-1 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all text-sm"
                      >
                        Close
                      </button>
                      <button className="flex-1 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all text-sm">
                        View Full Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PanelUsuarioFinal;