import React, { useState, useEffect } from "react";
import axios from "axios";
const MyContext = React.createContext({
  usuarioActual: "Greg",
  cambiarNumero: () => {
    console.log("hola");
  },
});

export const MyCustomContext = (props) => {
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [usuarioActual, setusuarioActual] = useState("");
  const [nmActual, setnmActual] = useState("");
  const [failedAttemps, setFailedAttemps] = useState(0);
  const [userStatus, setUserStatus] = useState("active");
  const [previousPage, setpreviousPage] = useState(null);
  const [isSuccesfullyLogged, setisSuccesfullyLogged] = useState(false);
  const [timerForJwt, settimerForJwt] = useState(false);
  const [currentSolitude, setcurrentSolitude] = useState({});
  const [userAditionalInfo, setuserAditionalInfo] = useState({});
  const [currentJWT, setcurrentJWT] = useState(null);

  const cerrandoTab = async (windowAboutToClose) => {
    if (!windowAboutToClose.current) {
      windowAboutToClose.current = true;
      console.log("Este es el usuario que se esta mandando", usuarioActual);
      console.log(usuarioActual);
      const response = await axios.post("/admin/closingTab", {
        name: usuarioActual.usuarioActual,
      });
      console.log(response.data.message);
    }
  };

  const logOut = () => {
    setisLoggedIn(false);
  };
  const logIn = () => {
    setisLoggedIn(true);
  };

  return (
    <MyContext.Provider
      value={{
        usuarioActual: usuarioActual,
        setusuarioActual: setusuarioActual,

        nmActual: nmActual,
        setnmActual: setnmActual,

        failedAttemps: failedAttemps,
        setFailedAttemps: setFailedAttemps,

        currentSolitude: currentSolitude,
        setcurrentSolitude: setcurrentSolitude,

        previousPage: previousPage,
        setpreviousPage: setpreviousPage,

        userStatus: userStatus,
        setUserStatus: setUserStatus,
        isLoggedIn: isLoggedIn,

        isSuccesfullyLogged: isSuccesfullyLogged,
        setisSuccesfullyLogged: setisSuccesfullyLogged,
        logOut: logOut,
        logIn: logIn,

        userAditionalInfo: userAditionalInfo,
        setuserAditionalInfo: setuserAditionalInfo,

        cerrandoTab: cerrandoTab,
        timerForJwt: timerForJwt,
        settimerForJwt: settimerForJwt,

        currentJWT: currentJWT,
        setcurrentJWT: setcurrentJWT,
      }}
    >
      {props.children}
    </MyContext.Provider>
  );
};

export default MyContext;
