import React, { useState, useEffect, useNavigate } from "react";
import axios from "axios";
import { CheckBoxTwoTone } from "@material-ui/icons";
const MyContext = React.createContext({
  usuarioActual: "Greg",
  cambiarNumero: () => {},
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

  const navigate = useNavigate();

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
    navigate("/");
    sessionStorage.removeItem("token");
  };
  const logIn = () => {
    setisLoggedIn(true);
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsLoggedIn(true);
      setToken(localStorage.getItem("token"));
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
