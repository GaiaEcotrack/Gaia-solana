/* eslint-disable */

// Librerías de gráficos
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import {
  getDailyConsumptionOption,
  getImprovedEnergyIntensityOption,
  getMonthlyGenerationOption,
  getDailyGenerationOption,
  getOption,
  getYearlyGenerationOption
} from "./utils";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { getAuth } from "firebase/auth";
import axios from "axios";
import Swal from "sweetalert2";
import ReactECharts from "echarts-for-react";
import Container from "@/components/CardsEnergy/Container";
import { useAccount, useAlert } from "@gear-js/react-hooks";
import {
  calculateEnergyDataGrowatt,
  calculateEnergyDataHoymiles,
  fetchDataGrowatt,
  fetchDataHoymiles,
} from "./fetchDataDevice";
import { motion } from "framer-motion";
import EnergyDeviceList from "@/components/EnergyComponentNew/EnergyDeviceList";
import { PopUpALert } from "../../components/PopUpALert/PopUpAlert";
import { AlertModal } from "@/components/AlertModal/AlertModal";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

interface Data {
  today_eq: number;
  reflux_station_data: {
    pv_power: number;
    meter_b_in_eq: number;
    self_eq: number;
  };
}

interface User {
  device_brand: string;
  username: string;
  email: string;
}

interface RootState {
  app: {
    loggedInUser: User[];
  };
}

const GraficoEnergia = () => {
  const dispatch = useDispatch();
  const userRedux = useSelector((state: RootState) => state.app.loggedInUser);
  const alert = useAlert();
  const { account } = useAccount();
  
  const [walletMessage, setWalletMessage] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);
  const [energyData, setEnergyData] = useState({
    energyGenerated: "0",
    energyGenerating: "0",
    consumedCalculate: "0",
    plantData: [],
    tokens: "0",
    carbonfoot: "0",
    deviceInfo: "No data",
    chartPerHour: [],
    charPerDay: [],
    charPerMonth: [],
  });
  const [selectedOption, setSelectedOption] = useState('daily')
  const [data, setData] = useState<Data | null>(null);
  const [alertWallet, setAlertWallet] = useState(false);

  const URL = import.meta.env.VITE_APP_API_EXPRESS;
  const auth = getAuth();
  const userEmail = localStorage.getItem("email");

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${URL}/users/search`, {
        params: { email: userEmail },
      });
      const user = response.data
      if (user) {
        dispatch({ type: "SET_LOGGED_IN_USER", payload: [user] });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchDeviceData = async () => {
    if (userRedux && userRedux[0]?.device_brand) {
      const { device_brand, username } = userRedux[0];
      try {
        if (device_brand === "Hoymiles") {
          await fetchDataHoymiles(username, setData);
        } else if (device_brand === "Growatt") {
          await fetchDataGrowatt(username, setData);
        }
      } catch (error) {
        console.error("Error fetching device data:", error);
      }
    }
  };

  const processEnergyData = () => {
    if (data) {
      const calculatedData =
        userRedux[0]?.device_brand === "Hoymiles"
          ? calculateEnergyDataHoymiles(data)
          : calculateEnergyDataGrowatt(data);

      if (calculatedData) {
        setEnergyData({
          energyGenerated: calculatedData.energyGenerated,
          energyGenerating: calculatedData.energyGenerating,
          consumedCalculate: calculatedData.consumedCalculate,
          tokens: calculatedData.tokens,
          carbonfoot: calculatedData.carboon,
          deviceInfo: calculatedData.deviceName,
          charPerDay: calculatedData.chartDay,
          charPerMonth: calculatedData.chartMonth,
          chartPerHour: calculatedData.chartHour,
          plantData: energyData.plantData,
        });
      }
    }
  };

  const claimReward = async () => {
    if (!account?.decodedAddress) {
      alert.error("No account connected");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `${URL}/service/GaiaService/MintTokensToUser`,
        [account.decodedAddress, energyData.tokens],
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert.success("Token sent");
    } catch (error) {
      alert.error("Transaction error");
      console.error(error);
    }
  };

  useEffect(() => {
    if(!account) {
      setAlertWallet(true);
    }
    fetchUserData();
  }, []);

  useEffect(() => {
    fetchDeviceData();
  }, [userRedux]);

  useEffect(() => {
    if (data) {
      processEnergyData();
    }
  }, [data]);

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
  };

  const renderChart = () => {
    switch (selectedOption) {
      case 'daily':
        return <DashboardCard title="Daily Generation" option={getMonthlyGenerationOption(energyData.charPerDay)}  />;
      case 'monthly':
        return <DashboardCard title="Monthly Generation" option={getYearlyGenerationOption(energyData.charPerMonth)} />;
      case 'hourly':
        return <DashboardCard title="Hourly Generation" option={getDailyGenerationOption(energyData.chartPerHour)} />;
      default:
        return <DashboardCard title="Daily Generation" option={getMonthlyGenerationOption(energyData.charPerDay)} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header centrado */}
      <div className="mb-8 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-800">Energy Dashboard</h1>
        <p className="text-blue-500 mt-1">Monitor your renewable energy production</p>
      </div>

      {/* Container principal - centrado */}
      <div className="max-w-7xl mx-auto">
        {/* Stats Cards - Container personalizado */}
        <div className="mb-8">
          <Container
            energyGenerated={energyData.energyGenerated}
            energyGenerating={energyData.energyGenerating}
            consumedCalculate={energyData.consumedCalculate}
            tokens={energyData.tokens}
            claimReward={claimReward}
            emailUser={userEmail || ""}
          />
        </div>

        {/* Navegación compacta */}
        <motion.div
          className="flex items-center justify-center gap-3 bg-white rounded-xl p-3 mb-8 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Generation
          </button>
          
          <NavLink to="/devices">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              Devices
            </button>
          </NavLink>
          
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-orange-600 hover:bg-orange-50 transition-colors text-sm font-medium"
            onClick={() => setPopupOpen(true)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            Alerts
          </button>
        </motion.div>

        {/* Grid principal - centrado con máximo ancho */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card de Gráficos */}
          <motion.div
            className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 sm:mb-0">Energy Production Analytics</h2>
              <div className="flex gap-2">
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedOption === 'daily' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  onClick={() => handleOptionChange('daily')}
                >
                  Daily
                </button>
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedOption === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  onClick={() => handleOptionChange('monthly')}
                >
                  Monthly
                </button>
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedOption === 'hourly' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  onClick={() => handleOptionChange('hourly')}
                >
                  Hourly
                </button>
              </div>
            </div>

            {/* Gráfico */}
            <div className="h-72">
              {renderChart()}
            </div>
          </motion.div>

          {/* Columna derecha - 2 cards apiladas */}
          <div className="space-y-6">
            {/* Card de Dispositivo */}
            <motion.div
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Connected Device</h3>
                  <p className="text-sm text-gray-500">Real-time monitoring</p>
                </div>
              </div>
              
              <EnergyDeviceList device={{ name: energyData.deviceInfo }} />
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Connected to Gaia Network</span>
                </div>
              </div>
            </motion.div>

            {/* Card de Huella de Carbono */}
            <motion.div
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4 4 0 003 15z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Carbon Impact</h3>
                  <p className="text-sm text-gray-500">CO₂ Reduction</p>
                </div>
              </div>
              
              <div className="flex flex-col items-center py-4">
                <div className="relative mb-3">
                  <div className="w-24 h-24 rounded-full border-4 border-green-100 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
                      <span className="text-2xl font-bold text-green-600">{energyData.carbonfoot}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800 mb-1">{energyData.carbonfoot} TON</div>
                  <p className="text-sm text-gray-600">
                    CO₂ prevented from entering atmosphere
                  </p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Environmental impact:</span>
                  <span className="font-semibold text-green-600">
                    {Math.round(parseFloat(energyData.carbonfoot) * 40)} trees saved
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {alertWallet && <AlertModal onClose={() => setAlertWallet(false)} />}
      {popupOpen && <PopUpALert onClose={() => setPopupOpen(false)} />}
    </div>
  );
};

const DashboardCard = ({ title, option }: { title: string; option: any }) => (
  <div className="h-full">
    <ReactECharts 
      option={option} 
      className="w-full" 
      opts={{ renderer: 'svg' }} 
      style={{ width: '100%', height: '100%', minHeight: '280px' }} 
    />
  </div>
);

export default GraficoEnergia;