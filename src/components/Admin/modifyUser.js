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
  Snackbar,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import BarraNavegacion from "../BarraNavegacion";
import MyContext from "../../context/mycontext";
//Component Constants
const SUCCESFULLY = "Succesfully";
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
}));

export default function SignUp(props) {
  //Context State
  const ctx = useContext(MyContext);
  const classes = useStyles();
  const history = useHistory();

  //Component States
  const [user, setuser] = useState({
    ...props.location.state.user,
    newPassword: "",
  });
  const [validData, setvalidData] = useState({
    email: true,
    nm: true,
    password: false,
  });

  const [snackBars, setsnackBars] = useState({
    open: false,
    severity: "success",
    content: "",
  });

  //Component Functions

  //Function for displaying SnackBar wether success or error
  const displaySnackbar = (severity, content) => {
    setsnackBars({
      ...snackBars,
      open: true,
      severity: severity,
      content: content,
    });
  };

  //Function for updating the values of an existing user
  const modifyUser = async ({
    id,
    name,
    lastname,
    mail,
    nm,
    newPassword,
    department,
  }) => {
    const payload = {
      id,
      name,
      lastname,
      mail,
      newPassword,
      nm,
      department,
    };

    //Server Response
    const response = await axios.post("/admin/updateUserInfo", payload);

    if (response.data.message === SUCCESFULLY) {
      displaySnackbar(Severity_Success, "Usuario modificado con Ã©xito");
    } else {
      displaySnackbar(Severity_Error, "Error modificando el usuario");
    }
  };

  //Function for validating email constraints
  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  //Function for validating nm
  const validateNm = (nm) => {
    let re = /nm[0-9]{6}/;
    return re.test(String(nm).toLowerCase());
  };

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
          <Snackbar
            open={snackBars.open}
            autoHideDuration={3000}
            onClose={(e) => {
              if (snackBars.severity === "success") {
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
            Modificar Usuario
          </Typography>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  name="firstName"
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="Nombre"
                  autoFocus
                  value={user.name}
                  onChange={(e) => {
                    setuser({ ...user, name: e.target.value });
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="lastName"
                  label="Apellidos"
                  name="lastName"
                  autoComplete="lname"
                  value={user.lastname}
                  onChange={(e) => {
                    setuser({ ...user, lastname: e.target.value });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label={
                    validData.email
                      ? "Correo electronico"
                      : "Error en el correo electronico"
                  }
                  name="email"
                  autoComplete="email"
                  error={!validData.email}
                  helperText={!validData.email ? "El correo no es valido" : ""}
                  onBlur={(e) => {
                    setvalidData({
                      ...validData,

                      email: validateEmail(e.target.value),
                    });
                  }}
                  value={user.mail}
                  onChange={(e) => {
                    setvalidData({
                      ...validData,
                      email: validateEmail(e.target.value),
                    });
                    setuser({ ...user, mail: e.target.value });
                  }}
                />
                {/* {!validData.email && (
                  <p style={{ textAlign: "left" }}>Invalid email</p>
                )} */}
              </Grid>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="nm"
                  //label={!validData.nm ? "NM invalido" : "NM"}
                  label={"NM"}
                  name="nm"
                  //helperText={!validData.nm ? "El nm es incorrecto" : ""}
                  //error={!validData.nm}
                  autoComplete="nm"
                  onBlur={(e) => {
                    setvalidData({
                      ...validData,
                      nm: validateNm(e.target.value),
                    });
                  }}
                  value={user.nm}
                  onChange={(e) => {
                    setuser({ ...user, nm: e.target.value });
                    setvalidData({
                      ...validData,
                      nm: validateNm(e.target.value),
                    });
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl className={classes.formControl} variant="outlined">
                  <InputLabel id="demo-simple-select-outlined-label">
                    Departamento
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={user.department}
                    onChange={(e) => {
                      setuser({ ...user, department: e.target.value });
                    }}
                    label="Departamento"
                  >
                    <MenuItem value={"Operaciones"}>Operaciones</MenuItem>
                    <MenuItem value={"AdministraciÃ³n"}>
                      AdministraciÃ³n
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Nueva clave"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={user.newPassword}
                  onChange={(e) => {
                    setuser({ ...user, newPassword: e.target.value });
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
                    modifyUser(user);
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
