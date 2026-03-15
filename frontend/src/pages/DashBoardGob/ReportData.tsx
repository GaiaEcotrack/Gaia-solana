

const ReportData = ({data ,departament}:any) => {

  const totalPlantas = data.usuarios?.length || 0;
  const produccionPromedio = totalPlantas > 0 ? (data.totalKW || 0) / totalPlantas : 0;
  
    return (
        <div className="p-6 bg-white text-black rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Reporte de Plantas Solares - {departament}
        </h1>
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Indicador</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Total de Plantas</td>
              <td className="border border-gray-300 px-4 py-2">{data.usuarios?.length || 0}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Capacidad Total</td>
              <td className="border border-gray-300 px-4 py-2">{data.totalRated || 0} kW</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Energía Generada</td>
              <td className="border border-gray-300 px-4 py-2">{data.totalKW || 0} kWh</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Reducción de CO₂</td>
              <td className="border border-gray-300 px-4 py-2">{data.totalC02 || 0} toneladas</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">% de Plantas Operativas</td>
              <td className="border border-gray-300 px-4 py-2">{"100"}%</td>
            </tr>
            <tr>
            <td className="border border-gray-300 px-4 py-2">Producción Promedio por Planta</td>
            <td className="border border-gray-300 px-4 py-2">
              {produccionPromedio.toFixed(2)} kWh
            </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };
  
  export default ReportData