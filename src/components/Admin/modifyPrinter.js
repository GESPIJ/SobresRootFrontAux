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
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },

  formControl: {
    //margin: theme.spacing(1),
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
  //Component States
  const history = useHistory();
  const [printer, setprinter] = useState(props.location.state.system);

  //Component Functions

  //Function for updating the value of an existing printer
  const modifyPrinter = async ({ id, name, ip, port, state }) => {
    const payload = {
      id,
      name,
      ip,
      port,
      state,
    };

    //Server Response
    const response = await axios.post("/admin/updatePrinterInfo", payload);
    if (response.data.message === "succesfully") {
      history.push("/printersTable");
    }
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
          <Typography component="h1" variant="h5">
            Modificar Impresora
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
                  value={printer.name}
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
                    setprinter({ ...printer, ip: e.target.value });
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
                  value={printer.port}
                  onChange={(e) => {
                    setprinter({ ...printer, port: e.target.value });
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
                    modifyPrinter(printer);
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
