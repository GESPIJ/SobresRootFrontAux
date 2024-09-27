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
import moment from "moment";

//Here we are importing the snackbar
import { Button, Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import getSocket from "./socket";
//import { io } from "socket.io-client";
//import socket from "./socket";

function App() {
  const ctx = useContext(MyContext);

  const history = useHistory();
  //He are the ref placed!!!
  const windowAboutToClose = useRef(false);
  const windowAboutToStay = useRef(false);
  const firstTimeTimerToken = useRef(false);
  let variableCambio = false;
  const usuarioOriginal = window.localStorage.getItem("usuario")
    ? window.localStorage.getItem("usuario")
    : "";

  const [clickOnStay, setclickOnStay] = useState(false);
  const [showConfirmDialog, setshowConfirmDialog] = useState(false);
  const [systemIdToRedirect, setsystemIdToRedirect] = useState(null);

  const [snackBars, setSnackBars] = useState([]);

  const cerrandoTab = async () => {
    if (!windowAboutToClose.current) {
      windowAboutToClose.current = true;
      await axios.post("/admin/closingTab", {
        // name: ctx.usuarioActual,
        nm: ctx.nmActual,
      });
    }
  };

  const stayingTab = async () => {
    if (!windowAboutToStay.current) {
      windowAboutToStay.current = true;
      const response = await axios.post("/admin/stayingTab", {
        name: ctx.usuarioActual,
      });
    }
  };

  function sleep(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  const registerNewToken = async () => {
    const response = await axios.get("/admin/generateNewToken");

    ctx.setcurrentJWT(response.data.message);

    //window.localStorage.setItem("code", response.data.message);

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

  const displaySnackbar = (severity, content) => {
    setSnackBars({
      ...snackBars,
      open: true,
      content: content,
      severity: severity,
    });
  };

  useEffect(() => {
    if (clickOnStay) {
      //cerrandoTab();
      //setclickOnStay(false);
    } else {
    }
    window.onbeforeunload = async () => {
      if (!windowAboutToClose.current) {
        windowAboutToClose.current = true;

        const messageText =
          "Intento de deslogeo por parte del usuario " +
          ctx.usuarioActual +
          ", trato de cerrar la pantalla";
        await axios.post("/admin/registerLog", {
          message: messageText,
          solitude: null,
        });
        const response = await axios.post("/admin/closingTab", {
          //name: ctx.usuarioActual,
          nm: ctx.nmActual,
        });
        window.setTimeout(async () => {
          const actualJWT = window.localStorage.getItem("code");
          const response = await axios.post("/admin/stayingTab", {
            //name: ctx.usuarioActual,
            nm: ctx.nmActual,
            lastJWT: actualJWT,
          });
          const messageText =
            "El usuario " + ctx.usuarioActual + " se quedo en la pantalla";
          await axios.post("/admin/registerLog", {
            message: messageText,
            solitude: null,
          });
        }, 4000);
      }
    };
  }, [ctx.usuarioActual]);

  useEffect(() => {
    if (firstTimeTimerToken.current) {
      setTimeout(async () => {
        await registerNewToken();
      }, 120000);
    } else {
      firstTimeTimerToken.current = true;
      registerNewToken();
    }
  }, [ctx.timerForJwt]);

  let addNewSnackbar = (content, severity) => {
    setSnackBars((prev) => {
      return [...prev, { open: true, content: content, severity: severity }];
    });
  };

  //This is executed only the first time the component is mounted
  useEffect(() => {
    getSocket.on("close", () => {});

    getSocket.on("newRootEnvelope", (parameter) => {
      let content =
        "Acaba de ser procesada una nueva solicitud de sobre root por parte del usuario con " +
        parameter.nm +
        " para el sistema de nombre " +
        parameter.system +
        ". Hora estimada de finalización de la solicitud: " +
        parameter.expirationTime;

      let severity = "success";

      addNewSnackbar(content, severity);
    });

    getSocket.on("rootEnvelopeAboutToEnd", (parameter) => {
      let content =
        "La solicitud de sobres root activa por el operador " +
        parameter.nm +
        " sobre el sistema de nombre " +
        parameter.system +
        " esta proxima a terminar. Hora estimada de finalización de la solicitud: " +
        parameter.expirationTime;

      let severity = "warning";

      addNewSnackbar(content, severity);
    });

    getSocket.on("rootEnvelopeEnded", (parameter) => {
      debugger;
      let content =
        "La solicitud de sobres root activa por el operador " +
        parameter.nm +
        " sobre el sistema de nombre " +
        parameter.system +
        " ha finalizado";

      let severity = "error";
      setsystemIdToRedirect(parameter.systemId);
      addNewSnackbar(content, severity);
    });
  }, []);

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
              {/* {ctx && ctx.department === "Administración" && newEnvelopeRequest && <Snackbar>>} */}
              {ctx &&
                snackBars.length > 0 &&
                ctx.userAditionalInfo.department === "Administración" &&
                snackBars.map((snackbar, index) => {
                  return (
                    <Snackbar
                      anchorOrigin={{ vertical: "top", horizontal: "center" }}
                      open={snackbar.open}
                      onClose={(e) => {
                        //e.stopPropagation();
                      }}
                    >
                      {
                        <Alert
                          onClose={(e) => {
                            setSnackBars((prev) => {
                              let newSnackBarsArray = prev.filter(
                                (snackbar, ind) => ind !== index
                              );

                              return newSnackBarsArray;
                            });
                          }}
                          severity={snackbar.severity}
                        >
                          <div>{snackbar.content}</div>

                          {snackbar.severity === "error" &&
                            systemIdToRedirect && (
                              <Button
                                style={{ marginTop: "16px" }}
                                variant="contained"
                                color="secondary"
                              >
                                <Link
                                  style={{
                                    color: "white",
                                    textDecoration: "none",
                                  }}
                                  //to="/modifySystem?systemId=20"
                                  to={{
                                    pathname: `/modifySystem`,
                                    query: { systemId: systemIdToRedirect },
                                  }}

                                  //params={{ systemId: 20 }}
                                >
                                  Ir
                                </Link>
                              </Button>
                            )}
                        </Alert>
                      }
                    </Snackbar>
                  );
                })}
              {/* <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={true}
            //autoHideDuration={10000}
            onClose={(e) => {
              console.log("Hola");
            }}
          >
            {
              <Alert
                onClose={(e) => {
                  console.log("Hola");
                }}
                severity={"success"}
              >
                {"Solo una alerta de prueba"}
              </Alert>
            }
          </Snackbar> */}

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
                component={WaitingForPrint}
                //render={() => <WaitingForPrint />}
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
