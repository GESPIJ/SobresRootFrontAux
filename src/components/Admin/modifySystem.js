import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import {
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  InputAdornment,
  Snackbar,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import VisibilityIcon from "@material-ui/icons/Visibility";
import BarraNavegacion from "../BarraNavegacion";
import MyContext from "../../context/mycontext";
import { Backdrop, CircularProgress } from "@material-ui/core";

//Component Constants
const SUCCESFULL = "succesfully";
const Severity_Success = "success";
const Severity_Error = "error";

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
    minWidth: 190,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  visibilityIcon: {
    cursor: "pointer",
    marginRight: "16px",
    position: "absolute",
    right: "8px",
  },
}));

export default function SignUp(props) {
  //Context

  const ctx = useContext(MyContext);
  const classes = useStyles();
  const history = useHistory();

  //Component States
  const [system, setsystem] = useState(
    props.location && props.location.state && props.location.state.system
      ? props.location.state.system
      : null
  );

  const [systemId, setsystemId] = useState(
    props.location && props.location.query && props.location.query.systemId
      ? props.location.query.systemId
      : props.location && props.location.state && props.location.state.system
      ? props.location.state.system.id
      : 0
  );
  const [loading, setloading] = useState(
    props.location && props.location.state && props.location.state.system
      ? false
      : true
  );
  const [visiblePassword, setvisiblePassword] = useState("");
  const [validData, setvalidData] = useState({
    email: true,
    nm: true,
    password: false,
  });

  const [newCode, setnewCode] = useState("");
  const [snackBars, setsnackBars] = useState({
    open: false,
    content: "",
    severity: "success",
  });

  const toggleVisibility = () => {
    setvisiblePassword(!visiblePassword);
  };

  //Component Functions

  //Function for displaying SnackBar, wether success or error
  const displaySnackbar = (severity, content) => {
    setsnackBars({
      ...snackBars,
      open: true,
      content: content,
      severity: severity,
    });
  };

  //Function for updating the values of an existing system
  const modifySystem = async ({
    id,
    name,
    ip,
    port,
    password,
    admin,
    componente1,
    componente2,
  }) => {
    const payload = {
      id,
      name,
      ip,
      port,
      password,
      admin,
      componente1,
      componente2,
    };

    //Server Response
    const response = await axios.post("/admin/updateSystemInfo", payload);
    if (response.data.message === SUCCESFULL) {
      displaySnackbar(Severity_Success, "Sistema actualizado con éxito");
    } else {
      displaySnackbar(Severity_Error, "Error al actualizar el sistema");
    }
  };

  //Function for validate the nm placed
  const validateNm = (nm) => {
    let re = /nm[0-9]{6}/;
    return re.test(String(nm).toLowerCase());
  };

  const generateNewCode = async () => {
    let response = await axios.post("/admin/generateNewComponentCode");
    setnewCode(response.data.code);
  };

  useEffect(() => {
    if (!system) {
      //We fetch the system in
      let fetchData = async () => {
        let response = await axios.post("/admin/getIndividualSystem", {
          id: systemId,
        });

        if (response.data.message === "succesfull") {
          setloading(false);
          setsystem(response.data.system);
        }
      };

      fetchData();
    }
  }, []);

  return (
    <div className="signup">
      <BarraNavegacion />

      {/* <Boton /> */}

      <Backdrop open={loading}>
        <CircularProgress />
      </Backdrop>

      {system && (
        <Container
          className="loginContainerSignUp"
          component="main"
          maxWidth="xs"
        >
          <CssBaseline />
          <div className={classes.paper}>
            <Snackbar
              open={snackBars.open}
              autoHideDuration={3000}
              onClose={(e) => {
                if (snackBars.severity === Severity_Success) {
                  history.replace("/systemsTable");
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
            <Typography component="h1" variant="h5">
              Modificar Sistema
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
                    value={system.name}
                    onChange={(e) => {
                      setsystem({ ...system, name: e.target.value });
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={8}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="ip"
                    label="Ip"
                    name="ip"
                    autoComplete="lname"
                    value={system.ip}
                    onChange={(e) => {
                      setsystem({ ...system, ip: e.target.value });
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="port"
                    label="Puerto"
                    name="port"
                    autoComplete="email"
                    value={system.port}
                    onChange={(e) => {
                      setsystem({ ...system, port: e.target.value });
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <FormControl
                    className={classes.formControl}
                    variant="outlined"
                  >
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
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="admin"
                    label="Administrador"
                    type="admin"
                    id="admin"
                    autoComplete="admin"
                    value={system.admin}
                    onChange={(e) => {
                      setsystem({ ...system, admin: e.target.value });
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="password"
                    label="Componente"
                    type={visiblePassword ? "text" : "password"}
                    name="password"
                    value={
                      ctx.userAditionalInfo.department == "Administración"
                        ? system.componente1
                        : system.componente2
                    }
                    autoComplete="nm"
                    InputProps={{
                      readOnly:
                        (!system.needPasswordChangeAdmin &&
                          ctx.userAditionalInfo.department ==
                            "Administración") ||
                        (!system.needPasswordChangeTech &&
                          ctx.userAditionalInfo.department == "Tecnología"),
                      startAdornment: (
                        <InputAdornment
                          className={classes.visibilityIcon}
                          onClick={toggleVisibility}
                        >
                          <VisibilityIcon />
                        </InputAdornment>
                      ),
                    }}
                    onBlur={(e) => {
                      setvalidData({
                        ...validData,
                        nm: validateNm(e.target.value),
                      });
                    }}
                    onChange={(e) => {
                      if (
                        ctx.userAditionalInfo.department == "Administración"
                      ) {
                        setsystem({ ...system, componente1: e.target.value });
                      } else {
                        setsystem({ ...system, componente2: e.target.value });
                      }
                    }}
                  />
                </Grid>
              </Grid>

              {((system.needPasswordChangeAdmin &&
                ctx.userAditionalInfo.department == "Administración") ||
                (system.needPasswordChangeTech &&
                  ctx.userAditionalInfo.department == "Tecnología")) && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={async (e) => {
                        e.preventDefault();
                        //await axios.post("/admin/generateNewComponent", {id: 7} )
                        generateNewCode();
                      }}
                      className={classes.submit}
                    >
                      Generar codigo
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} style={{ alignSelf: "center" }}>
                    <TextField
                      variant="outlined"
                      required
                      name="nuevoComponente"
                      label="codigo"
                      type="text"
                      id="admin"
                      value={newCode}
                      onChange={(e) => {
                        // setsystem({ ...system, admin: e.target.value });
                      }}
                    />
                  </Grid>
                </Grid>
              )}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={(e) => {
                      e.preventDefault();
                      modifySystem(system);
                    }}
                    className={classes.submit}
                  >
                    Modificar
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
                      if (ctx.previousPage) {
                        history.replace(ctx.previousPage);
                      } else {
                        history.replace("/systemsTable");
                      }
                    }}
                    className={classes.submit}
                  >
                    Cancelar
                  </Button>
                </Grid>
              </Grid>

              {/* <Grid item xs={12} sm={12}> */}

              {/* </Grid> */}

              <Grid container justify="center"></Grid>
            </form>
          </div>
        </Container>
      )}
    </div>
  );
}
