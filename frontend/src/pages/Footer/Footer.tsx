import { FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { motion } from "framer-motion";

function Footer() {
  const socialLinks = [
    {
      href: "https://www.linkedin.com/showcase/gaia-ecotrack/",
      icon: <FaLinkedinIn className="w-5 h-5" />,
      label: "LinkedIn",
      color: "hover:text-blue-600 hover:bg-blue-50"
    },
    {
      href: "mailto:gaia_ecotrack@andromedacomputer.net",
      icon: <MdEmail className="w-5 h-5" />,
      label: "Email",
      color: "hover:text-red-600 hover:bg-red-50"
    },
    {
      href: "https://twitter.com/Gaia_Ecotrack",
      icon: <FaTwitter className="w-5 h-5" />,
      label: "Twitter",
      color: "hover:text-blue-400 hover:bg-blue-50"
    },
    {
      href: "https://www.instagram.com/gaiaecotrack/",
      icon: <FaInstagram className="w-5 h-5" />,
      label: "Instagram",
      color: "hover:text-pink-600 hover:bg-pink-50"
    },
  ];

  const partnerLogos = [
    {
      href: "https://vara-network.io/",
      src: "/VaraCrypto.png",
      alt: "Vara Network",
      width: "w-24 sm:w-32"
    },
    {
      href: "https://www.andromedacomputer.net/",
      src: "/andromeda.png",
      alt: "Andromeda Computer",
      width: "w-32 sm:w-32"
    },
    {
      href: "https://www.andromedacomputer.net/dapps/gaia-ecotrack.html",
      src: "/LOGOGAIASOLO.png",
      alt: "Gaia Ecotrack",
      width: "w-20 sm:w-24"
    },
  ];

  return (
    <footer className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-200">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Logos Section */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-center text-gray-600 text-sm font-medium uppercase tracking-wider mb-8">
            Powered by
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
            {partnerLogos.map((logo, index) => (
              <motion.a
                key={index}
                href={logo.href}
                target="_blank"
                rel="noreferrer"
                className="group"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group-hover:shadow-md transition-all duration-300">
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className={`${logo.width} h-auto grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300`}
                  />
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Social Media Section */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3 className="text-center text-gray-600 text-sm font-medium uppercase tracking-wider mb-8">
            Connect with us
          </h3>
          <div className="flex justify-center gap-4">
            {socialLinks.map((item, idx) => (
              <motion.a
                key={idx}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`w-12 h-12 flex items-center justify-center rounded-xl bg-gray-100 ${item.color} transition-all duration-300 mb-2`}>
                  {item.icon}
                </div>
                <span className="text-xs text-gray-600">{item.label}</span>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-gray-600 text-sm leading-relaxed">
            Gaia EcoTrack is a Web3 platform for energy tokenization, enabling users to 
            track, trade, and monetize renewable energy production through blockchain technology.
          </p>
        </motion.div>

        {/* Newsletter */}
        <motion.div
          className="max-w-md mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
            <h4 className="text-center font-medium text-gray-800 mb-3">Stay Updated</h4>
            <p className="text-center text-sm text-gray-600 mb-4">
              Subscribe to our newsletter for the latest updates
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium text-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Copyright */}
      <motion.div
        className="border-t border-gray-200 bg-white py-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="/LogoGaia.svg" alt="Gaia Logo" className="w-6 h-6" />
              <span className="text-sm text-gray-600">Gaia EcoTrack</span>
            </div>
            
            <div className="text-sm text-gray-500">
              © 2026 Gaia EcoTrack — Energy Tokenization Platform
            </div>
            
            <div className="flex items-center gap-4">
              <a
                href="https://www.andromedacomputer.net/dapps/gaia-ecotrack.html"
                target="_blank"
                rel="noreferrer"
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                Learn More
              </a>
              <span className="text-gray-300">|</span>
              <a
                href="#"
                className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Privacy Policy
              </a>
              <span className="text-gray-300">|</span>
              <a
                href="#"
                className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Terms
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}

export { Footer };