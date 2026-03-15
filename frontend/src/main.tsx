import React from 'react';
import 'tailwindcss/tailwind.css';
import ReactDOM from 'react-dom/client';
import dotenv from 'dotenv';

import { Provider } from 'react-redux';
import {PayPalScriptProvider} from "@paypal/react-paypal-js"
import {store, persistor} from './store/index';
import {App} from './app';
import { PersistGate } from 'redux-persist/integration/react';

// Cargar variables de entorno desde el archivo .env
dotenv.config();
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <PayPalScriptProvider
    options={{
      "clientId": 'AfRKkpVrAKTreiWEE2QnJe7F-ODiLjyS4Oo7kz14N6CbkLM13pOsuLHI_VzKW_SNAljcntcr8ecVWjlI'
    }}
  >
    <Provider store={store}>
      <React.StrictMode>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </React.StrictMode>
    </Provider>
  </PayPalScriptProvider>
);