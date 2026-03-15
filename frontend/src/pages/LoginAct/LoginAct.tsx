import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from 'react';
import { SignUp } from "../../components/Login/SignUp";
import '../../global.css'
import { AuthProvider } from "@/contexts/AuthContext";
import { TwoFactorAuth } from "@/components/Login/TwoFactorAuth";
import axios from "axios";
import { ResetPassword } from "@/components/Login/ResetPassword";
import SignUpInstaller from "@/components/Login/SingUpInstallerOrCommercial";
import { motion } from "framer-motion";

export interface ILoginPageProps {}

function AuthForm(props: ILoginPageProps): JSX.Element {
  const URL = import.meta.env.VITE_APP_API_EXPRESS;
  const navigate = useNavigate();
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSignUpInstaller, setShowSignUpInstaller] = useState(false);
  const [showResetPass, setShowResetPass] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [loadingE, setLoadingE] = useState(false);
  const [showTwoFA, setShowTwoFA] = useState(false);
  const [foundUserId, setFoundUserId] = useState('');
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const eye = <BsEye className="w-5 h-5 text-gray-500" />;
  const eyeSlash = <BsEyeSlash className="w-5 h-5 text-gray-500" />;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!emailRef.current || !passwordRef.current) {
      return setError("Email and password are required");
    }

    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value;

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!emailRegex.test(email)) {
      return setError("Invalid email format");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    localStorage.clear();

    try {
      setError("");
      setLoadingE(true);

      const loginResponse = await axios.post(`${URL}/auth/login`, {
        email,
        password
      });

      if (loginResponse.status === 200) {
        const { token, user } = loginResponse.data;

        localStorage.setItem('token', token);
        localStorage.setItem('id', user.id);
        localStorage.setItem('email', user.email);
        if (user.full_name) localStorage.setItem('name', user.full_name);
        if (user.username) localStorage.setItem('username', user.username);

        const redirectPath = new URLSearchParams(window.location.search).get("redirect") || "/home";

        if (user.verified_2fa) {
          setFoundUserId(user.id);
          setShowTwoFA(true);
          setLoadingE(false);
          return;
        }

        try {
          const userData = await axios.get(`${URL}/users/search`, {
            params: { email }
          });
          
          if (userData.data) {
            const company = userData.data.installation_company || "";
            const profilePic = userData.data.photo_profile || "";
            
            if (company) localStorage.setItem("company", company);
            if (profilePic) localStorage.setItem("profilePic", profilePic);
          }
        } catch (userDataError) {
          console.log("Could not retrieve additional user data");
        }

        if (user.role === "Installer" || user.role === "Comercial") {
          navigate("/dashInstaller");
        } else if (user.role === "Government") {
          navigate("/dashGovernament");
        } else if (user.role === "Administrator" || user.role === "Admin") {
          navigate("/dashAdmin");
        } else {
          navigate(redirectPath);
        }
      }
    } catch (error: any) {
      let errorMessage = "Login error";
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Invalid credentials. Please check your email and password.";
        } else if (error.response.status === 400) {
          errorMessage = error.response.data?.error || "Invalid data";
        } else if (error.response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else {
          errorMessage = error.response.data?.error || error.response.data?.message || "Server connection error";
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      setLoadingE(false);
    } finally {
      setLoadingE(false);
    }
  }

  return (
    <div className="min-h-screen text-black bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header for consistency */}
      <div className="absolute top-0 left-0 right-0 bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/LogoGaia.svg" alt="Gaia Logo" className="w-8 h-8" />
            <span className="font-bold text-gray-800">Gaia EcoTrack</span>
          </div>
          <span className="text-sm text-gray-500">Energy Tokenization Platform</span>
        </div>
      </div>

      <div className="flex min-h-screen items-center justify-center px-4 pt-20">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Login Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Card Header */}
            <div className="p-8 text-center border-b border-gray-100">
              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-100 to-green-100 p-4">
                  <img src="/LogoGaia.svg" alt="Gaia Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
                  <p className="text-gray-500 text-sm mt-1">Sign in to your Gaia EcoTrack account</p>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    ref={emailRef}
                    type="email"
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    required
                  />
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowResetPass(true)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      ref={passwordRef}
                      type={visible ? 'text' : 'password'}
                      placeholder="Enter your password"
                      minLength={6}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors pr-10"
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setVisible(!visible)}
                    >
                      {visible ? eyeSlash : eye}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    className="p-3 bg-red-50 border border-red-200 rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <p className="text-sm text-red-600 text-center">{error}</p>
                  </motion.div>
                )}

                {/* Sign In Button */}
                <motion.button
                  type="submit"
                  disabled={loadingE}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                    loadingE
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                  }`}
                  whileHover={!loadingE ? { scale: 1.02 } : {}}
                  whileTap={!loadingE ? { scale: 0.98 } : {}}
                >
                  {loadingE ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Signing in...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </motion.button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
                  </div>
                </div>

                {/* Sign Up Button */}
                <button
                  type="button"
                  onClick={() => setShowSignUp(true)}
                  className="w-full py-3 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all font-medium"
                >
                  Create Account
                </button>

                {/* Optional: Installer/Commercial Account */}
                <button
                  type="button"
                  onClick={() => setShowSignUpInstaller(true)}
                  className="w-full py-3 px-4 rounded-lg text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Create installer or commercial account
                </button>
              </form>
            </div>

            {/* Card Footer */}
            <div className="border-t border-gray-100 p-6 bg-gray-50">
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  By signing in, you agree to our{" "}
                  <a href="#" className="text-blue-600 hover:text-blue-700">Terms</a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-600 hover:text-blue-700">Privacy Policy</a>
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Secure blockchain authentication</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Energy tokenization platform</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <AuthProvider>
        <SignUp showSignUp={showSignUp} setShowSignUp={setShowSignUp} />
        <SignUpInstaller showSignUp={showSignUpInstaller} setShowSignUp={setShowSignUpInstaller} />
        <ResetPassword showResetPass={showResetPass} setShowResetPass={setShowResetPass} />
      </AuthProvider>
      <TwoFactorAuth showTwoFA={showTwoFA} setShowTwoFA={setShowTwoFA} foundUserId={foundUserId} />
    </div>
  );
}

export { AuthForm };