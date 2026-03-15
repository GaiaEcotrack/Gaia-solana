/* eslint-disable */
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

const UnderConstruction = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Centered Header */}
      <div className="mb-12 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-800">Page Under Construction</h1>
        <p className="text-blue-500 mt-2">We're building something amazing</p>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        {/* Main Construction Card */}
        <motion.div
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Construction Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-16 h-16 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            </div>
          </div>

          {/* Main Message */}
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Coming Soon!
            </h2>
            <p className="text-gray-600 text-lg mb-6 max-w-2xl mx-auto">
              This section is currently under development. We're building new 
              features to enhance your experience on the Gaia Platform.
            </p>
            
            {/* Progress Indicator */}
            <div className="max-w-md mx-auto mb-8">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Development Progress</span>
                <span>65%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <motion.div
                  className="bg-blue-600 h-2.5 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "65%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>

            {/* Simulated Countdown */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg mb-8">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Estimated Launch: 15 Days</span>
            </div>
          </div>

          {/* Upcoming Features */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold text-gray-800 text-center mb-6">
              What We're Working On
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: "📊",
                  title: "Advanced Analytics",
                  desc: "Detailed energy performance metrics"
                },
                {
                  icon: "🌍",
                  title: "Impact Map",
                  desc: "Visualization of your environmental contribution"
                },
                {
                  icon: "🤝",
                  title: "Gaia Community",
                  desc: "Connect with other energy producers"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-50 p-4 rounded-xl border border-gray-200"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <h4 className="font-semibold text-gray-800 mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Back Button */}
          <div className="flex justify-center">
            <NavLink to="/">
              <motion.button
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Main Dashboard
              </motion.button>
            </NavLink>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          className="mt-8 text-center text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p>
            Have ideas or suggestions?{" "}
            <a href="infogaia@gaiaecotrack.com" className="text-blue-500 hover:text-blue-600">
              Contact us
            </a>
          </p>
          <p className="mt-2">© 2026 Gaia Platform. All rights reserved.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default UnderConstruction;