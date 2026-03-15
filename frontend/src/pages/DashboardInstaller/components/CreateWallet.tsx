import React from 'react';
import { motion } from 'framer-motion';
import { FiPlay, FiDownload, FiExternalLink, FiShield, FiCreditCard, FiZap } from 'react-icons/fi';

const CreateWallet = () => {
  const steps = [
    {
      number: "01",
      title: "Download Wallet",
      description: "Get the official Gaia Wallet app from your device's store",
      icon: <FiDownload className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600"
    },
    {
      number: "02",
      title: "Create Account",
      description: "Set up your secure account with biometric authentication",
      icon: <FiShield className="w-6 h-6" />,
      color: "from-green-500 to-green-600"
    },
    {
      number: "03",
      title: "Fund Wallet",
      description: "Add GAIA tokens or connect your payment method",
      icon: <FiCreditCard className="w-6 h-6" />,
      color: "from-purple-500 to-purple-600"
    },
    {
      number: "04",
      title: "Start Earning",
      description: "Begin receiving energy tokens and rewards automatically",
      icon: <FiZap className="w-6 h-6" />,
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <div className="bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Create Your Gaia Wallet
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl">
            Securely manage your GAIA tokens, receive energy rewards, and participate in the decentralized energy ecosystem.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Video & Main Content */}
          <div className="lg:col-span-2">
            {/* Video Card */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Wallet Setup Tutorial</h2>
                    <p className="text-gray-600">Complete guide in 5 minutes</p>
                  </div>
                  <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium">
                    <FiPlay className="w-4 h-4" />
                    Watch Tutorial
                  </div>
                </div>
              </div>
              
              <div className="relative">
                {/* Video Thumbnail */}
                <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all group">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FiPlay className="w-8 h-8 text-blue-600 ml-1" />
                      </div>
                    </button>
                  </div>
                  
                  {/* Video Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                    <div className="text-white">
                      <p className="text-sm opacity-90">Duration: 4:32</p>
                      <p className="text-lg font-semibold">Complete Wallet Setup Guide</p>
                    </div>
                  </div>
                </div>
                
                {/* Video Controls */}
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70">
                    <FiExternalLink className="w-4 h-4" />
                  </button>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium">
                    Download Video
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 text-black gap-4 mb-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-600">Format</p>
                    <p className="font-semibold">MP4 HD</p>
                  </div>
                  <div className="bg-gray-50 p-4 text-black rounded-xl">
                    <p className="text-sm text-gray-600">Language</p>
                    <p className="font-semibold">English & Spanish</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">Beginner</span>
                  <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm">Step-by-Step</span>
                  <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm">5 Minutes</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Start Guide */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Start Guide</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Download Required Apps</h4>
                    <p className="text-gray-600 text-sm mt-1">
                      Install Gaia Wallet from App Store or Google Play, and have a government ID ready for verification.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Complete KYC Verification</h4>
                    <p className="text-gray-600 text-sm mt-1">
                      Follow the in-app verification process. This ensures security and compliance with regulations.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Connect to Energy Device</h4>
                    <p className="text-gray-600 text-sm mt-1">
                      Link your wallet to your solar installation to start receiving automatic token rewards.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Steps & Resources */}
          <div className="space-y-6">
            {/* Steps */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6">4 Simple Steps</h3>
              
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    <div className={`w-14 h-14 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center text-white text-2xl font-bold`}>
                      {step.number}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-8 h-8 bg-gradient-to-br ${step.color} rounded-lg flex items-center justify-center text-white`}>
                          {step.icon}
                        </div>
                        <h4 className="font-semibold text-gray-800">{step.title}</h4>
                      </div>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Resources */}
            <motion.div
              className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-xl font-bold mb-4">Helpful Resources</h3>
              
              <div className="space-y-3">
                <a href="#" className="flex items-center justify-between p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <FiDownload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">Wallet App</p>
                      <p className="text-sm opacity-90">Download links</p>
                    </div>
                  </div>
                  <FiExternalLink className="w-5 h-5 opacity-70" />
                </a>
                
                <a href="#" className="flex items-center justify-between p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <FiShield className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">Security Guide</p>
                      <p className="text-sm opacity-90">Best practices</p>
                    </div>
                  </div>
                  <FiExternalLink className="w-5 h-5 opacity-70" />
                </a>
                
                <a href="#" className="flex items-center justify-between p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <FiCreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">FAQ</p>
                      <p className="text-sm opacity-90">Common questions</p>
                    </div>
                  </div>
                  <FiExternalLink className="w-5 h-5 opacity-70" />
                </a>
              </div>
            </motion.div>

            {/* Support Card */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-50 rounded-full flex items-center justify-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
                    <FiZap className="w-6 h-6" />
                  </div>
                </div>
                
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Need Help?</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Our support team is available 24/7 to assist you with wallet setup.
                </p>
                
                <button className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-green-700 transition-all">
                  Contact Support
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateWallet;