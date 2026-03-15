import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import MercadoPago from './MercadoPago';
import CoinbaseButton from './Coinbase';
import { getAuth } from 'firebase/auth';
import CheckoutButton from './StripeCheckOut';

const TypesPay = () => {
  const userRedux = useSelector((state: RootState) => state.app.loggedInUser);
  const auth = getAuth();
  const user = auth.currentUser?.email;
  const userFind = userRedux ? userRedux.find(usuario => usuario.email === user) : null;

  useEffect(() => {
    if (userFind) {
      localStorage.setItem('idUserRedux', userFind._id);
    }
  }, [userFind]);

  return (
    <div className="flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Select Your Payment Method
        </h1>
        <p className="text-center text-gray-600 mb-8">
        Choose one of the available options to complete your transaction securely.
        </p>
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="hover:shadow-md transition-shadow duration-300">
            <CheckoutButton />
          </div>
          <div className="hover:shadow-md transition-shadow duration-300">
            <MercadoPago />
            </div>
        </div>
      </div>
    </div>
  );
};

export default TypesPay;