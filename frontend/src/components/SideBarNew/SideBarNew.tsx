import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import axios from "axios";
import {
  CgMenu,
  CgProfile
} from "react-icons/cg";
import { ImStatsBars } from "react-icons/im";
import { IoLogoUsd } from "react-icons/io";
import { FaSolarPanel } from "react-icons/fa";
import { SiBlockchaindotcom } from "react-icons/si";
import { AccountInfo } from "../layout/header/account-info";
import version from "../../../version";
import { motion, AnimatePresence } from "framer-motion";

const Menus = [
  { id: 1, title: "Dashboard", icon: <ImStatsBars />, to: "/home", color: "from-blue-500 to-blue-600" },
  { id: 2, title: "Transactions", icon: <IoLogoUsd />, to: "/dashboard", color: "from-green-500 to-green-600" },
  { id: 3, title: "Devices", icon: <FaSolarPanel />, to: "/devices", color: "from-orange-500 to-orange-600" },
  { id: 4, title: "Profile", icon: <CgProfile />, to: "/profile", color: "from-purple-500 to-purple-600" },
  { id: 5, title: "BlockChain", icon: <SiBlockchaindotcom />, to: "/blockchain", color: "from-indigo-500 to-indigo-600" },
];

export function SideBarNew() {
  const navigate = useNavigate();
  const auth = getAuth();
  const URL = import.meta.env.VITE_APP_API_EXPRESS;
  const [open, setOpen] = useState(true);
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState(1);

  const toggleSidebar = () => setOpen((prev) => !prev);

  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    } finally {
      localStorage.clear();
      navigate("/");
    }
  };

  const fallbackPhoto = "/avatar.webp";

  const fetchAndUpdatePhoto = useCallback(async () => {
    const user = auth.currentUser;
    const userId = localStorage.getItem("id");

    if (!user || !userId) return;

    const isGoogleUser = user.providerData.some((provider) => provider.providerId === "google.com");
    const hasPhoto = !!user.photoURL;
    const finalPhotoURL = hasPhoto ? user.photoURL : fallbackPhoto;

    try {
      const { data } = await axios.get(`${URL}/users/${userId}`);
      const storedPhoto = data.user?.photo_profile;

      if (!storedPhoto || storedPhoto !== finalPhotoURL) {
        await axios.put(`${URL}/users/${userId}`, {
          property: "photo_profile",
          value: finalPhotoURL,
        });
      }

      setPhotoURL(storedPhoto || finalPhotoURL);
    } catch (err: any) {
      console.error("Error actualizando foto:", err?.response?.data || err.message);
    }
  }, [URL, auth]);

  useEffect(() => {
    fetchAndUpdatePhoto();
  }, [fetchAndUpdatePhoto]);

  const sidebarVariants = {
    open: { width: 280 },
    closed: { width: 80 }
  };

  const itemVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: -20 }
  };

  return (
    <>
      {/* Desktop/Tablet Sidebar */}
      <motion.aside
        className="hidden sm:block sm:h-screen bg-white border-r border-gray-200 text-gray-700 overflow-hidden relative"
        initial="open"
        animate={open ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Logo & Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3"
                >
                  <img src="/LogoGaia.svg" alt="Gaia Logo" className="w-8 h-8" />
                  <div>
                    <h2 className="font-bold text-gray-800">Gaia EcoTrack</h2>
                    <p className="text-xs text-gray-500">Energy Tokenization</p>
                  </div>
                </motion.div>
              )}
              {!open && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <img src="/LogoGaia.svg" alt="Gaia Logo" className="w-8 h-8" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Toggle Button */}
            <button
              onClick={toggleSidebar}
              aria-label="Toggle Sidebar"
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <Link to="/userReg">
              <motion.img
                src={photoURL || fallbackPhoto}
                alt="User profile"
                className="w-12 h-12 rounded-full border-2 border-gray-200 object-cover cursor-pointer"
                whileHover={{ scale: 1.05 }}
              />
            </Link>
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 min-w-0"
                >
                  <h3 className="font-semibold text-gray-800 truncate">User Account</h3>
                  <p className="text-sm text-gray-500 truncate">Energy Producer</p>
                  <button
                    onClick={signOutUser}
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors mt-1"
                  >
                    Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {Menus.map(({ id, title, icon, to, color }) => (
            <motion.div
              key={id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={to}
                onClick={() => setActiveMenu(id)}
                className={`flex items-center gap-4 p-3 rounded-xl transition-all ${activeMenu === id
                  ? `bg-gradient-to-r ${color} text-white shadow-md`
                  : "text-gray-600 hover:bg-gray-50"
                  }`}
              >
                <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${activeMenu === id
                  ? "bg-white/20"
                  : "bg-gray-100"
                  }`}>
                  <span className="text-xl">{icon}</span>
                </div>
                <AnimatePresence>
                  {open && (
                    <motion.span
                      className="font-medium"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                    >
                      {title}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Wallet Info */}
        <div className="absolute bottom-4 left-4 right-4">
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4"
              >
                <AccountInfo isSidebarOpen={open} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Version */}
          <div className="mt-4 text-center">
            <span className="text-xs text-gray-400">v{version}</span>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Bottom Navbar */}
      <nav className="sm:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 py-3">
        <div className="flex items-center justify-around px-4">
          {Menus.map(({ id, title, icon, to, color }) => (
            <Link
              key={id}
              to={to}
              onClick={() => setActiveMenu(id)}
              className="flex flex-col items-center"
            >
              <div className={`w-12 h-12 flex items-center justify-center rounded-full mb-1 ${activeMenu === id
                ? `bg-gradient-to-r ${color} text-white`
                : "text-gray-400"
                }`}>
                <span className="text-xl">{icon}</span>
              </div>
              <span className={`text-xs ${activeMenu === id ? "font-semibold text-gray-800" : "text-gray-500"}`}>
                {title}
              </span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/20 z-40 sm:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}