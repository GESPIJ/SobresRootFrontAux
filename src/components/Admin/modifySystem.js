import React, { useState, useContext } from "react";
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
  const [system, setsystem] = useState(props.location.state.system);
  const [visiblePassword, setvisiblePassword] = useState("");
  const [validData, setvalidData] = useState({
    email: true,
    nm: true,
    password: false,
  });

  const [snackBars, setsnackBars] = useState({
    open: false,
    content: "",
    severity: "success",
  });

  const toggleVisibility = () => {
    console.log("Click en toggle visibility");
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
  const modifySystem = async ({ id, name, ip, port, password, admin }) => {
    const payload = {
      id,
      name,
      ip,
      port,
      password,
      admin,
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

  return (
    <div className="signup">
      <BarraNavegacion />

      {/* <Boton /> */}

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
                history.replace("/usersTable");
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
                  label="Clave actual"
                  type={visiblePassword ? "text" : "password"}
                  name="password"
                  value={system.password}
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
                  onBlur={(e) => {
                    setvalidData({
                      ...validData,
                      nm: validateNm(e.target.value),
                    });
                  }}
                  onChange={(e) => {
                    setsystem({ ...system, currentPassword: e.target.value });
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
                    history.replace(ctx.previousPage);
                  }}
                  className={classes.submit}
                >
                  Cancelar
                </Button>
              </Grid>
            </Grid>

            <Grid container justify="center"></Grid>
          </form>
        </div>
      </Container>
    </div>
  );
}
