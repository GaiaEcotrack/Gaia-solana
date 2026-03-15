import React from "react";
import { FaLeaf, FaCalendarAlt, FaDollarSign, FaIdCard, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";

type CarbonCertificate = {
  owner: string;
  certificate_id: string;
  value: string;
  issue_date: number;
  expiry_date: number;
};

type CarbonCertificateCardProps = {
  certificate: CarbonCertificate;
};

const CarbonCertificateCard: React.FC<CarbonCertificateCardProps> = ({ certificate }) => {
  const issueDate = new Date(certificate.issue_date * 1000);
  const expiryDate = new Date(certificate.expiry_date * 1000);
  const valueInUSD = parseInt(certificate.value);
  const isExpiringSoon = expiryDate.getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000; // 30 días

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
    >
      {/* Header con gradiente */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <FaLeaf className="text-white w-5 h-5" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Carbon Certificate</h3>
              <p className="text-green-100 text-xs">CO₂ Offset Certification</p>
            </div>
          </div>
          {isExpiringSoon && (
            <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
              Expiring Soon
            </span>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5">
        {/* Valor principal */}
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-gray-800 mb-1">${valueInUSD.toLocaleString()}</div>
          <div className="text-sm text-gray-500">Certificate Value</div>
        </div>

        {/* Detalles */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <FaIdCard className="w-4 h-4" />
              <span className="text-sm">Certificate ID</span>
            </div>
            <code className="text-sm font-medium text-gray-800 truncate max-w-[120px]" title={certificate.certificate_id}>
              {certificate.certificate_id.slice(0, 8)}...
            </code>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <FaUser className="w-4 h-4" />
              <span className="text-sm">Owner</span>
            </div>
            <code className="text-sm font-medium text-gray-800 truncate max-w-[120px]" title={certificate.owner}>
              {certificate.owner.slice(0, 8)}...{certificate.owner.slice(-6)}
            </code>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <FaCalendarAlt className="w-3 h-3 text-green-600" />
                <span className="text-xs text-gray-600">Issued</span>
              </div>
              <div className="text-sm font-medium text-gray-800">{formatDate(issueDate)}</div>
            </div>

            <div className={`rounded-lg p-3 ${isExpiringSoon ? 'bg-yellow-50' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2 mb-1">
                <FaCalendarAlt className={`w-3 h-3 ${isExpiringSoon ? 'text-yellow-600' : 'text-gray-600'}`} />
                <span className={`text-xs ${isExpiringSoon ? 'text-yellow-700' : 'text-gray-600'}`}>Expires</span>
              </div>
              <div className={`text-sm font-medium ${isExpiringSoon ? 'text-yellow-800' : 'text-gray-800'}`}>
                {formatDate(expiryDate)}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Validity Period</span>
            <span>
              {Math.floor((Date.now() - issueDate.getTime()) / (expiryDate.getTime() - issueDate.getTime()) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${Math.min(100, Math.floor((Date.now() - issueDate.getTime()) / (expiryDate.getTime() - issueDate.getTime()) * 100))}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <motion.button
            className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all text-sm font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Details
          </motion.button>
          <motion.button
            className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all text-sm font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Trade Certificate
          </motion.button>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 p-3 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Verified Carbon Offset</span>
          </div>
          <span>Gaia EcoTrack Certified</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CarbonCertificateCard;