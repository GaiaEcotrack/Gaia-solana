import axios from 'axios';
import { getAuth, signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react'

const NewDashboard = () => {

    const auth = getAuth();
    const [cardUser, setcardUser] = useState(true)
    const [userOnline, setUserOnline] = useState([])
    const [profileCard, setProfileCard] = useState(false)
    const [cardUserPayment, setCardUserPayment] = useState(false)
    const [modal, setModal] = useState(false)
    const [users, setUsers] = useState<User[]>([]);
    const [photoProfile, setPhotoProfile] = useState<string | null>(null);
    const apiExpress = import.meta.env.VITE_APP_API_EXPRESS
    const username=import.meta.env.VITE_APP_ADMIN_USER
    const password=import.meta.env.VITE_APP_ADMIN_PASSWORD
    const currentUser = auth.currentUser?.email
    console.log(currentUser);
    
  
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          // Paso 1: Obtener el token desde la ruta de autenticación
          const loginResponse = await axios.post(`${apiExpress}/auth/login`, {
            username: username, 
            password: password  
          });
      
          const token = loginResponse.data.token;
      
          // Paso 2: Almacenar el token en el localStorage
          localStorage.setItem('token', token);
      
          // Paso 3: Usar el token para realizar la petición a la otra ruta
          const response = await axios.get(`${apiExpress}/generator/byinstaller/${userOnline.installation_company
          }`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
      
          const data = response.data;
          setUsers(data);
      
        } catch (error) {
          console.log(error);
        }
      };
      const fetchType = async () => {
        try {
          // Paso 1: Obtener el token desde la ruta de autenticación
          const loginResponse = await axios.post(`${apiExpress}/auth/login`, {
            username: username, 
            password: password  
          });
      
          const token = loginResponse.data.token;
      
          // Paso 2: Almacenar el token en el localStorage
          localStorage.setItem('token', token);
      
          // Paso 3: Usar el token para realizar la petición a la otra ruta
          const response = await axios.get(`${apiExpress}/users/search`, {
            headers: {
              Authorization: `Bearer ${token}`
            },
            params: {
              email: currentUser // Aquí pasas el filtro por email
            }
          });
      
          const user = response.data; // Obtiene el usuario desde la respuesta
          setUserOnline(user)
          
      
        } catch (error) {
          console.log(error);
        }
      };
      fetchType()
      if (userOnline.installation_company !== undefined) {
        fetchUsers();
      }
       
  
      const photo_profile = localStorage.getItem('profilePic');
      setPhotoProfile(photo_profile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ apiExpress,userOnline.installation_company]);
  
    const openCardUser = ()=>{
      setCardUserPayment(false)
      setcardUser(true)
      setProfileCard(false)
    }
  
    // const openCardPayment = ()=>{
    //   setCardUserPayment(true)
    //   setcardUser(false)
    // }
  
    const openProfile = ()=>{
      if(userOnline.role === "Installer"){
        setCardUserPayment(false)
        setcardUser(false)
        setProfileCard(true)
      }
      else if(userOnline.role === "Comercial"){
        setCardUserPayment(false)
        setcardUser(false)
        setProfileCard(false)
      }
    }
  
    const openModal= ()=>{
      setModal(true)
    }
    const closeModal= ()=>{
      setModal(false)
    }
  
  
    const signOutWithoutAuth = async () => {
      await signOut(auth);
      localStorage.clear()
    };
    const today = new Date();
  const date = today.toLocaleDateString();
    
  const handleUserClick = async (user: User) => {
    setLoading(true);
    try {
      let userDeviceData;
      if (user.brand === 'Hoymiles') {
        userDeviceData = await fetchDataHoymilesInstaller(user.secret_name);
      } else if (user.brand === 'Growatt') {
        userDeviceData = await fetchDataGrowattInstaller(user.secret_name);
      }
      setSelectedUserData(userDeviceData);
      setModal(true);
    } catch (error) {
      console.error('Error fetching user device data:', error);
    } finally {
      setLoading(false);
    }
  };




  return (
    <div>
        <div className="relative flex size-full min-h-screen flex-col bg-[#fcf8f8] group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f4e6e6] px-10 py-3">
          <div className="flex items-center gap-4 text-[#1c0d0d]">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z"
                  fill="currentColor"
                ></path>
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M39.998 35.764C39.9944 35.7463 39.9875 35.7155 39.9748 35.6706C39.9436 35.5601 39.8949 35.4259 39.8346 35.2825C39.8168 35.2403 39.7989 35.1993 39.7813 35.1602C38.5103 34.2887 35.9788 33.0607 33.7095 32.5189C30.9875 31.8691 27.6413 31.4783 24 31.4783C20.3587 31.4783 17.0125 31.8691 14.2905 32.5189C12.0012 33.0654 9.44505 34.3104 8.18538 35.1832C8.17384 35.2075 8.16216 35.233 8.15052 35.2592C8.09919 35.3751 8.05721 35.4886 8.02977 35.589C8.00356 35.6848 8.00039 35.7333 8.00004 35.7388C8.00004 35.739 8 35.7393 8.00004 35.7388C8.00004 35.7641 8.0104 36.0767 8.68485 36.6314C9.34546 37.1746 10.4222 37.7531 11.9291 38.2772C14.9242 39.319 19.1919 40 24 40C28.8081 40 33.0758 39.319 36.0709 38.2772C37.5778 37.7531 38.6545 37.1746 39.3151 36.6314C39.9006 36.1499 39.9857 35.8511 39.998 35.764ZM4.95178 32.7688L21.4543 6.30267C22.6288 4.4191 25.3712 4.41909 26.5457 6.30267L43.0534 32.777C43.0709 32.8052 43.0878 32.8338 43.104 32.8629L41.3563 33.8352C43.104 32.8629 43.1038 32.8626 43.104 32.8629L43.1051 32.865L43.1065 32.8675L43.1101 32.8739L43.1199 32.8918C43.1276 32.906 43.1377 32.9246 43.1497 32.9473C43.1738 32.9925 43.2062 33.0545 43.244 33.1299C43.319 33.2792 43.4196 33.489 43.5217 33.7317C43.6901 34.1321 44 34.9311 44 35.7391C44 37.4427 43.003 38.7775 41.8558 39.7209C40.6947 40.6757 39.1354 41.4464 37.385 42.0552C33.8654 43.2794 29.133 44 24 44C18.867 44 14.1346 43.2794 10.615 42.0552C8.86463 41.4464 7.30529 40.6757 6.14419 39.7209C4.99695 38.7775 3.99999 37.4427 3.99999 35.7391C3.99999 34.8725 4.29264 34.0922 4.49321 33.6393C4.60375 33.3898 4.71348 33.1804 4.79687 33.0311C4.83898 32.9556 4.87547 32.8935 4.9035 32.8471C4.91754 32.8238 4.92954 32.8043 4.93916 32.7889L4.94662 32.777L4.95178 32.7688ZM35.9868 29.004L24 9.77997L12.0131 29.004C12.4661 28.8609 12.9179 28.7342 13.3617 28.6282C16.4281 27.8961 20.0901 27.4783 24 27.4783C27.9099 27.4783 31.5719 27.8961 34.6383 28.6282C35.082 28.7342 35.5339 28.8609 35.9868 29.004Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <h2 className="text-[#1c0d0d] text-lg font-bold leading-tight tracking-[-0.015em]">Solar Energy</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <a className="text-[#1c0d0d] text-sm font-medium leading-normal" href="#">Dashboard</a>
              <a className="text-[#1c0d0d] text-sm font-medium leading-normal" href="#">Users</a>
              <a className="text-[#1c0d0d] text-sm font-medium leading-normal" href="#">Rewards</a>
              <button onClick={signOutWithoutAuth} className="text-[#1c0d0d] text-sm font-medium leading-normal">Log out</button>
            </div>
            <button
              className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 bg-[#f4e6e6] text-[#1c0d0d] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5"
            >
              <div className="text-[#1c0d0d]" data-icon="Bell" data-size="20px" data-weight="regular">
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                  <path
                    d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"
                  ></path>
                </svg>
              </div>
            </button>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
            ></div>
          </div>
        </header>
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-80">
            <div className="flex h-full min-h-[700px] flex-col justify-between bg-[#fcf8f8] p-4">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#f4e6e6]">
                    <div className="text-[#1c0d0d]" data-icon="House" data-size="24px" data-weight="fill">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path
                          d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z"
                        ></path>
                      </svg>
                    </div>
                    <p className="text-[#1c0d0d] text-sm font-medium leading-normal">Dashboard</p>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="text-[#1c0d0d]" data-icon="Users" data-size="24px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path
                          d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"
                        ></path>
                      </svg>
                    </div>
                    <p className="text-[#1c0d0d] text-sm font-medium leading-normal">Users</p>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="text-[#1c0d0d]" data-icon="Gift" data-size="24px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path
                          d="M216,72H180.92c.39-.33.79-.65,1.17-1A29.53,29.53,0,0,0,192,49.57,32.62,32.62,0,0,0,158.44,16,29.53,29.53,0,0,0,137,25.91a54.94,54.94,0,0,0-9,14.48,54.94,54.94,0,0,0-9-14.48A29.53,29.53,0,0,0,97.56,16,32.62,32.62,0,0,0,64,49.57,29.53,29.53,0,0,0,73.91,71c.38.33.78.65,1.17,1H40A16,16,0,0,0,24,88v32a16,16,0,0,0,16,16v64a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V136a16,16,0,0,0,16-16V88A16,16,0,0,0,216,72ZM149,36.51a13.69,13.69,0,0,1,10-4.5h.49A16.62,16.62,0,0,1,176,49.08a13.69,13.69,0,0,1-4.5,10c-9.49,8.4-25.24,11.36-35,12.4C137.7,60.89,141,45.5,149,36.51Zm-64.09.36A16.63,16.63,0,0,1,96.59,32h.49a13.69,13.69,0,0,1,10,4.5c8.39,9.48,11.35,25.2,12.39,34.92-9.72-1-25.44-4-34.92-12.39a13.69,13.69,0,0,1-4.5-10A16.6,16.6,0,0,1,84.87,36.87ZM40,88h80v32H40Zm16,48h64v64H56Zm144,64H136V136h64Zm16-80H136V88h80v32Z"
                        ></path>
                      </svg>
                    </div>
                    <p className="text-[#1c0d0d] text-sm font-medium leading-normal">Rewards</p>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="text-[#1c0d0d]" data-icon="Gear" data-size="24px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path
                          d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z"
                        ></path>
                      </svg>
                    </div>
                    <p className="text-[#1c0d0d] text-sm font-medium leading-normal">Settings</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#1c0d0d] tracking-light text-[32px] font-bold leading-tight min-w-72">Dashboard</p>
              <button
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#f4e6e6] text-[#1c0d0d] text-sm font-medium leading-normal"
              >
                <span className="truncate">New user</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-4 p-4">
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-[#f4e6e6]">
                <p className="text-[#1c0d0d] text-base font-medium leading-normal">Total Users</p>
                <p className="text-[#1c0d0d] tracking-light text-2xl font-bold leading-tight">120</p>
                <p className="text-[#078807] text-base font-medium leading-normal">+2%</p>
              </div>
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-[#f4e6e6]">
                <p className="text-[#1c0d0d] text-base font-medium leading-normal">Total kW Generated</p>
                <p className="text-[#1c0d0d] tracking-light text-2xl font-bold leading-tight">15,000</p>
                <p className="text-[#078807] text-base font-medium leading-normal">+5%</p>
              </div>
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-[#f4e6e6]">
                <p className="text-[#1c0d0d] text-base font-medium leading-normal">Total Earnings</p>
                <p className="text-[#1c0d0d] tracking-light text-2xl font-bold leading-tight">$120,000</p>
                <p className="text-[#078807] text-base font-medium leading-normal">+3%</p>
              </div>
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-[#f4e6e6]">
                <p className="text-[#1c0d0d] text-base font-medium leading-normal">Tokens Distributed</p>
                <p className="text-[#1c0d0d] tracking-light text-2xl font-bold leading-tight">200,000</p>
                <p className="text-[#078807] text-base font-medium leading-normal">+1%</p>
              </div>
            </div>
            <h3 className="text-[#1c0d0d] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">User List</h3>
            <div className="px-4 py-3">
              <label className="flex flex-col min-w-40 h-12 w-full">
                <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                  <div
                    className="text-[#9e4747] flex border-none bg-[#f4e6e6] items-center justify-center pl-4 rounded-l-xl border-r-0"
                    data-icon="MagnifyingGlass"
                    data-size="24px"
                    data-weight="regular"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"
                      ></path>
                    </svg>
                  </div>
                  <input
                    placeholder="Search user"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1c0d0d] focus:outline-0 focus:ring-0 border-none bg-[#f4e6e6] focus:border-none h-full placeholder:text-[#9e4747] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                    value=""
                  />
                </div>
              </label>
            </div>
            <div className="flex gap-3 p-3"></div>
            <div className="px-4 py-3 @container">
              <div className="flex overflow-hidden rounded-xl border border-[#e9cece] bg-[#fcf8f8]">
                <table className="flex-1">
                  <thead>
                    <tr className="bg-[#fcf8f8]">
                      <th className="table-251620b9-d09d-483f-b11c-ded25fde03d4-column-120 px-4 py-3 text-left text-[#1c0d0d] w-[400px] text-sm font-medium leading-normal">Brand</th>
                      <th className="table-251620b9-d09d-483f-b11c-ded25fde03d4-column-240 px-4 py-3 text-left text-[#1c0d0d] w-[400px] text-sm font-medium leading-normal">Account</th>
                      <th className="table-251620b9-d09d-483f-b11c-ded25fde03d4-column-360 px-4 py-3 text-left text-[#1c0d0d] w-[400px] text-sm font-medium leading-normal">
                        kW Generated
                      </th>
                      <th className="table-251620b9-d09d-483f-b11c-ded25fde03d4-column-480 px-4 py-3 text-left text-[#1c0d0d] w-60 text-sm font-medium leading-normal">Status</th>
                      <th className="table-251620b9-d09d-483f-b11c-ded25fde03d4-column-600 px-4 py-3 text-left text-[#1c0d0d] w-[400px] text-sm font-medium leading-normal">
                        Last Update
                      </th>
                      <th
                        className="table-251620b9-d09d-483f-b11c-ded25fde03d4-column-720 px-4 py-3 text-left text-[#1c0d0d] w-60 text-[#9e4747] text-sm font-medium leading-normal"
                      ></th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((users)=>(
                                            <tr className="border-t border-t-[#e9cece]">
                                            <td className="table-251620b9-d09d-483f-b11c-ded25fde03d4-column-120 h-[72px] px-4 py-2 w-[400px] text-[#1c0d0d] text-sm font-normal leading-normal">
                                            {users.brand}
                                            </td>
                                            <td className="table-251620b9-d09d-483f-b11c-ded25fde03d4-column-240 h-[72px] px-4 py-2 w-[400px] text-[#9e4747] text-sm font-normal leading-normal">
                                            {users.secret_name}
                                            </td>
                                            <td className="table-251620b9-d09d-483f-b11c-ded25fde03d4-column-360 h-[72px] px-4 py-2 w-[400px] text-[#9e4747] text-sm font-normal leading-normal">{users.generatedKW}</td>
                                            <td className="table-251620b9-d09d-483f-b11c-ded25fde03d4-column-480 h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                                              <button
                                                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#f4e6e6] text-[#1c0d0d] text-sm font-medium leading-normal w-full"
                                              >
                                                <span className="truncate">Active</span>
                                              </button>
                                            </td>
                                            <td className="table-251620b9-d09d-483f-b11c-ded25fde03d4-column-600 h-[72px] px-4 py-2 w-[400px] text-[#9e4747] text-sm font-normal leading-normal">
                                            {date}
                                            </td>
                                            <td className="table-251620b9-d09d-483f-b11c-ded25fde03d4-column-720 h-[72px] px-4 py-2 w-60 text-[#9e4747] text-sm font-bold leading-normal tracking-[0.015em]">
                                              View Details
                                            </td>
                                          </tr> 
                    ))}

                  </tbody>
                </table>
              </div>
              {/* <style>
                          @container(max-width:120px){.table-251620b9-d09d-483f-b11c-ded25fde03d4-column-120{display: none;}}
                @container(max-width:240px){.table-251620b9-d09d-483f-b11c-ded25fde03d4-column-240{display: none;}}
                @container(max-width:360px){.table-251620b9-d09d-483f-b11c-ded25fde03d4-column-360{display: none;}}
                @container(max-width:480px){.table-251620b9-d09d-483f-b11c-ded25fde03d4-column-480{display: none;}}
                @container(max-width:600px){.table-251620b9-d09d-483f-b11c-ded25fde03d4-column-600{display: none;}}
                @container(max-width:720px){.table-251620b9-d09d-483f-b11c-ded25fde03d4-column-720{display: none;}}
              </style> */}
            </div>
            <div className="p-4 @container">
              <div className="flex flex-1 flex-col items-start justify-between gap-4 rounded-xl border border-[#e9cece] bg-[#fcf8f8] p-5 @[480px]:flex-row @[480px]:items-center">
                <div className="flex flex-col gap-1">
                  <p className="text-[#1c0d0d] text-base font-bold leading-tight">Video Tutorial</p>
                  <p className="text-[#9e4747] text-base font-normal leading-normal">
                    Watch our latest video tutorial on how to use the dashboard and manage your solar energy system.
                  </p>
                </div>
                <button
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#fb6060] text-[#fcf8f8] text-sm font-medium leading-normal"
                >
                  <span className="truncate">Watch Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default NewDashboard