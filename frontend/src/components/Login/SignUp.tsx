import { useRef, useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { AccountInfo } from "../layout/header/account-info/account-info";
import { WalletSelectorModal } from "./WalletModal"; // Asegúrate de que esta ruta sea correcta
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

interface SignUpProps {
  showSignUp: boolean;
  setShowSignUp: (val: boolean) => void;
}

export function SignUp({ showSignUp, setShowSignUp }: SignUpProps) {
  const URL = import.meta.env.VITE_APP_API_EXPRESS;
  const navigate = useNavigate();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);

  const [accountType, setAccountType] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [visible, setVisible] = useState(false);
  const [visibleConf, setVisibleConf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [walletAddress, setWalletAddress] = useState("");
  const [walletMessage, setWalletMessage] = useState("");
  const [walletLoading, setWalletLoading] = useState(false);
  const [createWalletLoading, setCreateWalletLoading] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [seedWords, setSeedWords] = useState<string[]>([]);
  const [seedVisible, setSeedVisible] = useState(false);
  const [generatedWallet, setGeneratedWallet] = useState("");
  const [copyFeedback, setCopyFeedback] = useState("");

  // Estados para Polkadot.js
  const [polkadotAccounts, setPolkadotAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [showPolkadotModal, setShowPolkadotModal] = useState(false);
  const [selectedPolkadotAccount, setSelectedPolkadotAccount] = useState<InjectedAccountWithMeta | null>(null);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);

  // New fields for required user info
  const [fullName, setFullName] = useState("");
  const [identificationNumber, setIdentificationNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const toggleVisibility = () => setVisible(!visible);
  const toggleVisibilityConf = () => setVisibleConf(!visibleConf);

  const generateWallet = async () => {
    setCreateWalletLoading(true);
    setWalletMessage("");
    setError("");
    setCopyFeedback("");
    try {
      const response = await axios.post(`${URL}/create-wallet`);
      const address = response.data?.address || "";
      const mnemonic = response.data?.mnemonic || "";
      const seedArray = Array.isArray(mnemonic)
        ? mnemonic
        : mnemonic.trim().split(/\s+/).filter(Boolean);

      setGeneratedWallet(address);
      setSeedWords(seedArray);
      setSeedVisible(true);
      setShowWalletModal(true);
      setWalletMessage("Wallet generated and ready to use.");
    } catch (error) {
      console.error(error);
      setError("Could not create wallet. Please try again.");
    } finally {
      setCreateWalletLoading(false);
    }
  };

  const generateHexAddress = () =>
    "0x" +
    Array.from({ length: 40 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");

  const copyToClipboard = (text: string, label: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopyFeedback(`${label} copied`);
      setTimeout(() => setCopyFeedback(""), 1800);
    }
  };

  const handleConnectWallet = async () => {
    setWalletLoading(true);
    setWalletMessage("");
    setError("");
    
    try {
      setIsLoadingAccounts(true);
      
      // Verificar si la extensión está disponible
      if (!window.injectedWeb3 || !window.injectedWeb3['polkadot-js']) {
        throw new Error('Polkadot.js extension not found. Please install it first.');
      }

      // Habilitar la extensión
      const extensions = await web3Enable('Gaia Ecotrack');
      
      if (extensions.length === 0) {
        throw new Error('No extension enabled. Please approve the connection in Polkadot.js extension.');
      }

      // Obtener las cuentas
      const allAccounts = await web3Accounts();
      
      if (allAccounts.length === 0) {
        throw new Error('No accounts found. Please create an account in Polkadot.js extension.');
      }

      setPolkadotAccounts(allAccounts);
      setShowPolkadotModal(true);
      setWalletMessage(`Found ${allAccounts.length} account(s)`);
      
    } catch (error: any) {
      console.error('Polkadot connection error:', error);
      setError(`Wallet connection failed: ${error.message}`);
      setWalletMessage('');
      
      // Fallback al método anterior si Polkadot falla
      setTimeout(() => {
        const address = generateHexAddress();
        setWalletAddress(address);
        setWalletMessage("Fallback: Random wallet address generated.");
        setWalletLoading(false);
      }, 600);
    } finally {
      setIsLoadingAccounts(false);
      setWalletLoading(false);
    }
  };

  const handleSelectPolkadotAccount = (account: InjectedAccountWithMeta) => {
    setSelectedPolkadotAccount(account);
    setWalletAddress(account.address);
    setWalletMessage(`Connected: ${account.meta.name || 'Unnamed Account'}`);
    setShowPolkadotModal(false);
  };

  const openCreateWallet = () => {
    if (createWalletLoading) return;
    generateWallet();
  };

  const applyGeneratedWallet = () => {
    if (generatedWallet) {
      setWalletAddress(generatedWallet);
      setWalletMessage("New wallet address added.");
      setShowWalletModal(false);
    }
  };

  const getCurrentLocation = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        resolve({ latitude: 0, longitude: 0 });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          resolve({ latitude: 0, longitude: 0 });
        }
      );
    });
  };

  const generateUsername = (email: string): string => {
    const username = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "_");
    return username.length >= 3 ? username : username + "_user";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailRef.current?.value.trim() || "";
    const password = passwordRef.current?.value || "";
    const confirmPassword = passwordConfirmRef.current?.value || "";

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    if (!/^[\w.%+-]+@[\w.-]+\.[A-Z]{2,}$/i.test(email)) {
      return setError("Invalid email format");
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,15}$/.test(password)) {
      return setError("Password must be 6–15 characters with at least one letter and one number.");
    }

    if (!accountType) {
      return setError("Please select an account type");
    }

    if (accountType === "Installer" && !companyName) {
      return setError("Please provide a company name");
    }
    if (address.trim().length < 10) {
      return setError("Address must be at least 10 characters long");
    }

    try {
      setError("");
      setLoading(true);
      
      const location = await getCurrentLocation();
      const username = generateUsername(email);

      const userData = {
        email,
        password,
        full_name: fullName.trim(),
        identification_number: identificationNumber.trim(),
        address: address.trim(),
        phone: phone.trim(),
        identity_document: "PENDING_UPDATE",
        bank_account_status: "pending",
        tax_declarations: "PENDING_UPDATE",
        device_brand: "PENDING_UPDATE",
        username,
        installation_company: accountType === "Installer" ? companyName : "Not Applicable",
        devices: [],
        membresia: false,
        verified_email: false,
        verified_sms: false,
        verified_2fa: false,
        status_documents: "pending",
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        role: accountType,
        wallet_address: walletAddress || ""
        
      };

if (accountType === "Installer") {
  const installerData = {
    companyName: companyName.trim(),
    taxId: identificationNumber.trim(),
    address: address.trim(),
    contactPhone: phone.trim(),
    companyEmail: email,
    website: "",
    password:password,
    legalRepresentative: fullName.trim(),
    legalRepId: identificationNumber.trim(),
    legalRepEmail: email,
    legalRepPhone: phone.trim(),

    associatedPartner: "",
    kwGenerated: 0,
    wallet_address: walletAddress,
    Earnings: 0,
    tokens_distributed: 0
  };
try {
    await axios.post(`${URL}/installer`, installerData);
  navigate("/dasbhoardInstaller");
} catch (error) {
  console.error("Error en registro:", error);
}}

  await axios.post(`${URL}/users`, userData);

      

      setShowSignUp(false);
      navigate("/");

      Swal.fire({
        title: "Verify your account!",
        text: "Check your email inbox before logging in.",
        icon: "info",
        confirmButtonColor: "#6366f1",
      });
    } catch (err: any) {
      console.error("Error en registro:", err);
      
      let errorMessage = "Failed to create an account";
      
      if (err.code === "auth/email-already-in-use") {
        errorMessage = "Email is already in use — try signing in";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        errorMessage = errors.map((e: any) => `${e.field}: ${e.message}`).join(", ");
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!showSignUp) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900/70 via-slate-900/60 to-indigo-900/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">

        <div className="grid md:grid-cols-2">
          <div className="bg-gradient-to-br from-indigo-600 via-indigo-500 to-blue-500 text-white p-8 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <img src="/LOGOGAIASOLO.png" alt="Gaia Ecotrack" className="w-14 h-14 rounded-2xl bg-white/10 p-2" />
              <div>
                <p className="text-sm uppercase tracking-wide text-white/80">Welcome to Gaia</p>
                <h1 className="text-3xl font-bold leading-tight">Create your account</h1>
              </div>
            </div>
            <p className="text-white/90 text-sm leading-relaxed">
              Set up your access, choose your role, and optionally attach a wallet now.
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-white/90">
              <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20">Secure sign-up</span>
              <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20">Email verification</span>
              <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20">Wallet ready</span>
            </div>
          </div>

          <div className="p-8 space-y-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Step 1</p>
                <h2 className="text-xl font-semibold text-slate-800">Account details</h2>
              </div>
              <button
                onClick={() => setShowSignUp(false)}
                className="text-sm text-slate-500 hover:text-slate-800"
              >
                Close
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">Select account type</label>
              <div className="grid grid-cols-3 gap-2">
                {["Comercial", "Installer", "Generator"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setAccountType(type)}
                    className={`px-3 py-2 rounded-lg text-sm border transition ${
                      accountType === type
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                        : "bg-white text-slate-800 border-slate-200 hover:border-indigo-200 hover:bg-indigo-50"
                    }`}
                  >
                    {type === "Generator" ? "Final User" : type}
                  </button>
                ))}
              </div>
            </div>

            <form className="space-y-4 text-black" onSubmit={handleSubmit}>
              {accountType === "Installer" && (
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-slate-700">Company Name</label>
                    <span className="text-xs text-slate-400">Required for installers</span>
                  </div>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-4 py-2 mt-1 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 outline-none"
                    placeholder="Enter your company"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700">Full name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 mt-1 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 outline-none"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Identification number</label>
                <input
                  type="text"
                  value={identificationNumber}
                  onChange={(e) => setIdentificationNumber(e.target.value)}
                  className="w-full px-4 py-2 mt-1 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 outline-none"
                  placeholder="Enter your ID number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 mt-1 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 outline-none"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2 mt-1 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 outline-none"
                  placeholder="Enter your address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input
                  ref={emailRef}
                  type="email"
                  className="w-full px-4 py-2 mt-1 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 outline-none"
                  placeholder="email@example.com"
                  required
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <input
                  ref={passwordRef}
                  type={visible ? "text" : "password"}
                  className="w-full px-4 py-2 mt-1 pr-10 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 outline-none"
                  required
                />
                <div
                  className="absolute right-3 top-9 cursor-pointer text-slate-500 hover:text-slate-700"
                  onClick={toggleVisibility}
                >
                  {visible ? <BsEyeSlash /> : <BsEye />}
                </div>
                <p className="text-xs text-slate-400 mt-1">6–15 characters, at least one letter and one number.</p>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
                <input
                  ref={passwordConfirmRef}
                  type={visibleConf ? "text" : "password"}
                  className="w-full text-black px-4 py-2 mt-1 pr-10 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 outline-none"
                  required
                />
                <div
                  className="absolute right-3 top-9 cursor-pointer text-slate-500 hover:text-slate-700"
                  onClick={toggleVisibilityConf}
                >
                  {visibleConf ? <BsEyeSlash /> : <BsEye />}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-700">Wallet address</label>
                  <span className="text-xs text-slate-400">Attach now for faster onboarding</span>
                </div>
                <div className="flex gap-2 text-black">
                  <input
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 outline-none"
                    placeholder="0x..."
                  />
                  
                  <button
                    type="button"
                    onClick={handleConnectWallet}
                    disabled={walletLoading}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center gap-2"
                  >
                    {walletLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Connecting...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                        Connect Wallet
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={openCreateWallet}
                    disabled={createWalletLoading}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {createWalletLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-600"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Create Wallet
                      </>
                    )}
                  </button>
                </div>
                
                {selectedPolkadotAccount && (
                  <div className="mt-2 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-800">
                          {selectedPolkadotAccount.meta.name || 'Polkadot Account'}
                        </p>
                        <p className="text-xs text-purple-600 truncate">
                          {selectedPolkadotAccount.address}
                        </p>
                      </div>
                      <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                        {selectedPolkadotAccount.meta.source}
                      </span>
                    </div>
                  </div>
                )}
                
                {!window.injectedWeb3?.['polkadot-js'] && (
                  <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">
                      <strong>Polkadot.js extension not detected.</strong>{' '}
                      <a 
                        href="https://polkadot.js.org/extension/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-amber-600 underline hover:text-amber-800"
                      >
                        Install it here
                      </a>{' '}
                      to connect your wallet.
                    </p>
                  </div>
                )}
                
                {walletMessage && <p className="text-xs text-emerald-600">{walletMessage}</p>}
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
              {copyFeedback && <p className="text-emerald-600 text-sm">{copyFeedback}</p>}

              <button
                disabled={loading}
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Creating account..." : "Sign Up"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Modal para seleccionar cuenta de Polkadot */}
      <WalletSelectorModal
        isOpen={showPolkadotModal}
        accounts={polkadotAccounts}
        selectedAccount={selectedPolkadotAccount?.address || null}
        onSelectAccount={handleSelectPolkadotAccount}
        onClose={() => setShowPolkadotModal(false)}
        isLoading={isLoadingAccounts}
      />

      {/* Modal para wallet generado */}
      {showWalletModal && (
        <div className="fixed text-black inset-0 z-[60] flex items-center justify-center bg-black/60 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">New wallet</p>
                <h3 className="text-xl font-semibold text-slate-800">Your generated wallet</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Save your seed words and address before closing this modal.
                </p>
              </div>
              <button
                onClick={() => setShowWalletModal(false)}
                className="text-sm text-slate-500 hover:text-slate-800"
              >
                Close
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700">Seed phrase (12 words)</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSeedVisible((prev) => !prev)}
                    className="text-xs px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50"
                  >
                    {seedVisible ? "Hide" : "Show"}
                  </button>
                  <button
                    onClick={() => copyToClipboard(seedWords.join(" "), "Seed phrase")}
                    className="text-xs px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                {seedVisible ? (
                  <div className="grid grid-cols-2 gap-2 text-sm text-slate-800">
                    {seedWords.map((word, idx) => (
                      <span key={`${word}-${idx}`} className="px-2 py-1 rounded bg-white border border-slate-100">
                        {idx + 1}. {word}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">Seed hidden. Click "Show" to reveal.</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700">Wallet address</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(generatedWallet, "Wallet address")}
                    className="text-xs px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50"
                  >
                    Copy
                  </button>
                  <button
                    onClick={applyGeneratedWallet}
                    className="text-xs px-3 py-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Use this wallet
                  </button>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800">
                {generatedWallet}
              </div>
            </div>

            <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
              <p className="font-semibold">Important</p>
              <p>
                Anyone with these secret words can access your wallet. Store them securely
                offline. Do not share them with anyone.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowWalletModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700"
              >
                Close
              </button>
              <button
                onClick={applyGeneratedWallet}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Save and use address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}