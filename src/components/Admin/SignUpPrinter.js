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
import { verifyIp, verifyPort } from "../../utils/helper";
import BarraNavegacion from "../BarraNavegacion";
import MyContext from "../../context/mycontext";
//Constant
const AUTHORIZED = "Autorizado";

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
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp() {
  const classes = useStyles();

  //Component States
  const ctx = useContext(MyContext);
  const history = useHistory();
  const [printer, setprinter] = useState({
    name: "",
    ip: "180.183",
    port: "",
  });

  //Functions

  //Function for registering a new printer
  const registerPrinter = async ({ name, ip, port }) => {
    const payload = {
      name,
      ip,
      port,
    };

    //Server Response
    const response = await axios.post("/admin/registerPrinter", payload);

    if (response.data.usuario === AUTHORIZED) {
      const messageText =
        "Nuevo impresora " +
        name +
        " con ip " +
        ip +
        ", registrado con exito por parte del usuario " +
        ctx.usuarioActual +
        " con nm " +
        ctx.nmActual +
        " perteneciente al departamento de seguridad";

      //If succesfull we register the log on the DB
      await axios.post("/admin/registerLog", {
        message: messageText,
        solitude: null,
      });
      history.replace("/HomeOperations");
    }
  };

  //Component JSX
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
          <Typography component="h1" variant="h5">
            Registrar impresora
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
                    setprinter({ ...printer, name: e.target.value });
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
                  value={printer.ip}
                  onChange={(e) => {
                    const isValidInput = verifyIp(e);
                    if (isValidInput) {
                      setprinter({ ...printer, ip: e.target.value });
                    }
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
                  //   onBlur={(e) => {
                  //     setvalidData({
                  //       ...system,
                  //       email: validateEmail(e.target.value),
                  //     });
                  //   }}
                  value={printer.port}
                  onChange={(e) => {
                    const isValidInput = verifyPort(e);
                    if (isValidInput) {
                      setprinter({ ...printer, port: e.target.value });
                    }
                  }}
                />
                {/* {!validData.email}
                <p style={{ textAlign: "left" }}>Invalid email</p> */}
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
                    registerPrinter(printer);
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
