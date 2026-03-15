// utils.ts

// Opción para el gráfico de distribución de tipos de energía
export const getCarbonFootprintDonutOption = (co2EmissionReduction: number) => ({
    title: {
      text: 'Solar Energy',
      subtext: `CO2 Reduction: ${co2EmissionReduction.toFixed(2)} tons`,
      left: 'center',
      top: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold',
      },
      subtextStyle: {
        fontSize: 14,
        color: '#666',
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['CO2 Reduction'],
    },
    series: [
      {
        name: 'CO2 Emission Reduction',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '16',
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: co2EmissionReduction, name: 'CO2 Reduction' },
        ],
      },
    ],
  });
  
export const getEnergyTypeOption = () => ({
    title: {
      text: 'Energy Type Distribution',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: 'Energy Type',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1048, name: 'Solar' },
          { value: 735, name: 'Wind' },
          { value: 580, name: 'Hydro' },
          { value: 484, name: 'Nuclear' },
          { value: 300, name: 'Coal' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  });
  



export const getOption = () => {
    return {
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
        textStyle: {
          color: "#ffffff",
        },
      },
      series: [
        {
          name: "Access Source",
          type: "pie",
          radius: ["50%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 5,
            borderColor: "#1D1B41",
            borderWidth: 2,
          },
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "20",
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: 3000, name: "Wind Energy" },
            { value: 7000, name: "Thermal Energy" },
            { value: 10000, name: "Solar Energy" },
          ],
        },
      ],
    };
  };

  // Opción para el gráfico de consumo por día
  export const getDailyConsumptionOption = () => ({
    xAxis: {
      type: 'category',
      data: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar',
      },
    ],
  });
  
  // Opción para el gráfico de intensidad energética
  export const getImprovedEnergyIntensityOption = (currentValue: number) => {
    const commonColor = '#fff';
    const gaugeRadius = '90%';
    const gaugeCenter = ['50%', '70%'];
    const axisLineColors = [
      [0.3, '#00e396'],   // verde
      [0.7, '#feb019'],   // amarillo
      [1, '#ff4560'],     // rojo
    ];
  
    return {
      backgroundColor: 'transparent',
      title: {
        text: 'Energy Intensity',
        left: 'center',
        top: '5%',
        textStyle: {
          color: commonColor,
          fontSize: 22,
          fontWeight: 'bold',
        },
      },
      series: [
        {
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          center: gaugeCenter,
          radius: gaugeRadius,
          min: 0,
          max: 15,
          splitNumber: 5,
          pointer: {
            icon: 'rect',
            width: 6,
            length: '80%',
            itemStyle: {
              color: '#fff',
              shadowColor: '#000',
              shadowBlur: 6,
            },
          },
          progress: {
            show: true,
            roundCap: true,
            itemStyle: {
              color: '#fff',
              borderColor: '#000',
              borderWidth: 1,
            },
          },
          axisLine: {
            lineStyle: {
              width: 26,
              color: axisLineColors,
              shadowBlur: 10,
              shadowColor: '#000',
            },
          },
          axisTick: {
            distance: -22,
            length: 6,
            lineStyle: {
              color: commonColor,
              width: 1.5,
            },
          },
          splitLine: {
            distance: -26,
            length: 20,
            lineStyle: {
              color: commonColor,
              width: 2.5,
            },
          },
          axisLabel: {
            distance: -12,
            color: commonColor,
            fontSize: 12,
            fontWeight: 'bold',
          },
          detail: {
            valueAnimation: true,
            formatter: '{value} kW',
            color: commonColor,
            fontSize: 24,
            fontWeight: 'bold',
            offsetCenter: [0, '40%'],
          },
          data: [
            {
              value: currentValue,
            },
          ],
        },
      ],
    };
  };
  // Opción para el gráfico de dispositivos activos por planta
  export const getPlantDataOption = (plantData: { name: string; activeDevices: number }[]) => ({
    xAxis: {
      type: 'category',
      data: plantData.map(plant => plant.name),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: plantData.map(plant => plant.activeDevices),
        type: 'bar',
      },
    ],
  });
  
  // Opción para el gráfico de uso de dispositivos por día
  export const getDeviceUsageOption = (deviceData: { name: string; usage: number }[]) => ({
    xAxis: {
      type: 'category',
      data: deviceData.map(device => device.name),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: deviceData.map(device => device.usage),
        type: 'bar',
      },
    ],
  });
  
export const getBarChartOption = (plantData: number[][]): any => {
    // Generando colores aleatorios para cada barra
    const colors = plantData.map(
      () => "#" + Math.floor(Math.random() * 16777215).toString(16)
    );

    return {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "line",
        },
        formatter: function (params: any) {
          const dataIndex = params[0].dataIndex;
          const plantNumber = plantData[dataIndex][0];
          const metric = params[0].value.toFixed(2);
          return `${params[0].name}<br/> Plant Number: ${plantNumber}<br/>Metric: ${metric}`;
        },
      },
      xAxis: {
        type: "category",
        data: plantData.map((item) => item[2]),
        axisLabel: {
          interval: 0,
          rotate: 45,
          color: "#fff",
        },
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "Metric",
          type: "line",
          data: plantData.map((item, index) => ({
            value: item[1],
            itemStyle: {
              color: colors[index % colors.length], // Utiliza el arreglo fijo de colores
            },
            symbolSize: 10,
            showSymbol: true,
          })),
          lineStyle: {
            color: "#5470C6",
          },
          smooth: true,
        },
      ],
    };
  };

  export const getDailyGenerationOption = (pac: (number | null)[]) => {
    // Convertimos null a 0 para evitar errores en el gráfico
    const processedPac = pac.map((val) => (val === null ? 0 : val));
  
    // Creamos etiquetas de tiempo basadas en intervalos de 5 minutos (288 puntos por día)
    const timeLabels = pac.map((_, index) => {
      const hour = Math.floor(index / 12); // 12 puntos por hora si son 5 min
      const minute = (index % 12) * 5;
      return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    });
  
    return {
      title: {
        text: 'Generación Diaria de Energía',
        left: 'center',
        textStyle: {
          color: '#fff',
          fontSize: 18,
          fontWeight: 'bold',
        },
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{b0} - {c0} W',
      },
      xAxis: {
        type: 'category',
        data: timeLabels,
        axisLabel: {
          color: '#fff',
          interval: 23, // Mostrar una etiqueta por hora aproximadamente
          rotate: 45,
        },
      },
      yAxis: {
        type: 'value',
        name: 'Watts',
        axisLabel: {
          color: '#fff',
        },
        splitLine: {
          lineStyle: {
            color: '#444',
          },
        },
      },
      series: [
        {
          name: 'Generación',
          data: processedPac,
          type: 'line',
          smooth: true,
          areaStyle: {
            color: 'rgba(80,180,255,0.3)',
          },
          lineStyle: {
            color: '#50B4FF',
          },
          symbol: 'none',
        },
      ],
      backgroundColor: 'transparent',
    };
  };

  // Opción para el gráfico de generación diaria del mes actual
export const getMonthlyGenerationOption = (maxMonthChart:  (number | null)[]) => {
  const data = maxMonthChart || [];
  // Generar etiquetas de días del mes
  const days = data.map((_, index) => `Día ${index + 1}`);

  return {
    title: {
      text: 'Generación por Día (Mes Actual)',
      left: 'center',
      textStyle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
      },
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b0}: {c0} kWh',
    },
    xAxis: {
      type: 'category',
      data: days,
      axisLabel: {
        color: '#fff',
        rotate: 45,
      },
    },
    yAxis: {
      type: 'value',
      name: 'kWh',
      axisLabel: {
        color: '#fff',
      },
      splitLine: {
        lineStyle: {
          color: '#444',
        },
      },
    },
    series: [
      {
        name: 'Generación',
        type: 'bar',
        data: maxMonthChart,
        itemStyle: {
          color: '#00e396',
        },
        barWidth: '60%',
      },
    ],
    backgroundColor: 'transparent',
  };
};


// Opción para el gráfico de generación mensual del año
export const getYearlyGenerationOption = (maxYearChart: number[]) => {
  // Nombres de los meses del año
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto',
    'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return {
    title: {
      text: 'Generación Anual por Mes',
      left: 'center',
      textStyle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
      },
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b0}: {c0} kWh',
    },
    xAxis: {
      type: 'category',
      data: months,
      axisLabel: {
        color: '#fff',
        rotate: 45,
      },
    },
    yAxis: {
      type: 'value',
      name: 'kWh',
      axisLabel: {
        color: '#fff',
      },
      splitLine: {
        lineStyle: {
          color: '#444',
        },
      },
    },
    series: [
      {
        name: 'Generación',
        type: 'bar',
        data: maxYearChart,
        itemStyle: {
          color: '#FF9F00',
        },
        barWidth: '60%',
      },
    ],
    backgroundColor: 'transparent',
  };
};