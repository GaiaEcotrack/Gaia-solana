import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../images/icon-03.svg';
import EditMenu from '../../components/DropdownEditMenu';

// Import utilities

/**
 * Formatea un número de manera escalable con notación compacta (K, M, B)
 * Ejemplos: 9,999,999.999 -> "9,999,999.999", 150000000 -> "150M"
 */
const formatScalableNumber = (value) => {
  // Validar que el valor sea un número válido
  if (value === null || value === undefined || isNaN(value)) {
    return '0.00';
  }

  const numValue = Number(value);
  const absValue = Math.abs(numValue);
  
  // Si es 0, retornar directamente
  if (absValue === 0) {
    return '0.00';
  }
  
  // Números muy pequeños (menores a 0.01)
  if (absValue < 0.01 && absValue > 0) {
    return numValue.toFixed(4);
  }
  
  // Números menores a 100 millones: usar separadores de miles con precisión
  if (absValue < 100000000) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 3,
    }).format(numValue);
  }
  
  // Números mayores a 100 millones: usar notación compacta
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(numValue);
};

function DashboardCard03({total}) {
  // Validar y formatear el total
  const formattedTotal = total === 0 || !total ? '0.00' : formatScalableNumber(total);



  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white  shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          {/* Icon */}
          <img src={Icon} width="32" height="32" alt="Icon 03" />
          {/* Menu button */}
          <EditMenu align="right" className="relative inline-flex">
            <li>
              <Link className="font-medium text-sm text-slate-600  hover:text-slate-800  flex py-1 px-3" to="#0">
                Option 1
              </Link>
            </li>
            <li>
              <Link className="font-medium text-sm text-slate-600  hover:text-slate-800  flex py-1 px-3" to="#0">
                Option 2
              </Link>
            </li>
            <li>
              <Link className="font-medium text-sm text-rose-500 hover:text-rose-600 flex py-1 px-3" to="#0">
                Remove
              </Link>
            </li>
          </EditMenu>
        </header>
        <h2 className="text-lg font-semibold text-slate-800  mb-2">Your Balance</h2>
        <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Total</div>
        <div className="flex items-start">
          <div className="text-3xl font-bold text-slate-800  mr-2">
            {total === 0 || !total ? '$0.00' : `$${formattedTotal}`}
          </div>
        </div>
      </div>
      {/* Chart built with Chart.js 3 */}
    </div>
  );
}

export default DashboardCard03;
