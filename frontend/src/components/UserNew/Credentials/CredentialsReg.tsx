import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { FcHighPriority, FcOk } from "react-icons/fc";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { getAuth } from "firebase/auth";
import { useAccount } from "@gear-js/react-hooks";
import { motion, AnimatePresence } from "framer-motion";

const CredentialsReg = () => {
  const auth = getAuth();
  const { account } = useAccount();
  const userLogin = auth.currentUser?.displayName ?? "";

  const [email, setEmail] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [formData, setFormData] = useState({
    device_brand: '',
    username: '',
    installation_company: '',
  });
  const [foundUserId, setFoundUserId] = useState('');
  const [completeCredent, setCompleteCredent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("credentials");

  const URL = import.meta.env.VITE_APP_API_EXPRESS;
  const username = import.meta.env.VITE_APP_ADMIN_USER;
  const password = import.meta.env.VITE_APP_ADMIN_PASSWORD;

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  const updateUserField = async (property: string, value: any) => {
    if (!foundUserId) return;
    await fetch(`${URL}/users/${foundUserId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: foundUserId, property, value }),
    });
  };

  const createGenerator = useCallback(async () => {
    try {
      const loginRes = await axios.post(`${URL}/auth/login`, { username, password });
      const token = loginRes.data.token;
      localStorage.setItem('token', token);

      await axios.post(
        `${URL}/generator/users`,
        {
          name: userLogin,
          email: userData?.email ?? "",
          membership: userData?.membresia ?? false,
          wallet: account?.address,
          secret_name: formData.username,
          installation_company: formData.installation_company,
          brand: formData.device_brand,
          country: "Colombia",
          departament: "-",
          municipality: "-"
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error(err);
    }
  }, [account?.address, userData, formData, userLogin, URL, username, password]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await Promise.all([
        updateUserField('device_brand', formData.device_brand),
        updateUserField('username', formData.username),
        updateUserField('installation_company', formData.installation_company),
      ]);

      Toast.fire({ icon: "success", title: "Credentials saved successfully" });
      await createGenerator();
      setCompleteCredent(true);
      localStorage.setItem("completeCredent", "true");
    } catch (err) {
      Toast.fire({ icon: "error", title: "Error saving credentials" });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    const emailStored = localStorage.getItem("email");
    const completed = localStorage.getItem("completeCredent");
    if (emailStored) setEmail(emailStored);
    setCompleteCredent(completed === "true");

    if (emailStored) {
      axios.get(`${URL}/users/search`, { params: { email: emailStored } })
        .then(res => {
          if (res.status === 200 && res.data?._id) {
            setFoundUserId(res.data._id);
          }
        }).catch(console.error);
    }

    setTimeout(() => setLoading(false), 3000);
  }, [URL]);

  useEffect(() => {
    if (!foundUserId) return;
    localStorage.setItem("id", foundUserId);

    axios.get(`${URL}/users/${foundUserId}`)
      .then(res => {
        const user = res.data.user;
        setUserData(user);
        setFormData({
          device_brand: user.device_brand ?? '',
          username: user.username ?? '',
          installation_company: user.installation_company ?? '',
        });
      }).catch(console.error);
  }, [foundUserId, URL]);

  const tabs = [
    { id: "profile", label: "User Account", path: "/profile" },
    { id: "credentials", label: "Credentials", path: "/credentialsReg" },
    // { id: "identification", label: "Identification", path: "/idVerification" },
    { id: "security", label: "Security", path: "/security" },
    { id: "device", label: "Device Register", path: "/deviceReg" },
  ];

  const deviceBrands = ["Hoymiles", "Solis", "SMA", "Growatt", "Other"];
  const installationCompanies = [
    "Fibra_Andina",
    "Green_house",
    "Proselec",
    "Fullenergysolar",
    "Sachar",
    "EFEE",
    "Other"
  ];

  return (
    <div className="min-h-screen text-black bg-gray-50 pl-0 lg:pl-80 transition-all duration-300">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Device Credentials</h1>
              <p className="text-gray-500 text-sm mt-1">Configure your energy device settings</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${completeCredent ? "bg-green-500" : "bg-yellow-500"}`}></div>
              <span className="text-sm text-gray-600">
                {completeCredent ? "Configured" : "Setup Required"}
              </span>
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
              {tab.id === "credentials" && (
                <span className={`w-2 h-2 rounded-full ${
                  completeCredent ? "bg-green-500" : "bg-yellow-500"
                }`}></span>
              )}
            </Link>
          ))}
        </div>

        {/* Status Card */}
        <motion.div
          className="bg-white rounded-2xl border border-gray-200 p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Credentials Status</h3>
                <p className="text-sm text-gray-500">
                  {completeCredent ? "All credentials configured" : "Complete setup to connect devices"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {completeCredent ? (
                <div className="flex items-center gap-2 text-green-600">
                  <FcOk className="w-6 h-6" />
                  <span className="font-medium">Completed</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-yellow-600">
                  <FcHighPriority className="w-6 h-6" />
                  <span className="font-medium">Pending</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          className="bg-white rounded-2xl border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Device Configuration</h3>
            <p className="text-gray-500 text-sm">
              Enter your device credentials to enable energy tracking and tokenization
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Device Brand */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Device Brand <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="device_brand"
                    value={formData.device_brand}
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
                <p className="text-xs text-gray-500 mt-2">Select your inverter manufacturer</p>
              </div>

              {/* Secret Key */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secret Key <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Enter your secret key"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">Unique identifier for your device</p>
              </div>

              {/* Installation Company */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Installation Company <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="installation_company"
                    value={formData.installation_company}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors appearance-none bg-white"
                  >
                    <option value="" disabled>Select company</option>
                    {installationCompanies.map((company) => (
                      <option key={company} value={company}>{company}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Company that installed your system</p>
              </div>
            </div>

            {/* Connection Status */}
            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Connection Status</h4>
              <div className="flex flex-wrap gap-3">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${formData.device_brand ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  <div className={`w-2 h-2 rounded-full ${formData.device_brand ? "bg-green-500" : "bg-gray-400"}`}></div>
                  <span className="text-sm">Device Brand</span>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${formData.username ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  <div className={`w-2 h-2 rounded-full ${formData.username ? "bg-green-500" : "bg-gray-400"}`}></div>
                  <span className="text-sm">Secret Key</span>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${formData.installation_company ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  <div className={`w-2 h-2 rounded-full ${formData.installation_company ? "bg-green-500" : "bg-gray-400"}`}></div>
                  <span className="text-sm">Installation Company</span>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${account?.address ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  <div className={`w-2 h-2 rounded-full ${account?.address ? "bg-green-500" : "bg-gray-400"}`}></div>
                  <span className="text-sm">Wallet Connected</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {completeCredent ? "Your credentials are configured" : "Complete all fields to enable device connection"}
                </div>
                <div className="flex gap-3">
                  <Link to="/userReg">
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
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </div>
                    ) : "Save Credentials"}
                  </motion.button>
                </div>
              </div>
            </div>
          </form>
        </motion.div>

        {/* Info Card */}
        <motion.div
          className="mt-6 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Important Information</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  Your secret key is provided by your device manufacturer
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  These credentials are required for real-time energy tracking
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  Ensure your wallet is connected for token rewards
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export { CredentialsReg };