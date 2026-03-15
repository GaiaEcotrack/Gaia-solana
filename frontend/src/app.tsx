import 'tailwindcss/tailwind.css';
import './index.css';

import { withProviders } from "@/app/hocs";
import { useLocation } from "react-router-dom";
import { Routing } from './pages/index';
import { SideBar } from './pages/home/SideBar';

import { initializeApp } from 'firebase/app';
import { config } from "./components/config/config";

import { Footer } from './pages/Footer/Footer';
import Logo from "./pages/Logo/Logo";
import TermsAndPolicy from "./pages/terms&policies/Terms&policy";
import FormGaia from "./pages/formGaia/FormGaia";
import ChatBot from "./pages/ChatBot/ChatBot";

initializeApp(config.firebaseConfig);

function Component() {
  const location = useLocation();

  const isAppReady = true; // Solana doesn't need the same initialization as Gear here

  // Rutas donde NO mostrar sidebar
  const excludedPaths = [
    '/assets/logo', '/dashGovernament', '/serviceTerms', '/dataPrivacy', 
    '/payment', '/','/dashInstaller'
  ];

  // Rutas donde NO mostrar footer
  const excludedFooter = [
    '/assets/logo', '/dashGovernament', '/serviceTerms', '/dataPrivacy', 
    '/payment', '/dashAdmin', '/dashInstaller', '/form', '/newdash', 
    '/userReg', '/dashUser', '/panelUsuarioFinal', '/', '/blockchain'
  ];

  const shouldShowSidebar = !excludedPaths.includes(location.pathname);
  const shouldShowFooter = !excludedFooter.includes(location.pathname);

  return (    
   <div className="font-sans w-full bg-gradient-to-tr from-[#181745] from-10% via-[#181745] via-30% to-[#216e93] to-90% text-white flex flex-col min-w-0 overflow-x-hidden">

      {shouldShowSidebar && <SideBar />}

      <div className="flex-1 flex flex-col">
        <main className="flex-1">
          {location.pathname === '/assets/logo' && <Logo />}
          {location.pathname === '/serviceTerms' && <TermsAndPolicy />}
          {location.pathname === '/dataPrivacy' && <TermsAndPolicy />}
          {location.pathname === '/form' && <FormGaia />}

          {!['/assets/logo', '/serviceTerms', '/dataPrivacy', '/form'].includes(location.pathname) && <Routing />}
        </main>

        {shouldShowFooter && <Footer />}
      </div>

      {shouldShowSidebar && <ChatBot />} 
    </div>
  );
}

export const App = withProviders(Component);
