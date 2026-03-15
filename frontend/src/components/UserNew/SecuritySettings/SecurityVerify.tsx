import { FcOk, FcHighPriority, FcFeedback, FcGoogle, FcSms, FcPhoneAndroid } from "react-icons/fc"; 
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ModalGoogleAuth } from "./Modal_GoogleAuth";
import { SmsSendVerify } from "./Modal_smsSendVerify";
import { EmailVerify } from "./Modal_emailVerify";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { motion } from "framer-motion";

function SecurityVerify() {
  const URL = import.meta.env.VITE_APP_API_URL
  const [showGAuth, setShowGAuth] = useState(false)
  const [showSmsSendVerify, setShowSmsSendVerify] = useState(false)
  const [showEmailVerify, setShowEmailVerify] = useState(false)
  const [verified_2fa, setVerified_2fa] = useState('')
  const [verified_email, setVerified_email] = useState('')
  const [verified_sms, setVerified_sms] = useState('')
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("security");
  const [telephone, setTelephone] = useState("");

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const handleSearch = async () => {
      try {        
        if(user && user.emailVerified){
          const userId = localStorage.getItem('id')
          await axios.put(`${URL}/users/${userId}`, {
            verified_email: true  
          }); 
        } 
        const email = localStorage.getItem("email");        
        const response = await axios.get(`${URL}/users/search`, {
          params: {
            email: email,
          },
        });
        if (response.status === 200) {
          setVerified_2fa(response.data.verified_2fa);
          setVerified_email(response.data.verified_email);
          setVerified_sms(response.data.verified_sms);
          setTelephone(response.data.phone || "");
        } 
        setLoading(false) 
      } catch (error) {
        console.log("Error de red: ", error ) 
      }
    };
    handleSearch();
  }, [URL, user]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const tabs = [
    { id: "profile", label: "User Account", path: "/profile" },
    { id: "credentials", label: "Credentials", path: "/credentialsReg" },
    // { id: "identification", label: "Identification", path: "/idVerification" },
    { id: "security", label: "Security", path: "/security" },
    { id: "device", label: "Device Register", path: "/deviceReg" },
  ];

  const securityMethods = [
    {
      id: "google_auth",
      icon: <FcPhoneAndroid className="w-12 h-12" />,
      title: "Google Authenticator",
      description: "TOTP is used as a security check when you log in, make transactions, or change security settings.",
      status: verified_2fa,
      actionText: "Bind",
      action: () => setShowGAuth(true),
      color: "from-blue-50 to-blue-100"
    },
    {
      id: "email_verify",
      icon: <FcFeedback className="w-12 h-12" />,
      title: "Email Verification",
      description: "Verify your email address to secure your account and receive important notifications.",
      status: verified_email,
      actionText: "Verify Now",
      action: () => setShowEmailVerify(true),
      color: "from-green-50 to-green-100"
    },
    {
      id: "sms_verify",
      icon: <FcSms className="w-12 h-12" />,
      title: "SMS Verification",
      description: "Add an extra layer of security with SMS verification for critical account actions.",
      status: verified_sms,
      actionText: "Verify Now",
      action: () => setShowSmsSendVerify(true),
      color: "from-purple-50 to-purple-100"
    }
  ];

  const getVerificationStatus = (status: any) => {
    if (loading) return "loading";
    return status ? "verified" : "pending";
  };

  return (
    <div className="min-h-screen bg-gray-50 pl-0 lg:pl-80 transition-all duration-300">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Security Settings</h1>
              <p className="text-gray-500 text-sm mt-1">Secure your account with multiple verification methods</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-600">
                {securityMethods.filter(m => m.status).length} of {securityMethods.length} methods active
              </div>
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

        {/* Security Overview */}
        <motion.div
          className="bg-white rounded-2xl border border-gray-200 p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800 mb-2">
                {securityMethods.filter(m => m.status).length}
              </div>
              <div className="text-sm text-gray-500">Active Methods</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800 mb-2">
                {securityMethods.length - securityMethods.filter(m => m.status).length}
              </div>
              <div className="text-sm text-gray-500">Pending Setup</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold mb-2 ${
                securityMethods.filter(m => m.status).length >= 2 ? "text-green-600" : "text-yellow-600"
              }`}>
                {securityMethods.filter(m => m.status).length >= 2 ? "Secure" : "Medium"}
              </div>
              <div className="text-sm text-gray-500">Security Level</div>
            </div>
          </div>
        </motion.div>

        {/* Security Methods */}
        <div className="space-y-6">
          {securityMethods.map((method, index) => (
            <motion.div
              key={method.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  {/* Icon */}
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${method.color} flex items-center justify-center`}>
                    {method.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">{method.title}</h3>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {getVerificationStatus(method.status) === "loading" ? (
                          <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                        ) : getVerificationStatus(method.status) === "verified" ? (
                          <div className="flex items-center gap-2 text-green-600">
                            <FcOk className="w-6 h-6" />
                            <span className="text-sm font-medium">Verified</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-yellow-600">
                            <FcHighPriority className="w-6 h-6" />
                            <span className="text-sm font-medium">Pending</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-end mt-4">
                      <motion.button
                        onClick={method.action}
                        className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
                          getVerificationStatus(method.status) === "verified"
                            ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={getVerificationStatus(method.status) === "loading"}
                      >
                        {getVerificationStatus(method.status) === "verified" ? "Configure" : method.actionText}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Security Tips */}
        <motion.div
          className="mt-8 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Security Recommendations</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  Enable at least 2 verification methods for maximum security
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  Google Authenticator provides the strongest protection
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  Keep your verification methods up to date
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  Never share your verification codes with anyone
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <ModalGoogleAuth showGAuth={showGAuth} setShowGAuth={setShowGAuth}/>
      <SmsSendVerify 
        showSmsSendVerify={showSmsSendVerify} 
        setShowSmsSendVerify={setShowSmsSendVerify} 
        telephone={telephone}
      />
      <EmailVerify showEmailVerify={showEmailVerify} setShowEmailVerify={setShowEmailVerify}/>
    </div>
  );
}

export { SecurityVerify };