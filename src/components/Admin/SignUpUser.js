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
import moment from "moment";

import {
  verifyNameLastName,
  validateEmail,
  validatePassword,
  validateNm,
} from "../../utils/helper";
import BarraNavegacion from "../BarraNavegacion";
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

export default function SignUp() {
  //Context
  const ctx = useContext(MyContext);
  const classes = useStyles();
  const history = useHistory();
  //const codigoAutorizacion = window.localStorage.getItem("code");

  const codigoAutorizacion = ctx.currentJWT;

  //Component States
  const [user, setuser] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
    nm: "",
    department: "",
  });
  const [validData, setvalidData] = useState({
    email: true,
    nm: true,
    password: false,
    message: "",
  });

  const [snackBars, setsnackBars] = useState({
    open: false,
    content: "",
    severity: "success",
  });

  //Component Functions

  //Function for displaying the SnackBar

  const displaySnackbar = (severity, content) => {
    setsnackBars({
      ...snackBars,
      open: true,
      content: content,
      severity: severity,
    });
  };

  //Function for creating a new user in the DB
  const registerUser = async ({
    name,
    lastname,
    email,
    nm,
    password,
    department,
  }) => {
    //We define the actual date
    let actualDate = moment().format("MMMM-DD-YYYY h:mm:ss");

    const payload = {
      name,
      lastname,
      email,
      password,
      nm: nm.toUpperCase(),
      department,
      codigoAcceso: null,
      caducacionCodigo: actualDate,
      code: codigoAutorizacion,
      token: "secret",
    };

    //Server Response

    let validationFields = {
      nm: validateNm(user.nm),
      email: validateEmail(user.email),
      password: validatePassword(user.password),
    };

    if (
      validationFields.email &&
      validationFields.password &&
      validationFields.nm
    ) {
      const response = await axios.post("/admin/register", payload);

      if (response.data.message === "Autorizado") {
        const messageText =
          "Nuevo usuario " +
          name +
          " " +
          lastname +
          " con nm " +
          nm +
          ", registrado con exito por parte del usuario " +
          ctx.usuarioActual +
          " con nm " +
          ctx.nmActual +
          " perteneciente al departamento de seguridad";

        //If we success creating the user we register the corresponding log on the DB
        await axios.post("/admin/registerLog", {
          message: messageText,
          solitude: null,
        });

        displaySnackbar("success", response.data.content);
      } else if (response.data.message === "Unauthorized") {
        debugger;
        setvalidData({
          ...validData,
          password: true,
          message: "Error",
        });

        let errorMessage;
        switch (response.data.content) {
          case "SequelizeUniqueConstraintError: Validation error":
            errorMessage = "El correo colocado ya se encuentra en uso";
            break;
          default:
            errorMessage = response.data.content;
        }

        displaySnackbar("error", errorMessage);
      }
    } else {
      displaySnackbar("error", "Al menos alguno de los campos no es valido");
    }
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
        <div className={classes.paper}>
          {/* <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar> */}
          <Typography component="h1" variant="h5">
            Registrar Usuario
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
                    const isValidInput = verifyNameLastName(e);
                    if (isValidInput) {
                      setuser({ ...user, name: e.target.value });
                    }
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
                    const isValidInput = verifyNameLastName(e);
                    if (isValidInput) {
                      setuser({ ...user, lastname: e.target.value });
                    }
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
                  value={user.email}
                  onBlur={(e) => {
                    setvalidData({
                      ...validData,

                      email: validateEmail(e.target.value),
                    });
                  }}
                  onChange={(e) => {
                    let input = e.target.value;
                    if (
                      (input.length === 1 && input !== "@") ||
                      input.length > 1 ||
                      input === ""
                    ) {
                      setvalidData({
                        ...validData,
                        email: validateEmail(e.target.value),
                      });
                      setuser({ ...user, email: e.target.value });
                    }
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
                  helperText={!validData.nm ? "nm invalido" : ""}
                  error={!validData.nm}
                  autoComplete="nm"
                  onBlur={(e) => {
                    setvalidData({
                      ...validData,
                      nm: validateNm(e.target.value),
                    });
                  }}
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
                    <MenuItem value={"Administración"}>Administración</MenuItem>
                    <MenuItem value={"Tecnología"}>Tecnología</MenuItem>
                    <MenuItem value={"Operaciones"}>Operaciones</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Clave"
                  type="password"
                  id="password"
                  helperText={validData.password ? validData.message : ""}
                  error={validData.password}
                  autoComplete="current-password"
                  onBlur={(e) => {
                    //debugger;
                    setvalidData({
                      ...validData,
                      password: !validatePassword(e.target.value),
                    });
                    let valid = validatePassword(e.target.value);
                  }}
                  onChange={(e) => {
                    setuser({ ...user, password: e.target.value });
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
                    registerUser(user);
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

            <Grid container justify="center"></Grid>
          </form>
        </div>
      </Container>
    </div>
  );
}
