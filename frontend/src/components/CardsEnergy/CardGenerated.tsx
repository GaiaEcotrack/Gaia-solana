import { useAccount, useAlert } from "@gear-js/react-hooks";
import axios from "axios";
import React from "react";
import { motion } from "framer-motion";

type CardGeneratedProps = {
  total: number | string;
  moment: number | string;
  emailUser: string;
};

const CardGenerated = ({ total, moment, emailUser }: CardGeneratedProps) => {
  const alert = useAlert();
  const { account } = useAccount();
  const username = import.meta.env.VITE_APP_ADMIN_USER;
  const password = import.meta.env.VITE_APP_ADMIN_PASSWORD;
  const apiExpress = import.meta.env.VITE_APP_API_EXPRESS;
  const userId = localStorage.getItem("id");

  // Formatear números con separadores de miles y decimales
  const formatEnergyValue = (value: number | string, isPower = false) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(numValue)) return "0.00";
    
    // Si es potencia (kW), mostrar con 2 decimales
    if (isPower) {
      // Convertir a kW si el valor está en W
      const kwValue = numValue >= 1000 ? numValue / 1000 : numValue;
      return kwValue.toFixed(2);
    }
    
    // Si es energía (kWh)
    return numValue.toFixed(2);
  };

  // Determinar la unidad basada en el valor
  const getEnergyUnit = (value: number | string, isPower = false) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isPower) {
      // Si es potencia, determinar si mostrar kW o W
      return numValue >= 1000 ? "kW" : "W";
    }
    
    // Si es energía, siempre kWh
    return "kWh";
  };

  // Obtener el valor escalado apropiadamente
  const getScaledValue = (value: number | string, isPower = false) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isPower && numValue >= 1000) {
      // Convertir W a kW
      return (numValue / 1000).toFixed(2);
    }
    
    return numValue.toFixed(2);
  };

  const handleSubmit = async () => {
    try {
      if (!account) return alert.error("Connect a wallet");
      if (!emailUser || !emailUser.includes("@")) return alert.error("Invalid or missing email");

      // Login
      const { data: loginData } = await axios.post(`${apiExpress}/auth/login`, {
        username,
        password,
      });
      const token = loginData.token;
      localStorage.setItem("token", token);

      // Crear generador
      await axios.post(
        `${apiExpress}/generator/users`,
        {
          name: "userTest",
          wallet: account.address,
          secret_name: "Proyecto Teófilo Benites",
          installation_company: "Fibra_Andina",
          brand: "Growatt",
          municipality: "test",
          departament: "test",
          country: "test",
          email: emailUser,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Actualizar usuario
      await Promise.all([
        axios.put(`${apiExpress}/users/${userId}`, {
          property: "username",
          value: "Proyecto Teófilo Benites",
        }),
        axios.put(`${apiExpress}/users/${userId}`, {
          property: "device_brand",
          value: "Growatt",
        }),
      ]);

      alert.success("Devices added");
      window.location.reload();
    } catch (error) {
      console.error("Error creating generator:", error);
    }
  };

  // Calcular valores formateados
  const formattedTotal = formatEnergyValue(total, false); // kWh
  const formattedMoment = formatEnergyValue(moment, true); // Potencia (kW/W)
  const totalUnit = getEnergyUnit(total, false);
  const momentUnit = getEnergyUnit(moment, true);
  const scaledMoment = getScaledValue(moment, true);

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white text-lg font-semibold">Energy Production</h3>
            <p className="text-blue-100 text-sm">Real-time monitoring</p>
          </div>
          <motion.img
            src="/LogoGaia.svg"
            alt="Gaia Logo"
            className="h-12 w-12 rounded-full border-2 border-white bg-white p-1"
            initial={{ rotate: 0 }}
            whileHover={{ rotate: 15 }}
            transition={{ type: "spring", stiffness: 200 }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-700 leading-relaxed">
            Renewable energy transforming the world, taking care of our planet
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {/* Total Generated Card */}
          <motion.div
            className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-xl border border-blue-100"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <IconBuilding />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-600">Total Generated Today</h4>
                <p className="text-xs text-gray-500">Accumulated energy</p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {formattedTotal}
                <span className="text-lg ml-1 font-normal">{totalUnit}</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {typeof total === 'number' && total >= 1000 ? "Kilowatt-hours" : "Watt-hours"}
              </div>
            </div>
          </motion.div>

          {/* Current Generation Card */}
          <motion.div
            className="bg-gradient-to-br from-orange-50 to-white p-5 rounded-xl border border-orange-100"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <IconEnergy />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-600">Current Generation</h4>
                <p className="text-xs text-gray-500">Real-time output</p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {scaledMoment}
                <span className="text-lg ml-1 font-normal">{momentUnit}</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {momentUnit === "kW" ? "Kilowatts" : "Watts"}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Additional Info Panel */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Conversion Rate</p>
              <p className="text-sm font-medium text-gray-700">1 kWh = 1 GAIA Token</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">CO₂ Saved</p>
              <p className="text-sm font-medium text-gray-700">
                {typeof total === 'number' ? (total * 0.4).toFixed(2) : "0.00"} kg
              </p>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full absolute top-0 left-0 animate-ping"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">System Status</p>
              <p className="text-xs text-gray-500">
                {parseFloat(moment as string) > 0 ? "Producing energy" : "Connected"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Gaia EcoTrack</p>
            <p className="text-xs text-gray-500">v1.0</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 p-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">
              Last update: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">
              Refresh: 5 min • Powered by Gaia
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CardGenerated;

// Íconos optimizados para el nuevo diseño
const IconBuilding = () => (
  <svg
    className="w-6 h-6 text-blue-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const IconEnergy = () => (
  <svg
    className="w-6 h-6 text-orange-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);