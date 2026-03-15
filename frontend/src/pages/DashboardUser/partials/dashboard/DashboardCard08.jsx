import { useState,useEffect } from 'react';
import axios from 'axios'
import TransactionCard from '../../components/TransactionsCard'



function DashboardCard08() {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async ()=>{
      try {
        const url = import.meta.env.VITE_APP_API_EXPRESS;
        const token = localStorage.getItem('token')
        const request = await axios.get(`${url}/service/query/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        const response = request.data[16].producers
        setData(response)
      } catch (error) {
        console.log(error);
      }
    }
    fetchData()
  }, [])
  




  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white  shadow-lg rounded-sm border border-slate-200 ">
      <h2 className="text-xl font-bold text-gray-800 px-5 py-4">
      Last kw tokenized</h2>
      {/* Contenedor con scroll para múltiples transacciones */}
      <div className="flex flex-col  gap-5 max-h-96 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 rounded-lg border border-gray-200 p-2">
        {data.map((tx, idx) => (
          <TransactionCard key={idx} transaction={tx} />
        ))}
      </div>
    </div>
  );
}

export default DashboardCard08;
