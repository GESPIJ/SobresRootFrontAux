import logo from "./logo.svg";
import React, { useState, useEffect, useRef } from "react";
import { useContext } from "react";
import {
  BrowserRouter,
  Switch,
  Link,
  Route,
  useHistory,
} from "react-router-dom";
import "./App.css";
import MyContext, { MyCustomContext } from "./context/mycontext";
import LoginLDAP from "./LoginLDAP";
import SignIn from "./Signin";
import SignInLDAP from "./SignLDAP";
import SignUpUser from "./components/Admin/SignUpUser";
import SignUpSystem from "./components/Admin/SignUpSystem";
import SignUpPrinter from "./components/Admin/SignUpPrinter";
import Identifier from "./components/Identifier";
import HomeOperations from "./components/Operation/OperationsHome";
import HomeAdmin from "./components/Admin/AdminHome";
import NewSolitude from "./components/Operation/newSolitude";
import WaitingForPrint from "./components/Operation/waitingForPrint";
import TimeOutCounter from "./components/Operation/timeoutCounter";
import Prueba from "./components/componenteForm";
import SolitudesTable from "./components/Operation/solitudesTableView";
import UsersTable from "./components/Admin/usersTableView";
import SystemTable from "./components/Admin/systemsTableview";
import PrintersTable from "./components/Admin/printersTableView";
import ModifyUser from "./components/Admin/modifyUser";
import ModifySystem from "./components/Admin/modifySystem";
import ModifyPrinter from "./components/Admin/modifyPrinter";
import RequestDoubleAuth from "./components/requestDoubleAuth";
import ErrorFallBackPage from "./components/ErrorFallBackPage";
import HojaSistemasImprimir from "./components/HojaImprimirSistemas";
import FormularioMediosMagneticos from "./components/FormularioMediosMagneticos";
import FormularioMediosNoMagneticos from "./components/FormularioMediosNoMagneticos";
import axios from "axios";
import ConfirmDialog from "./components/Dialogs/ConfirmDialog";
import Wraper from "./wraper";

function App() {
  const ctx = useContext(MyContext);

  const windowAboutToClose = useRef(false);
  const windowAboutToStay = useRef(false);
  const firstTimeTimerToken = useRef(false);
  let variableCambio = false;
  const usuarioOriginal = window.localStorage.getItem("usuario")
    ? window.localStorage.getItem("usuario")
    : "";
  const [usuario, setusuario] = useState(usuarioOriginal);
  const [counter, setcounter] = useState(0);
  const [clickOnStay, setclickOnStay] = useState(false);
  const [showConfirmDialog, setshowConfirmDialog] = useState(false);

  const cerrandoTab = async () => {
    if (!windowAboutToClose.current) {
      windowAboutToClose.current = true;
      console.log("Este es el usuario que se esta mandando", ctx.usuarioActual);
      console.log(ctx);
      const response = await axios.post("/admin/closingTab", {
        name: ctx.usuarioActual,
      });
      console.log(response.data.message);
    }
  };

  const stayingTab = async () => {
    if (!windowAboutToStay.current) {
      windowAboutToStay.current = true;
      const response = await axios.post("/admin/stayingTab", {
        name: ctx.usuarioActual,
      });
      console.log(response.data.message);
    }
  };

  function sleep(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  const registerNewToken = async () => {
    const response = await axios.get("/admin/generateNewToken");
    window.localStorage.setItem("code", response.data.message);

    await axios.post("/admin/updateJWToken", {
      name: ctx.usuarioActual,
      code: response.data.message,
    });

    const messageText =
      "El usuario " + ctx.usuarioActual + " registro un nuevo token";
    await axios.post("/admin/registerLog", {
      message: messageText,
      solitude: null,
    });

    ctx.settimerForJwt((prev) => !prev);
  };

  useEffect(() => {
    if (clickOnStay) {
      //cerrandoTab();
      //setclickOnStay(false);
    } else {
      console.log("El usuario cerro");
    }
    window.onbeforeunload = async () => {
      if (!windowAboutToClose.current) {
        windowAboutToClose.current = true;
        console.log(
          "Este es el usuario que se esta mandando",
          ctx.usuarioActual
        );
        console.log(ctx);
        const messageText =
          "Intento de deslogeo por parte del usuario " +
          ctx.usuarioActual +
          ", trato de cerrar la pantalla";
        await axios.post("/admin/registerLog", {
          message: messageText,
          solitude: null,
        });
        const response = await axios.post("/admin/closingTab", {
          name: ctx.usuarioActual,
        });
        console.log(response.data.message);
        window.setTimeout(async () => {
          const actualJWT = window.localStorage.getItem("code");
          const response = await axios.post("/admin/stayingTab", {
            name: ctx.usuarioActual,
            lastJWT: actualJWT,
          });
          const messageText =
            "El usuario " + ctx.usuarioActual + " se quedo en la pantalla";
          await axios.post("/admin/registerLog", {
            message: messageText,
            solitude: null,
          });
          console.log("El timer se acabo", response);
        }, 4000);
      }
    };
    console.log("Se esta volviendo a renderizar la aplicacion");
    console.log(ctx.usuarioActual);
  }, [ctx.usuarioActual]);

  useEffect(() => {
    if (firstTimeTimerToken.current) {
      //console.log("BOOOM se disparo el timer que espera a cambiar el codigo");
      setTimeout(async () => {
        await registerNewToken();
        ctx.settimerForJwt((prev) => !prev);
      }, 120000);
    } else {
      firstTimeTimerToken.current = true;
      registerNewToken();
    }
  }, [ctx.timerForJwt]);

  return (
    <>
      {ctx.usuarioActual !== "" || window.location.pathname === "/" || true ? (
        <div
          className="App"
          onLoad={() => {
            const body = document.body;
            window.addEventListener("onclick", () => {
              //console.log("Hubo un click");
            });
            window.addEventListener("beforeunload", (event) => {
              //setshowConfirmDialog(true);

              // console.log(
              //   "Es aca donde se imprime el resultado del cuadro de dialogo"
              // );
              // const cerrandoTab = async () => {
              //   if (!windowAboutToClose.current) {
              //     windowAboutToClose.current = true;
              //     console.log(
              //       "Este es el usuario que se esta mandando",
              //       ctx.usuarioActual
              //     );
              //     console.log(ctx);
              //     const response = await axios.post("/admin/closingTab", {
              //       name: ctx.usuarioActual,
              //     });
              //     console.log(response.data.message);
              //   }
              // };
              ctx.cerrandoTab(windowAboutToClose);
              event.stopPropagation();
              event.preventDefault();
              //event.cancelBubble();
              //await sleep(1000);
              cerrandoTab();

              window.setTimeout(() => {
                //console.log("El usuario al final se quedo");
                //stayingTab();
              }, 5000);
              return (event.returnValue = "");
            });

            // window.addEventListener("onunload", (event) => {
            //   //event.preventDefault();
            //   window.alert("Nooooooooooooo");
            //   //cerrandoTab();
            //   //return (event.returnValue = "Are you sure you want to exit?");
            // });

            window.history.pushState(
              null,
              document.title,
              window.location.href
            );
            window.addEventListener("popstate", function (event) {
              window.history.pushState(
                null,
                document.title,
                window.location.href
              );
            });

            window.addEventListener("focus", (event) => {
              windowAboutToClose.current = false;
              windowAboutToStay.current = false;
            });
          }}
        >
          {/* <Formulario /> */}
          {/* <MyContext.Provider
      value={{
        numero: counter.toString(),
        color: "Amarillo",
        cambiarNumero: imprimirConsola,
        cambiarCounter: setcounter,
        usuarioActual: usuario,
        cambiarUsuario: setusuario,
        guardarSesion: guardarValoresNavegador,
      }}> */}

          {showConfirmDialog && (
            <ConfirmDialog
              title={"De verdad quieres abandonar la pagina?"}
              cancelFunction={() => {
                setshowConfirmDialog(false);
              }}
              confirmFunction={() => {
                setshowConfirmDialog(false);
              }}
            />
          )}
          <Wraper>
            <BrowserRouter>
              {/* <Route exact path="/" render={() => <Identifier />} /> */}
              <Route exact path="/" component={Identifier} />
              <Route
                exact
                path="/doubleAuth"
                render={() => <RequestDoubleAuth />}
              />
              <Route exact path="/signIn" render={() => <SignIn />}></Route>
              <Route
                exact
                path="/signInLDAP"
                render={() => <SignInLDAP />}
              ></Route>
              <Route exact path="/signUpUser" render={() => <SignUpUser />} />
              <Route
                exact
                path="/signUpSystem"
                render={() => <SignUpSystem />}
              />
              <Route
                exact
                path="/signUpPrinter"
                render={() => <SignUpPrinter />}
              />
              <Route exact path="/loginLDAP" render={() => <LoginLDAP />} />
              <Route exact path="/newSolitude" render={() => <NewSolitude />} />
              <Route
                exact
                path="/timeoutCounter"
                component={TimeOutCounter}
                //render={() => <TimeOutCounter />}
              />

              <Route
                exact
                path="/waitingForPrint"
                render={() => <WaitingForPrint />}
              />

              <Route
                exact
                path="/HomeOperations"
                render={() => <HomeOperations />}
              />
              <Route exact path="/HomeAdmin" render={() => <HomeAdmin />} />
              <Route exact path="/prueba" render={() => <Prueba />} />
              <Route
                exact
                path="/solitudesTable"
                render={() => <SolitudesTable />}
              />
              <Route exact path="/usersTable" render={() => <UsersTable />} />
              <Route
                exact
                path="/systemsTable"
                render={() => <SystemTable />}
              />
              <Route
                exact
                path="/printersTable"
                render={() => <PrintersTable />}
              />
              <Route exact path="/modifyUser" component={ModifyUser} />
              <Route exact path="/modifySystem" component={ModifySystem} />
              <Route exact path="/modifyPrinter" component={ModifyPrinter} />

              <Route exact path="/pageToPDF" component={HojaSistemasImprimir} />
              <Route
                exact
                path="/FormularioMediosMagneticos"
                component={FormularioMediosMagneticos}
              />
              <Route
                exact
                path="/FormularioMediosNoMagneticos"
                component={FormularioMediosNoMagneticos}
              />
            </BrowserRouter>
          </Wraper>
        </div>
      ) : (
        <div className="App">
          <BrowserRouter>
            <ErrorFallBackPage />
          </BrowserRouter>
        </div>
      )}
    </>
  );
}

export default App;
