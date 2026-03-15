import React, { useState, useEffect } from "react";

import TypesPay from "../../components/TypesPay";
import Membership from "../../components/Membership";

function DashboardCard04() {
  const [name, setName] = useState("");
  const [cardContent, setCardContent] = useState(false);
  const [cardMember, setCardMember] = useState(true);

  const openCardPay = () => {
    setCardContent(true);
    setCardMember(false);
  };

  useEffect(() => {
    const datoAlmacenado = window.localStorage.getItem("name");
    if (datoAlmacenado) {
      setName(datoAlmacenado);
    }
  }, []);

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-gradient-to-r from-gray-50 to-gray-100 shadow-lg rounded-lg border border-gray-300">
      <header className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 tracking-wide">
          Payment Method
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage your payment preferences below.
        </p>
      </header>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
          <div className="w-full sm:w-auto">
            {cardMember && 
                        <Membership openCard={openCardPay} />}

          </div>
          {cardContent && (
            <div
              className="w-full sm:w-auto transition-opacity duration-300 ease-in-out"
              aria-live="polite"
            >
              <TypesPay />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardCard04;