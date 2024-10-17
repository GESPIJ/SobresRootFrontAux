import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { CheckBoxTwoTone } from "@material-ui/icons";
const MyContext = React.createContext({
  // usuarioActual: "Greg",
  // cambiarNumero: () => {},
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
  const [token, setToken] = useState("");
  const [currentJWT, setcurrentJWT] = useState(null);

  const history = useHistory();

  const cerrandoTab = async (windowAboutToClose) => {
    if (!windowAboutToClose.current) {
      windowAboutToClose.current = true;
      const response = await axios.post("/admin/closingTab", {
        name: usuarioActual.usuarioActual,
        nm: nmActual,
      });
    }
  };

  const logOut = () => {
    setisLoggedIn(false);
    setisSuccesfullyLogged(false);
    // history.replace("/");
    sessionStorage.removeItem("token");
  };
  const logIn = () => {
    setisLoggedIn(true);
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setisLoggedIn(true);
      setisSuccesfullyLogged(true);
      setcurrentJWT(localStorage.getItem("token"));
    }
  }, []);

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
        setisLoggedIn: setisLoggedIn,

        token: token,
        setToken: setToken,

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
