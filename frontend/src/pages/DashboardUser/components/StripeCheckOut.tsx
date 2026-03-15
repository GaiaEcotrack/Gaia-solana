import { loadStripe } from '@stripe/stripe-js';
import React from 'react';

// Carga tu Public Key de Stripe
const secretKey = process.env.VITE_APP_STRIPE_SECRET_KEY;

if (!secretKey) {
  throw new Error('Stripe secret key is not defined in environment variables');
}

const stripePromise = loadStripe(secretKey); // empieza con pk_test_ o pk_live_

const CheckoutButton: React.FC = () => {
  const handleCheckout = async () => {
    try {
      const response = await fetch('http://localhost:8080/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Fallo en la creación de la sesión de Stripe');
      }

      const data: { url: string } = await response.json();
      
      // Redirige al checkout
      window.location.href = data.url;

    } catch (error) {
      console.error('Error iniciando checkout:', error);
      // Aquí puedes mostrar un error en la UI si quieres
    }
  };

  return (
<button  className="flex items-center rounded-md border border-slate-300 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button">
  Suscribe with Stripe
  (in development)


  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-1.5">
    <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clip-rule="evenodd" />
  </svg>
</button>
  );
};

export default CheckoutButton;
