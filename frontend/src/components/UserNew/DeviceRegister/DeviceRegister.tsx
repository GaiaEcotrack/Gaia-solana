import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useAccount } from "@gear-js/react-hooks";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const DeviceRegister = () => {
  const URL = import.meta.env.VITE_APP_API_EXPRESS;
  const { account } = useAccount();

  const [formData, setFormData] = useState({
    user_id: localStorage.getItem("id"),
    device: {
      deviceId: "",
      deviceName: "",
      deviceTimezone: "UTC-5",
      serial: "",
      image: "",
      deviceBrand: ""
    },
  });

  const [foundUserId, setFoundUserId] = useState("");
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("device");
  const [showSuccess, setShowSuccess] = useState(false);

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  useEffect(() => {
    const userId = localStorage.getItem("id");
    if (userId) setFoundUserId(userId);
    setIsLoadingUser(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      device: {
        ...prev.device,
        [name]: value,
      }
    }));
  };

  const postDataToBlockchain = useCallback(async () => {
    const token = localStorage.getItem("token");

    try {
      const { serial, deviceName, deviceBrand } = formData.device;
      const data = [
        account?.decodedAddress || "",
        serial,
        "Colombia",
        deviceName,
        deviceBrand
      ];

      await axios.post(`${URL}/service/GaiaService/AddDevice`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

    } catch (err) {
      console.error("Error posting to blockchain:", err);
      throw err;
    }
  }, [account?.decodedAddress, formData.device, URL]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!foundUserId) {
      Toast.fire({ icon: "error", title: "User ID not found" });
      setIsSubmitting(false);
      return;
    }

    if (!account?.decodedAddress) {
      Toast.fire({ icon: "error", title: "Please connect your wallet" });
      setIsSubmitting(false);
      return;
    }

    try {
      await postDataToBlockchain();
      Toast.fire({ icon: "success", title: "Device added to blockchain successfully" });
      setShowSuccess(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          user_id: localStorage.getItem("id"),
          device: {
            deviceId: "",
            deviceName: "",
            deviceTimezone: "UTC-5",
            serial: "",
            image: "",
            deviceBrand: ""
          },
        });
        setShowSuccess(false);
      }, 2000);

    } catch (error) {
      console.error("Submission error:", error);
      Toast.fire({ icon: "error", title: "Error adding device to blockchain" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: "profile", label: "User Account", path: "/profile" },
    { id: "credentials", label: "Credentials", path: "/credentialsReg" },
    // { id: "identification", label: "Identification", path: "/idVerification" },
    { id: "security", label: "Security", path: "/security" },
    { id: "device", label: "Device Register", path: "/deviceReg" },
  ];

  const deviceBrands = [
    "Hoymiles",
    "Solis",
    "SMA",
    "Growatt",
    "Fronius",
    "SolarEdge",
    "Enphase",
    "Other"
  ];

  const timezones = [
    "UTC-5 (Colombia)",
    "UTC-8 (PST)",
    "UTC-7 (MST)",
    "UTC-6 (CST)",
    "UTC-5 (EST)",
    "UTC+0 (GMT)",
    "UTC+1 (CET)",
    "UTC+2 (EET)",
    "Other"
  ];

  return (
    <div className="min-h-screen text-black bg-gray-50 pl-0 lg:pl-80 transition-all duration-300">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Device Registration</h1>
              <p className="text-gray-500 text-sm mt-1">Register your energy device on the Gaia blockchain</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-sm text-gray-600">Blockchain Ready</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 mb-8">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              to={tab.path}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-green-800">Device Registered Successfully!</h3>
                  <p className="text-sm text-green-600">Your device has been added to the Gaia blockchain.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Device Information</h3>
                <p className="text-gray-500 text-sm">Enter your device details to register it on the blockchain</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Device ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Device ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="deviceId"
                      value={formData.device.deviceId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      placeholder="e.g., DEV-001"
                      required
                    />
                  </div>

                  {/* Device Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Device Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="deviceName"
                      value={formData.device.deviceName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      placeholder="e.g., Solar Inverter 5kW"
                      required
                    />
                  </div>

                  {/* Device Brand */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Device Brand <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="deviceBrand"
                        value={formData.device.deviceBrand}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors appearance-none bg-white"
                      >
                        <option value="" disabled>Select brand</option>
                        {deviceBrands.map((brand) => (
                          <option key={brand} value={brand}>{brand}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Serial Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Serial Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="serial"
                      value={formData.device.serial}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      placeholder="Device serial number"
                      required
                    />
                  </div>

                  {/* Timezone */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Device Timezone
                    </label>
                    <div className="relative">
                      <select
                        name="deviceTimezone"
                        value={formData.device.deviceTimezone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors appearance-none bg-white"
                      >
                        {timezones.map((tz) => (
                          <option key={tz} value={tz}>{tz}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex justify-end gap-3">
                    <Link to="/credentialsReg">
                      <motion.button
                        type="button"
                        className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Back
                      </motion.button>
                    </Link>
                    <motion.button
                      type="submit"
                      disabled={isSubmitting || !account?.decodedAddress}
                      className={`px-6 py-3 rounded-lg font-medium transition-all ${
                        isSubmitting || !account?.decodedAddress
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                      }`}
                      whileHover={!isSubmitting && account?.decodedAddress ? { scale: 1.05 } : {}}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Registering...
                        </div>
                      ) : !account?.decodedAddress ? (
                        "Connect Wallet First"
                      ) : (
                        "Register Device"
                      )}
                    </motion.button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Info Panel */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Wallet Status */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-800 mb-4">Wallet Status</h4>
              <div className="space-y-4">
                <div className={`flex items-center gap-3 p-3 rounded-lg ${account?.decodedAddress ? "bg-green-50" : "bg-yellow-50"}`}>
                  <div className={`w-3 h-3 rounded-full ${account?.decodedAddress ? "bg-green-500" : "bg-yellow-500"}`}></div>
                  <div>
                    <p className="text-sm font-medium">
                      {account?.decodedAddress ? "Wallet Connected" : "Wallet Not Connected"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {account?.decodedAddress ? "Ready for blockchain registration" : "Connect wallet to register device"}
                    </p>
                  </div>
                </div>
                
                {account?.decodedAddress && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Connected Address</p>
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {account.decodedAddress.slice(0, 12)}...{account.decodedAddress.slice(-8)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Registration Info */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Why Register on Blockchain?</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      Immutable device ownership record
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      Enables energy tokenization
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      Secure and transparent tracking
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      Required for Gaia token rewards
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Required Fields */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-800 mb-4">Required Information</h4>
              <div className="space-y-3">
                {[
                  { label: "Device ID", completed: !!formData.device.deviceId },
                  { label: "Device Name", completed: !!formData.device.deviceName },
                  { label: "Device Brand", completed: !!formData.device.deviceBrand },
                  { label: "Serial Number", completed: !!formData.device.serial },
                  { label: "Wallet Connected", completed: !!account?.decodedAddress },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item.label}</span>
                    <div className={`w-3 h-3 rounded-full ${item.completed ? "bg-green-500" : "bg-gray-300"}`}></div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export { DeviceRegister };