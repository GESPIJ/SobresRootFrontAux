import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
//import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import {
  FormControl,
  InputAdornment,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import VisibilityIcon from "@material-ui/icons/Visibility";

import BarraNavegacion from "../BarraNavegacion";
import ComboBox from "../ComboBox";

//Utils Functions
import { verifyIp, verifyPort, checkIfAdminExists } from "../../utils/helper";

//Context
import MyContext from "../../context/mycontext";

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
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },

  formControl: {
    //margin: theme.spacing(1),
    minWidth: 200,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },

  visibilityIcon: {
    cursor: "pointer",
    marginRight: "16px",
    position: "absolute",
    right: "8px",
  },
}));

export default function SignUp() {
  const history = useHistory();
  const ctx = useContext(MyContext);

  //Component States
  const [system, setsystem] = useState({
    name: "",
    ip: "180.183.",
    port: "",
    currentPassword: "",
    admin: "",
    ambiente: "",
    custodio1: { name: "", id: "" },
    custodio2: { name: "", id: "" },
    componente1: "",
    componente2: "",
    showComponente1: false,
    showComponente2: false,
  });
  const [validData, setvalidData] = useState({
    ip: true,
    admin: true,
  });
  const [visiblePassword, setvisiblePassword] = useState(false);

  const [snackBars, setsnackBars] = useState({
    open: false,
    content: "",
    severity: "success",
  });

  const [custodioSeguridad, setCustodiosSeguridad] = useState({
    custodios: [],
    selectedCustodio: null,
  });
  const [custodioTecnología, setCustodiosTecnologia] = useState({
    custodios: [],
    selectedCustodio: null,
  });

  const classes = useStyles();

  useEffect(() => {
    getSecurityCustodies();
    getTecnologieCustodies();
  }, []);

  //Component Functions

  const getSecurityCustodies = async () => {
    let custodios = await axios.get("http://localhost:4000/admin/adminUsers");
    setCustodiosSeguridad({ custodios: custodios.data.users });
  };

  const getTecnologieCustodies = async () => {
    let custodios = await axios.get(
      "http://localhost:4000/admin/technologieUsers"
    );
    setCustodiosTecnologia({ custodios: custodios.data.users });
  };

  //Function for displaying the Snackbar wether success or error
  const displaySnackbar = (severity, content) => {
    setsnackBars({
      open: true,
      content: content,
      severity: severity,
    });
  };

  //Fow toggling the visibility in the password input of the form
  const toggleVisibility = () => {
    setvisiblePassword(!visiblePassword);
  };

  //For creating a new system on the DB
  const registerSystem = async ({
    name,
    ip,
    port,
    admin,
    currentPassword,
    custodio1,
    custodio2,
    componente1,
    componente2,
  }) => {
    const payload = {
      name,
      ip,
      port,
      password: currentPassword,
      admin,
      custodio1,
      componente1,
      custodio2,
      componente2,
    };

    debugger;

    //Server Response
    if (port !== "" && ip !== "" && validData.ip) {
      const response = await axios.post("/admin/registerSystem", payload);

      if (response.data.message === "Autorizado") {
        const messageText =
          "Nuevo sistema " +
          name +
          " con ip " +
          ip +
          " y administrador " +
          admin +
          ", registrado con exito por parte del usuario " +
          ctx.usuarioActual +
          " con nm " +
          ctx.nmActual +
          " perteneciente al departamento de seguridad";

        //If Succesfull we register the corresponding Log
        await axios.post("/admin/registerLog", {
          message: messageText,
          solitude: null,
        });
        displaySnackbar("success", response.data.content);
      } else if (response.data.message === "Unauthorized") {
        const messageText =
          "Error al crear sistema nuevo" +
          name +
          " con ip " +
          "perteneciente al departamento de seguridad";

        //We register the log if we fail creating the new system
        await axios.post("/admin/registerLog", {
          message: messageText,
          solitude: null,
        });
        displaySnackbar("error", response.data.content);
      }
    } else {
      displaySnackbar(
        "error",
        "Al menos uno de los parametros no es valido o se encuentra vacío"
      );
    }
  };

  return (
    <div className="signup">
      <BarraNavegacion />

      <Snackbar
        open={snackBars.open}
        autoHideDuration={3000}
        onClose={(e) => {
          if (snackBars.severity === "success") {
            history.replace("/HomeOperations");
          }
          setsnackBars({ ...snackBars, open: false });
        }}
      >
        {
          <Alert
            onClose={(e) => {
              setsnackBars({ ...snackBars, open: false });
            }}
            severity={snackBars.severity}
          >
            {snackBars.content}
          </Alert>
        }
      </Snackbar>

      <Container
        className="loginContainerSignUp"
        component="main"
        maxWidth="xs"
      >
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Registrar Sistema
          </Typography>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="fname"
                  name="name"
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="Nombre"
                  autoFocus
                  onChange={(e) => {
                    setsystem({ ...system, name: e.target.value });
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  //type="number"
                  value={system.ip}
                  variant="outlined"
                  required
                  fullWidth
                  id="ip"
                  label="Ip"
                  name="ip"
                  error={!validData.ip}
                  helperText={!validData.ip ? "Error en ip" : ""}
                  autoComplete="lname"
                  onBlur={(e) => {
                    let numberOfDots = system.ip.split(".");

                    setvalidData({
                      ...validData,
                      ip: numberOfDots.length === 4 && numberOfDots[3] !== "",
                    });
                  }}
                  onChange={(e) => {
                    const isValidInput = verifyIp(e);
                    if (isValidInput) {
                      setsystem({ ...system, ip: e.target.value });
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  //type="number"
                  value={system.port}
                  variant="outlined"
                  required
                  fullWidth
                  id="port"
                  label="Puerto"
                  name="port"
                  autoComplete="email"
                  onBlur={(e) => {
                    setvalidData({
                      ...validData,
                      port: verifyPort(e),
                    });
                  }}
                  onChange={(e) => {
                    const isValidInput = verifyPort(e);
                    if (isValidInput) {
                      setsystem({ ...system, port: e.target.value });
                    }
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <FormControl className={classes.formControl} variant="outlined">
                  <InputLabel id="demo-simple-select-outlined-label">
                    Ambiente
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={system.ambiente}
                    onChange={(e) => {
                      setsystem({ ...system, ambiente: e.target.value });
                    }}
                    label="Ambiente"
                  >
                    <MenuItem value={"Plataforma Media"}>
                      Plataforma Media
                    </MenuItem>
                    <MenuItem value={"MainFrame"}>MainFrame</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <ComboBox
                  fullWidth
                  label={"Administradores"}
                  admin={system.admin}
                  setadmin={setsystem}
                  system={system}
                />
              </Grid>

              <Grid item xs={6}>
                <FormControl className={classes.formControl} variant="outlined">
                  <InputLabel id="demo-simple-select-outlined-label">
                    Custodio 1
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={system.custodio1}
                    onChange={(e) => {
                      setsystem((prev) => ({
                        ...prev,
                        custodio1: e.target.value,
                      }));
                    }}
                    label="Custodio Seguridad"
                  >
                    {custodioSeguridad.custodios.map((custodio) => {
                      return (
                        <MenuItem value={custodio.id}>
                          {custodio.name + " " + custodio.lastname}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="componente1"
                  label="Componente 1"
                  type={system.showComponente1 ? "text" : "password"}
                  name="password"
                  autoComplete="nm"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        className={classes.visibilityIcon}
                        onClick={() => {
                          setsystem({
                            ...system,
                            showComponente1: !system.showComponente1,
                          });
                        }}
                      >
                        <VisibilityIcon />
                      </InputAdornment>
                    ),
                  }}
                  onChange={(e) => {
                    setsystem({ ...system, componente1: e.target.value });
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl className={classes.formControl} variant="outlined">
                  <InputLabel id="demo-simple-select-outlined-label">
                    Custodio 2
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={system.custodio2}
                    onChange={(e) => {
                      setsystem((prev) => ({
                        ...prev,
                        custodio2: e.target.value,
                      }));
                    }}
                    label="Custodio Tecnología"
                  >
                    {custodioTecnología.custodios.map((custodio) => {
                      return (
                        <MenuItem value={custodio.id}>
                          {custodio.name + " " + custodio.lastname}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                {/* <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="custodio2"
                  label="Custodio Tecnología"
                  type={visiblePassword ? "text" : "password"}
                  name="password"
                  autoComplete="nm"
                  onChange={(e) => {
                    setsystem({ ...system, currentPassword: e.target.value });
                  }}
                /> */}
              </Grid>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="componente2"
                  label="Componente2"
                  type={system.showComponente2 ? "text" : "password"}
                  name="password"
                  autoComplete="nm"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        className={classes.visibilityIcon}
                        onClick={() => {
                          setsystem({
                            ...system,
                            showComponente2: !system.showComponente2,
                          });
                        }}
                      >
                        <VisibilityIcon />
                      </InputAdornment>
                    ),
                  }}
                  onChange={(e) => {
                    setsystem({ ...system, componente2: e.target.value });
                  }}
                />
              </Grid>
              {/* <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="password"
                  label="Clave actual"
                  type={visiblePassword ? "text" : "password"}
                  name="password"
                  autoComplete="nm"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        className={classes.visibilityIcon}
                        onClick={toggleVisibility}
                      >
                        <VisibilityIcon />
                      </InputAdornment>
                    ),
                  }}
                  onChange={(e) => {
                    setsystem({ ...system, currentPassword: e.target.value });
                  }}
                />
              </Grid> */}
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
                    registerSystem(system);
                  }}
                  className={classes.submit}
                >
                  Registrar
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
                  Cancelar
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </div>
  );
}
