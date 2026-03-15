import axios from "axios";

const username=import.meta.env.VITE_APP_ADMIN_USER
const password=import.meta.env.VITE_APP_ADMIN_PASSWORD
const apiExpress = import.meta.env.VITE_APP_API_EXPRESS


export const addDevice = async (secret:any, company:any,brand:any) => {
    try {
      // Realiza el login y obtiene el token
      const loginResponse = await axios.post(`${apiExpress}/auth/login`, {
        username: username, 
        password: password  
      });
      
      const token = loginResponse.data.token;
  
      // Almacena el token en el localStorage
      localStorage.setItem('token', token);
  
      // Realiza el post a /generator/users usando el token en los headers
      await axios.post(
        `${apiExpress}/generator/users`,
        { 
          name: userLogin,
          wallet: account?.address,
          secret_name: secret,
          installation_company: company,
          brand:brand 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  };