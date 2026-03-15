/* eslint-disable */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { getAuth, signOut } from "firebase/auth";
import { FiHome, FiSettings, FiUser, FiUsers, FiLogOut, FiMenu, FiX, FiZap, FiDollarSign, FiTrendingUp, FiShield, FiCreditCard } from 'react-icons/fi';
import { HiOutlineLogout } from "react-icons/hi";

// Components
import Users from "./components/Users";
import UsersList from "./components/UsersList";
import UsersPayments from "./components/UsersPayments";
import UserForm from './components/ProfileInstaller';
import SettingsCard from './components/settingsCard';
import CreateWallet from './components/CreateWallet';
import { AccountInfo } from '@/components/layout/header/account-info/account-info';
import version from '../../../version';

interface User {
  name: string;
  generatedKW: number;
}

const DashboardInstaller = () => {
  const auth = getAuth();
  const [activeView, setActiveView] = useState<'users' | 'profile' | 'settings' | 'payments'>('users');
  const [userOnline, setUserOnline] = useState<any>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [photoProfile, setPhotoProfile] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const apiExpress = import.meta.env.VITE_APP_API_EXPRESS;
  const currentUser = localStorage.getItem('email');

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${apiExpress}/users/search`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { email: currentUser }
      });
      
      const user = response.data;
      setUserOnline(user);
      
      // Fetch users based on role
      if (user.role === "Installer") {
        const usersResponse = await axios.get(`${apiExpress}/generator/byinstaller/${user.installation_company}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(usersResponse.data);
      } else if (user.role === "Comercial") {
        const usersResponse = await axios.get(`${apiExpress}/comercial/users/${user.email}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(usersResponse.data);
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      window.location.href = "/";
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  useEffect(() => {
    fetchUserData();
    const photo_profile = localStorage.getItem('profilePic');
    setPhotoProfile(photo_profile);
  }, []);

  const menuItems = [
    { id: 'users', label: 'Users', icon: <FiUsers className="w-5 h-5" />, color: 'from-blue-500 to-blue-600' },
    { id: 'profile', label: 'Profile', icon: <FiUser className="w-5 h-5" />, color: 'from-green-500 to-green-600' },
    { id: 'settings', label: 'Settings', icon: <FiSettings className="w-5 h-5" />, color: 'from-purple-500 to-purple-600' },
    { id: 'payments', label: 'Payments', icon: <FiDollarSign className="w-5 h-5" />, color: 'from-orange-500 to-orange-600', disabled: false },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'users':
        return (
          <div className="space-y-6">
            <CreateWallet />
            <Users users={users} />
            <UsersList users={users} />
          </div>
        );
      case 'profile':
        return <UserForm role={userOnline.role} />;
      case 'settings':
        return <SettingsCard />;
      case 'payments':
        return <UsersPayments />;
      default:
        return (
          <div className="space-y-6">
            <CreateWallet />
            <Users users={users} />
            <UsersList users={users} />
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left section */}
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100 lg:hidden"
              >
                {sidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
              
              <div className="hidden lg:flex items-center ml-4">
                <img src="/LogoGaia.svg" alt="Gaia Logo" className="w-8 h-8 mr-3" />
                <div>
                  <h1 className="text-lg font-bold text-gray-800">Gaia Installer Portal</h1>
                  <p className="text-xs text-gray-500">{userOnline.role || 'Dashboard'}</p>
                </div>
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {userOnline.email?.charAt(0) || 'I'}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{userOnline.email || 'Installer'}</p>
                  <p className="text-xs text-gray-500">Connected</p>
                </div>
              </div>
              
              <button
                onClick={signOutUser}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <HiOutlineLogout className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="flex pt-16">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center text-white">
                <FiZap className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold text-gray-800">Installer Panel</h2>
                <p className="text-sm text-gray-500">Manage clients & installations</p>
              </div>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as any)}
                  disabled={item.disabled}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                    activeView === item.id
                      ? `bg-gradient-to-r ${item.color} text-white shadow-md`
                      : 'text-gray-600 hover:bg-gray-50'
                  } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                    activeView === item.id ? 'bg-white/20' : 'bg-gray-100'
                  }`}>
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Wallet Info */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
                <AccountInfo isSidebarOpen={true} />
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-400">Version {version}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Sidebar - Mobile */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-40 lg:hidden overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <img src="/LogoGaia.svg" alt="Gaia Logo" className="w-8 h-8" />
                      <div>
                        <h2 className="font-bold text-gray-800">Gaia Installer</h2>
                        <p className="text-xs text-gray-500">Portal</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>

                  <nav className="space-y-2 mb-8">
                    {menuItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveView(item.id as any);
                          setSidebarOpen(false);
                        }}
                        disabled={item.disabled}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                          activeView === item.id
                            ? `bg-gradient-to-r ${item.color} text-white shadow-md`
                            : 'text-gray-600 hover:bg-gray-50'
                        } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                          activeView === item.id ? 'bg-white/20' : 'bg-gray-100'
                        }`}>
                          {item.icon}
                        </div>
                        <span className="font-medium">{item.label}</span>
                      </button>
                    ))}
                  </nav>

                  <div className="pt-6 border-t border-gray-100">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
                      <AccountInfo isSidebarOpen={true} />
                    </div>
                    
                    <div className="mt-4 text-center">
                      <p className="text-xs text-gray-400">Version {version}</p>
                    </div>
                  </div>
                </div>
              </motion.aside>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black z-30 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          {/* Stats Overview */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: "Total Clients", value: users.length.toString(), icon: <FiUsers className="w-5 h-5 text-blue-500" />, color: "bg-blue-50" },
                { label: "Total Energy", value: `${users.reduce((acc, user) => acc + user.generatedKW, 0).toFixed(1)} kW`, icon: <FiZap className="w-5 h-5 text-green-500" />, color: "bg-green-50" },
                { label: "Avg. Production", value: users.length > 0 ? `${(users.reduce((acc, user) => acc + user.generatedKW, 0) / users.length).toFixed(1)} kW` : "0 kW", icon: <FiTrendingUp className="w-5 h-5 text-orange-500" />, color: "bg-orange-50" },
                { label: "Active Systems", value: users.length.toString(), icon: <FiShield className="w-5 h-5 text-purple-500" />, color: "bg-purple-50" },
              ].map((stat, index) => (
                <div key={index} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
            {/* Header with quick actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {activeView === 'users' && 'Client Management'}
                  {activeView === 'profile' && 'Profile Settings'}
                  {activeView === 'settings' && 'System Settings'}
                  {activeView === 'payments' && 'Payment Processing'}
                </h2>
                <p className="text-gray-500">
                  {activeView === 'users' && 'Manage your clients and their solar installations'}
                  {activeView === 'profile' && 'Update your personal and company information'}
                  {activeView === 'settings' && 'Configure system preferences and integrations'}
                  {activeView === 'payments' && 'Process payments and view transaction history'}
                </p>
              </div>
              
              <div className="flex gap-2 mt-4 md:mt-0">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                  <FiCreditCard className="w-4 h-4 inline mr-2" />
                  Generate Report
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                  Export Data
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="mt-6">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>

      {/* Bottom Navigation - Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 z-40">
        <div className="flex justify-around">
          {menuItems.slice(0, 4).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as any)}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                activeView === item.id ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <div className={`w-10 h-10 flex items-center justify-center rounded-lg mb-1 ${
                activeView === item.id ? 'bg-blue-50' : 'bg-gray-100'
              }`}>
                {item.icon}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default DashboardInstaller;