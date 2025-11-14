// import { createContext, useEffect, useState } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem("user"));
//     if (storedUser) {
//       setUser(storedUser);
//     }
//   }, []); 
//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//   };

//   return (
//     <AuthContext.Provider value={{ user, setUser, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export { AuthContext };



import { createContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("access");

    if (storedUser && storedToken) {
      setUser(storedUser);
      setAccessToken(storedToken);

      // ✅ Set token for all axios requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
  }, []);

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, setUser, accessToken, setAccessToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };

