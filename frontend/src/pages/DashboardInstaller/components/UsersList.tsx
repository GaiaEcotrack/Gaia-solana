import { SetStateAction, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiMoreVertical, FiPlus, FiTrendingUp, FiZap, FiUsers, FiRefreshCw } from "react-icons/fi";
import { fetchDataHoymilesInstaller, fetchDataGrowattInstaller } from "./fetchDataInstallerDevice";
import ModalDevice from "./modalDevice";
import { ApiLoader } from "@/components";
import ModalAddGenerator from "./AddGeneratorModal";

interface User {
  _id: string;
  name: string;
  brand: string;
  secret_name: string;
  generatedKW: string;
  status_documents: string;
}

interface UsersListProps {
  users: User[];
}

const UsersList: React.FC<UsersListProps> = ({ users }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [modal, setModal] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isAddGeneratorModalOpen, setIsAddGeneratorModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'asc' | 'desc' } | null>(null);
  
  const itemsPerPage = 10;
  const today = new Date();
  const date = today.toLocaleDateString();

  const closeModal = () => setModal(false);
  const closeAddGeneratorModal = () => setIsAddGeneratorModalOpen(false);
  const openAddGeneratorModal = () => setIsAddGeneratorModalOpen(true);

  useEffect(() => {
    const filtered = users.filter((user) =>
      user.secret_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Apply sorting
    let sortedUsers = [...filtered];
    if (sortConfig !== null) {
      sortedUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setTotalPages(Math.ceil(sortedUsers.length / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    setFilteredUsers(sortedUsers.slice(startIndex, startIndex + itemsPerPage));
  }, [users, currentPage, searchTerm, sortConfig]);

  const handlePageChange = (direction: "next" | "prev") => {
    setCurrentPage((prevPage) => {
      if (direction === "next" && prevPage < totalPages) return prevPage + 1;
      if (direction === "prev" && prevPage > 1) return prevPage - 1;
      return prevPage;
    });
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleSort = (key: keyof User) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleUserClick = async (user: User) => {
    setLoading(true);
    try {
      const userDeviceData =
        user.brand === "Hoymiles"
          ? await fetchDataHoymilesInstaller(user.secret_name)
          : await fetchDataGrowattInstaller(user.secret_name);
      setSelectedUserData(userDeviceData);
      setModal(true);
    } catch (error) {
      console.error("Error fetching user device data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalKW = users.reduce((acc, user) => acc + parseFloat(user.generatedKW || "0"), 0).toFixed(1);
  const averageKW = (parseFloat(totalKW) / users.length).toFixed(1) || "0";
  const onlineUsers = users.filter(user => user.status_documents === "online").length;

  return (
    <div className="bg-gray-50 p-4 md:p-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{users.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <FiUsers className="w-5 h-5 text-blue-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Energy</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{totalKW} kW</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <FiZap className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Production</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{averageKW} kW</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <FiTrendingUp className="w-5 h-5 text-orange-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Online Systems</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{onlineUsers}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Card */}
      <motion.div
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Client Management</h2>
              <p className="text-gray-500 mt-1">Manage all your solar installation clients</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  onChange={handleSearch}
                  type="text"
                  placeholder="Search clients..."
                  className="w-full sm:w-64 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Search users by name"
                />
              </div>
              
              <motion.button
                onClick={openAddGeneratorModal}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiPlus className="w-5 h-5" />
                Add Generator
              </motion.button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th 
                  className="p-4 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('secret_name')}
                >
                  <div className="flex items-center gap-2">
                    Client Account
                    {sortConfig?.key === 'secret_name' && (
                      <span className="text-blue-500">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="p-4 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('brand')}
                >
                  <div className="flex items-center gap-2">
                    Brand
                    {sortConfig?.key === 'brand' && (
                      <span className="text-blue-500">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="p-4 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('generatedKW')}
                >
                  <div className="flex items-center gap-2">
                    Energy Generated
                    {sortConfig?.key === 'generatedKW' && (
                      <span className="text-blue-500">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Last Update</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No clients found. Try a different search term.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user._id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-800">{user.secret_name || "N/A"}</p>
                        <p className="text-sm text-gray-500">{user.name || "No name"}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.brand === "Hoymiles" 
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                        {user.brand || "N/A"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-semibold text-gray-800">
                          {parseFloat(user.generatedKW || "0").toFixed(1)} kW
                        </div>
                        <div className="text-sm text-gray-500">
                          ≈ ${(parseFloat(user.generatedKW || "0") * 0.15).toFixed(2)}/day
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          user.status_documents === "online" ? "bg-green-500" : "bg-yellow-500"
                        }`}></div>
                        <span className="font-medium capitalize">
                          {user.status_documents || "Online"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{date}</td>
                    <td className="p-4">
                      <motion.button
                        onClick={() => handleUserClick(user)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FiMoreVertical className="w-4 h-4" />
                        View Details
                      </motion.button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-t border-gray-100">
          <div className="text-sm text-gray-600 mb-4 sm:mb-0">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, users.length)} of {users.length} clients
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => handlePageChange("prev")}
              disabled={currentPage === 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
              whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
            >
              Previous
            </motion.button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? "bg-blue-500 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <motion.button
              onClick={() => handlePageChange("next")}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
              whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
            >
              Next
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <ApiLoader />
              <p className="mt-4 text-gray-600">Loading device data...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {modal && (
          <ModalDevice close={closeModal} deviceData={selectedUserData} />
        )}
      </AnimatePresence>

      <ModalAddGenerator
        isOpen={isAddGeneratorModalOpen}
        onClose={closeAddGeneratorModal}
      />
    </div>
  );
};

export default UsersList;