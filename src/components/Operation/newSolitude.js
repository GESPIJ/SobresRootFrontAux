import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import MyContext from "../../context/mycontext";
import { Select, FormControl, InputLabel, MenuItem } from "@material-ui/core";
import moment from "moment";
import socket from "../../socket";

//Import methods and internal project functions
//For validating the NM
import { validateNm } from "../../utils/helper";

import BarraNavegacion from "../BarraNavegacion";

//Component Styles
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },

  formControl: {
    margin: theme.spacing(1),
    minWidth: "100%",
    margin: "0px",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  select: {
    textAlign: "left",
  },
}));

//Component
export default function SignUp() {
  //Component context state
  const ctx = useContext(MyContext);
  const history = useHistory();
  const [systems, setSystems] = useState({ systems: [], selectedSystem: "" });
  //const [solitudes, setsolitudes] = useState([]);
  const [userData, setuserData] = useState({ nm: "", motivo: "" });

  const [validData, setvalidData] = useState({
    nm: true,
  });
  const classes = useStyles();

  //Component Functions

  const fetchSolitudes = async () => {
    //Obtenemos todas las solicitudes vigentes del servidor.
    const response = await axios.post("/operation/solitudesAll", {
      nm: ctx.nmActual,
    });
    let solitudes = response.data.systems.reverse();

    //Filtramos las solicitudes por aquellas que ya finalizaron o aquellas que aun estan activas, para ello comparamos si ya pasaron 8 horas desde su creación.
    let currentDate = new Date();
    let filterSolitudes = solitudes.filter(
      (solitud) =>
        moment(currentDate).diff(moment(solitud.createdAt), "seconds") < 28800
    );

    //Guardamos las solicitudes
    // setsolitudes(filterSolitudes);

    //Retornamos las solicitudes
    return filterSolitudes;
  };
  const fetchSystems = async (solicitudes) => {
    //Recibimos como parametro las solicitudes que aun estan activas, de donde obtenemos los sistemas que no estan disponibles para nuevas solicitudes.
    let busySystems = solicitudes.map((solicitude) => solicitude.SistemaId);

    //Obtenemos el listado de todos los sistemas
    const response = await axios.get("/admin/systemsName");
    // const response = await axios.get("/admin/systemsAll");
    const allSystems = response.data.systems;
    console.log(response.data);

    // const availableSystems = allSystems.filter(
    //   (system) => !busySystems.some((busySystem) => busySystem == system.id)
    // );

    //A aquellos sistemas que no estan disponibles los deshabiilitamos, y a los que si los dejamos normal. Para ellos vamos sistema por sistema comparando si se encuentran
    // en proceso de solicitud.
    let availableSystems = allSystems.filter((system) => !system.disabled);
    console.log(availableSystems);
    availableSystems = availableSystems.filter(
      (system) => {
        let result = busySystems.some((busySystem) => busySystem === system.id);
        if (system.needPasswordChangeAdmin || system.needPasswordChangeTech) {
          result = true;
          console.log("AQUI" + system.needPasswordChangeAdmin);
        }
        system.enabled = result;
        //system.disabled = !result;

        return true;
      }

      // console.log(availableSystems);
      // return system;
    );

    //Ordenamos los sistemas, mostrando primero aquellos que estan habilitados para nuevas solicitudes
    availableSystems.sort((a, b) => (a.enabled > b.enabled ? 1 : -1));
    setSystems({ ...systems, systems: availableSystems });
  };

  const fetchSelectedSystem = async (systemId) => {
    try {
      console.log(systemId);
      const response = await axios.post("/admin/getSystemInfo", {
        id: systemId,
      });
      return response;
    } catch (e) {
      console.log(`error getReporteData ${e}`);
    }
  };

  const fetchSystemInfo = async (systemId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/detalle-no-magneticos`,
        {
          params: {
            id: systemId ?? 18,
          },
        }
      );
    } catch (e) {
      console.log(`error getReporteData ${e}`);
    }
  };

  const registerSolitude = async ({ nm, motivo }) => {
    try {
      const payload = {
        nm,
        motivo,
        usuarioOperaciones: ctx.nmActual,
        sistema: systems.selectedSystem,
      };
      // console.log(payload);
      //Server Response
      // socket.emit("newRootEnvelope", {
      //   nm: ctx.nmActual,
      //   system: systems.selectedSystem,
      //   expirationTime: moment().add(8, "hours").format("HH:mm"),
      // });

      if (validData.nm) {
        const response = await axios.post("/admin/registerSolitude", payload);

        const notificationResponse = await axios.post(
          "/admin/notifySolitudeByEmail",
          {
            nm: ctx.nmActual,
            textContent: `Se ha procesado una nueva solicitud de sobre root por parte del operador con NM ${ctx.nmActual} sobre el sistema de nombre ${systems.selectedSystem}`,
            textTitle: `Nueva solicitud de sobre root procesada sobre el sistema de nombre ${systems.selectedSystem}  `,
          }
        );

        // // If the creation of the new solitude was succesfull
        if (response.data.mensaje === "Valido") {
          // const response = await axios.post("/admin/notifySolitudeByEmail", {
          //   nm: ctx.nmActual,
          //   system: systems.selectedSystem,
          //   expirationTime: moment().add(8, "hours").format("HH:mm"),
          // });

          //socket.emit("newRootEnvelope", { nm: ctx.nmActual });

          socket.emit("newRootEnvelope", {
            nm: ctx.nmActual,
            system: systems.selectedSystem,
            expirationTime: moment().add(8, "hours").format("HH:mm"),
          });

          ctx.setcurrentSolitude({
            ...ctx.currentSolitude,
            id: response.data.id,
          });
          const messageText =
            "Nueva solicitud creada con exito para el " +
            systems.selectedSystem +
            " con id " +
            response.data.sistema +
            " por parte del usuario de operaciones " +
            ctx.usuarioActual +
            " con nm " +
            ctx.nmActual;
          //If succesfull we create the corresponding Log
          await axios.post("/admin/registerLog", {
            message: messageText,
            solitude: response.data.id,
          });

          let systemSelected = systems.systems.find(
            (sys) => sys.name === systems.selectedSystem
          );

          console.log(systemSelected);

          let systemInfo = await fetchSelectedSystem(systemSelected.id);
          systemInfo = systemInfo.data.systems[0];
          console.log(systemInfo.ip);
          const propObjects = {
            date: new Date().toDateString(),
            //name: response.data.systemName,
            name: systems.selectedSystem,
            admin: systemInfo.admin,
            ip: systemInfo.ip,
            port: systemInfo.port,
            password: systemInfo.password,
            operator: ctx.usuarioActual,
          };
          console.log(propObjects);

          history.replace({ pathname: "/pageToPDF", state: propObjects });
        } else console.log(response.data.mensaje);
      }
    } catch (e) {
      console.log(e);
    }
  };

  //We fetch all the current solitudes
  useEffect(() => {
    let functionAsync = async () => {
      let currentSolitudes = await fetchSolitudes();
      fetchSystems(currentSolitudes);
    };

    functionAsync();

    return () => {};
  }, []);

  return (
    <div className="signup">
      <BarraNavegacion />

      <Container
        className="loginContainerSignUp"
        component="main"
        maxWidth="xs"
      >
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Nueva solicitud
          </Typography>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl className={classes.formControl} variant="outlined">
                  <InputLabel id="demo-simple-select-outlined-label">
                    Sistema
                  </InputLabel>
                  <Select
                    classes={{
                      select: classes.select,
                    }}
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={systems.selectedSystem}
                    onChange={(e) => {
                      setSystems({
                        ...systems,
                        selectedSystem: e.target.value,
                      });
                    }}
                    label="Sistema"
                  >
                    {systems.systems.map((system) => {
                      return (
                        <MenuItem disabled={system.enabled} value={system.name}>
                          {system.name}
                        </MenuItem>
                      );
                    })}
                    {/* <MenuItem value={"Operaciones"}>Operaciones</MenuItem>
                    <MenuItem value={"Administración"}>Administración</MenuItem> */}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  autoComplete="nm"
                  name="nm"
                  variant="outlined"
                  required
                  fullWidth
                  id="nm"
                  label="NM"
                  error={!validData.nm}
                  helperText={
                    !validData.nm ? "El nm introducido no es válido" : ""
                  }
                  onBlur={() => {
                    setvalidData((prev) => ({
                      ...prev,
                      nm: validateNm(userData.nm),
                    }));
                  }}
                  autoFocus
                  onChange={(e) => {
                    setuserData({ ...userData, nm: e.target.value });
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  multiline
                  rows={4}
                  variant="outlined"
                  required
                  fullWidth
                  id="motivo"
                  label="Motivo"
                  name="motivo"
                  autoComplete="motivo"
                  onChange={(e) => {
                    setuserData({ ...userData, motivo: e.target.value });
                  }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    e.preventDefault();
                    registerSolitude(userData);
                  }}
                  className={classes.submit}
                >
                  Procesar
                </Button>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    e.preventDefault();
                    history.replace(ctx.previousPage);
                  }}
                  className={classes.submit}
                >
                  Regresar
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={5}>{/* <Copyright /> */}</Box>
      </Container>
    </div>
  );
}
