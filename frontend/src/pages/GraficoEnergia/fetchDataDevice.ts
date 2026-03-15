import axios from "axios";

// Hoymiles fetch devices
export const fetchDataHoymiles = async (username: any, setData: any) => {
  try {
    const apiUrl = import.meta.env.VITE_APP_API_EXPRESS;
    const request = await axios.post(`${apiUrl}/api/real-time-data/hoymiles`, {
      user_name: username
    });
    const response = request.data;
    setData(response);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const calculateEnergyDataHoymiles = (data: any) => {
  if (data) {
    const energyGenerated = (data.realTimeData.data.today_eq / 1000).toFixed(2);
    const energyGenerating = data.realTimeData.data.reflux_station_data.pv_power;
    const consumedCalculate = ((data.realTimeData.data.reflux_station_data.meter_b_in_eq / 1000) + (data.realTimeData.data.reflux_station_data.self_eq / 1000)).toFixed(2);
    const tokens = Math.floor(data.realTimeData.data.today_eq / 1000).toString();
    const carboon = parseInt(data.realTimeData.data.co2_emission_reduction / 1000000);
    const deviceName = data.deviceData.data[0].model_no;
    const chartHour = data.energyPerHourArray;
    const chartDay = data.dayEnergyArray;
    const chartMonth = data.energyPerMonthArray;
    
    return { 
      energyGenerated, 
      energyGenerating, 
      consumedCalculate, 
      tokens, 
      carboon, 
      deviceName, 
      chartHour, 
      chartDay, 
      chartMonth 
    };
  }

  return { 
    energyGenerated: "0.00", 
    energyGenerating: "0", 
    consumedCalculate: "0.00", 
    tokens: "0", 
    carboon: "0", 
    deviceName: "No Data", 
    chartHour: [], 
    chartDay: [], 
    chartMonth: [] 
  };
};

// Growatt fetch devices
export const fetchDataGrowatt = async (username: any, setData: any) => {
  try {
    const apiUrl = import.meta.env.VITE_APP_API_EXPRESS;
    const request = await axios.post(`${apiUrl}/api/real-time-data/growatt`, {
      user_client: username
    });
    const response = request.data.data;
    setData(response);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const calculateEnergyDataGrowatt = (data: any) => {
  if (data && data.devices && data.devices.length > 0) {
    // Extraer datos del dispositivo
    const device = data.devices[0];
    
    // Calcular energía generada hoy (en kWh) - ya viene en kWh en eToday
    const energyGeneratedToday = parseFloat(device.eToday) || 0;
    const energyGenerated = energyGeneratedToday.toFixed(2);
    
    // Potencia actual en vatios (W) - convertir a kW si es necesario
    const powerNow = parseFloat(device.pac) || 0;
    const energyGenerating = (powerNow / 1000).toFixed(2); // Convertir W a kW
    
    // Para Growatt, consumido = generado - energía exportada a red (si está disponible)
    // Si no hay datos de consumo, usar generado como referencia
    const consumedCalculate = energyGenerated;
    
    // Tokens basados en energía generada (1 token por kWh)
    const tokens = Math.floor(energyGeneratedToday).toString();
    
    // CO2 en toneladas - ya viene calculado en la API
    const co2Value = parseFloat(data.plantData?.obj?.co2) || 0;
    const carboon = (co2Value / 1000).toFixed(2); // Convertir kg a toneladas si es necesario
    
    // Nombre del dispositivo
    const deviceName = device.alias || device.sn || "Growatt Inverter";
    
    // Procesar gráfico por horas (maxDayChart)
    // Filtrar valores null y convertir a kWh si están en Wh
    const chartHourRaw = data.maxDayChart || [];
    const chartHour = chartHourRaw.map((value: number | null) => {
      if (value === null || value === undefined) return 0;
      // Convertir de Wh a kWh si es necesario (valores parecen estar en Wh)
      return value / 1000;
    });
    
    // Procesar gráfico por días (maxMonthChart)
    const chartDayRaw = data.maxMonthChart || [];
    const chartDay = chartDayRaw.map((value: number) => {
      // Estos parecen ser kWh por día
      return value || 0;
    });
    
    // Procesar gráfico por meses (maxYearChart)
    const chartMonthRaw = data.maxYearChart || [];
    const chartMonth = chartMonthRaw.map((value: number) => {
      // Estos parecen ser kWh por mes
      return value || 0;
    });

    return {
      energyGenerated,
      energyGenerating,
      consumedCalculate,
      tokens,
      carboon,
      deviceName,
      chartHour,
      chartDay,
      chartMonth,
    };
  }

  return {
    energyGenerated: "0.00",
    energyGenerating: "0",
    consumedCalculate: "0.00",
    tokens: "0",
    carboon: "0",
    deviceName: "No Data",
    chartHour: [],
    chartDay: [],
    chartMonth: [],
  };
};