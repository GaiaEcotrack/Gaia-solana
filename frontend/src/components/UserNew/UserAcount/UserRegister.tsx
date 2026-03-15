import { FcOk, FcHighPriority, FcApproval } from "react-icons/fc";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { getAuth } from "@firebase/auth";
import { SmsVerify } from "./Modal_smsVerify";
import Profile from "@/components/UserNew/UserAcount/photo_profile";
import { UpdateEmail } from "./UpdateEmail";
import { UpdatePassword } from "./UpdatePassword";
import { motion, AnimatePresence } from "framer-motion";

const UserRegister = () => {
  const URL = import.meta.env.VITE_APP_API_EXPRESS;
  
  const [userData, setUserData] = useState({
    email: localStorage.getItem("email") || '',
    _id: '',
    photo_profile: '',
    status_documents: "pending",
    full_name: '',
    identification_number: '',
    address: '',
    phone: '',
    identity_document: null,
    bank_account_status: null,
    tax_declarations: null,
    other_financial_documents: null,
  });

  const [uiState, setUiState] = useState({
    loading: true,
    completed: false,
    completeCredent: false,
    showSmsVerify: false,
    showUpdEmail: false,
    showUpdPassw: false
  });

  const [pendingItems, setPendingItems] = useState({
    documents: [] as string[],
    credentials: [] as string[]
  });

  const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({});
  const [activeTab, setActiveTab] = useState("profile");

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user?.photoURL) {
      setUserData(prev => ({ ...prev, photo_profile: user.photoURL || '' }));
    }

    const timer = setTimeout(() => {
      setUiState(prev => ({ ...prev, loading: false }));
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleSearch = useCallback(async () => {
    if (!userData.email) return;

    try {
      const response = await axios.get(`${URL}/users/search`, {
        params: { email: userData.email },
      });
      
      if (response.status === 200) {
        const { _id, photo_profile, status_documents, ...userDetails } = response.data;
        setUserData(prev => ({
          ...prev,
          _id,
          photo_profile: photo_profile || prev.photo_profile,
          status_documents,
          ...userDetails
        }));
        localStorage.setItem("id", _id);
      }
    } catch (error) {
      console.error('Error searching user:', error);
    }
  }, [URL, userData.email]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userData._id) return;

      try {
        const response = await axios.get(`${URL}/users/${userData._id}`);
        const userDataFromApi = response.data.user;

        setUserData(prev => ({ ...prev, ...userDataFromApi }));

        const pendingDocs = Object.entries(userDataFromApi)
          .filter(([key, value]) => value === null && !['device_brand', 'username', 'installation_company', 'devices', 'photo_profile', 'location'].includes(key))
          .map(([key]) => key);

        const pendingCreds = Object.entries(userDataFromApi)
          .filter(([key, value]) => value === null && ['device_brand', 'username', 'installation_company'].includes(key))
          .map(([key]) => key);

        setPendingItems({
          documents: pendingDocs,
          credentials: pendingCreds
        });

        setUiState(prev => ({
          ...prev,
          completed: pendingDocs.length === 0,
          completeCredent: pendingCreds.length === 0,
          loading: false
        }));
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [URL, userData._id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleInputChangeBucket = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files?.length) {
      setSelectedFiles(prev => ({ ...prev, [name]: files[0] }));
    }
  };

  const handlePhoneChange = (value: string) => {
    setUserData(prev => ({ ...prev, phone: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (Object.keys(selectedFiles).length === 0) {
      Toast.fire({ icon: "error", title: "No files selected" });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("subject", `KYC de ${userData.full_name}`);
      formData.append("text", `User information:
        Email: ${userData.email}, DNI: ${userData.identification_number}, 
        Address: ${userData.address}, Phone: ${userData.phone}`);

      Object.entries(selectedFiles).forEach(([key, file]) => {
        formData.append(key, file);
      });

      const response = await fetch(`${URL}/kyc/send-email`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error("Email sending failed");

      Toast.fire({ icon: "success", title: "Files sent successfully" });
    } catch (error) {
      console.error("Error:", error);
      Toast.fire({ icon: "error", title: "Error sending files" });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const tabs = [
    { id: "profile", label: "User Account", path: "/userReg", icon: null, status: userData.status_documents },
    { id: "credentials", label: "Credentials", path: "/credentialsReg", icon: null, status: uiState.completeCredent },
    // { id: "identification", label: "Identification", path: "/idVerification", icon: null },
    { id: "security", label: "Security", path: "/security", icon: null },
    { id: "device", label: "Device Register", path: "/deviceReg", icon: null },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pl-0 lg:pl-80 transition-all duration-300">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Profile Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your account information and documents</p>
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
              {tab.status && (
                <span className={`w-2 h-2 rounded-full ${
                  tab.status === "verified" ? "bg-green-500" :
                  tab.status === true ? "bg-green-500" : "bg-yellow-500"
                }`}></span>
              )}
            </Link>
          ))}
        </div>

        {/* Profile Overview Card */}
        <motion.div
          className="bg-white rounded-2xl border border-gray-200 p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-gradient-to-br from-blue-100 to-blue-50 overflow-hidden">
                <Profile />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center border-2 border-white">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl font-bold text-gray-800">{userData.full_name || "Complete your profile"}</h2>
              <p className="text-gray-600 mt-1">{userData.email}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  userData.status_documents === "verified" 
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {userData.status_documents === "verified" ? "Verified" : "Verification Pending"}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  {pendingItems.documents.length} documents pending
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                onClick={() => setUiState(prev => ({ ...prev, showUpdEmail: true }))}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Change Email
              </motion.button>
              <motion.button
                onClick={() => setUiState(prev => ({ ...prev, showUpdPassw: true }))}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Change Password
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Status Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
              <FcHighPriority className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-lg font-bold text-gray-800">{pendingItems.documents.length} items</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <FcOk className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-lg font-bold text-gray-800">{4 - pendingItems.documents.length} items</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <FcApproval className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Verified</p>
              <p className="text-lg font-bold text-gray-800">{userData.status_documents === "verified" ? "Yes" : "No"}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <motion.div
          className="bg-white rounded-2xl border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Personal Information</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={userData.full_name || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 cursor-not-allowed"
                  disabled
                />
              </div>

              {/* Identification */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Identification Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="identification_number"
                  value={userData.identification_number || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Your ID number"
                  required
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Residence Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={userData.address || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Your current address"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <PhoneInput
                  country={"co"}
                  value={userData.phone}
                  onChange={handlePhoneChange}
                  inputStyle={{
                    width: '100%',
                    height: '42px',
                    fontSize: '14px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    paddingLeft: '48px',
                  }}
                  buttonStyle={{
                    border: '1px solid #d1d5db',
                    borderRadius: '8px 0 0 8px',
                    background: '#f9fafb',
                  }}
                  containerStyle={{
                    width: '100%',
                  }}
                />
              </div>
            </div>

            {/* File Uploads */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Required Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['identity_document', 'bank_account_status', 'tax_declarations', 'other_financial_documents'].map((field) => (
                  <div key={field} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {field.replace(/_/g, ' ').toUpperCase()}
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        name={field}
                        onChange={handleInputChangeBucket}
                        accept="image/jpeg, image/png, application/pdf"
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      {userData[field as keyof typeof userData] && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <FcOk className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex justify-end">
                <motion.button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Save Changes
                </motion.button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Modals */}
      <SmsVerify 
        showSmsVerify={uiState.showSmsVerify} 
        setShowSmsVerify={(val) => setUiState(prev => ({ ...prev, showSmsVerify: val }))} 
        telephone={userData.phone} 
      />
      <UpdateEmail 
        showUpdEmail={uiState.showUpdEmail} 
        setShowUpdEmail={(val) => setUiState(prev => ({ ...prev, showUpdEmail: val }))} 
      />
      <UpdatePassword 
        showUpdPassw={uiState.showUpdPassw} 
        setShowUpdPassw={(val) => setUiState(prev => ({ ...prev, showUpdPassw: val }))} 
      />
    </div>
  );
};

export { UserRegister };