"use client";

import { motion } from "framer-motion";
import { Leaf, Github, Twitter, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="mt-auto bg-white border-t border-[#e5e0d8] py-6"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#F49136] to-[#F6B07D] rounded-lg flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-[#6b6b6b]">
              © 2024 Gaia Ecotrack. Built for Solana Hackathon.
            </span>
          </div>
          <div className="flex items-center gap-4">
            <motion.a
              href="#"
              whileHover={{ scale: 1.1, y: -2 }}
              className="w-8 h-8 bg-[#F6F3EC] rounded-lg flex items-center justify-center text-[#6b6b6b] hover:text-[#F49136] hover:bg-[#F49136]/10 transition-colors"
            >
              <Github className="w-4 h-4" />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.1, y: -2 }}
              className="w-8 h-8 bg-[#F6F3EC] rounded-lg flex items-center justify-center text-[#6b6b6b] hover:text-[#066EB5] hover:bg-[#066EB5]/10 transition-colors"
            >
              <Twitter className="w-4 h-4" />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.1, y: -2 }}
              className="w-8 h-8 bg-[#F6F3EC] rounded-lg flex items-center justify-center text-[#6b6b6b] hover:text-[#904907] hover:bg-[#904907]/10 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
            </motion.a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
