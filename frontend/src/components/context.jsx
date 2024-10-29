import axios from "axios";
import React, { createContext, useState } from "react";

export const Context = createContext();

export default function ContextProvider({children}) {

    const [token, setToken] = useState(localStorage.getItem('token')? localStorage.getItem('token'): null);



    async function validateTokenWithServer() {
        const token = localStorage.getItem('token');

        try {
          const response = await axios.post(process.env.REACT_APP_VALIDATE_TOKEN_URL, {
            token: token            
          });
          
          if(response.status === 401) {
            window.location.href = '/login';
            localStorage.removeItem("token");
          }
        } catch (error) {
            console.log("Hello there")
          console.error('Validation failed:', error);
          return false;
        }
      }




    const contextValues = {
        token,
        setToken,
        validateTokenWithServer,
    };

    return <Context.Provider value={contextValues}>{children}</Context.Provider>
};

