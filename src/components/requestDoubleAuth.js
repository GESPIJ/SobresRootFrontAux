import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
//import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { AppBar, Toolbar, IconButton } from "@material-ui/core";
import MyContext from "../context/mycontext";
import Boton from "../boton";
import MenuIcon from "@material-ui/icons/Menu";
import moment from "moment";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

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
  disabled: {
    margin: theme.spacing(3, 0, 2),
    pointerEvents: "none",
    opacity: 0.5,
  },
}));

export default function SignUp() {
  const ctx = useContext(MyContext);
  const history = useHistory();

  //const [nm, setnm] = useState("");
  const [accessCode, setaccessCode] = useState("");
  const [validCode, setvalidCode] = useState({
    state: false,
    message: "",
    disabled: false,
  });
  const classes = useStyles();

  const solicitarCodigo = async () => {
    const payload = {
      nm: ctx.nmActual,
    };
    //debugger;
    const response = await axios.post("/admin/solitudeCode", payload);
    console.log(response);
  };

  const disableTemporarlyRequestButton = () => {
    setvalidCode({ ...validCode, disabled: true });
    setTimeout(() => {
      setvalidCode({ ...validCode, disabled: false });
    }, 30000);
  };
  const signIn = async (nm) => {
    console.log("Enviando codigo al servidor");
    const payload = {
      nm: ctx.nmActual,
      codigoAcceso: accessCode,
    };

    const response = await axios.post("/admin/validateCode", payload);
    console.log(response);
    //debugger;
    let currentDate = new Date();
    currentDate = moment(currentDate);

    let isOlder = currentDate.isAfter(response.data.tiempoCaducacion);
    if (response.data.message == "succesfully") {
      let redirectPath =
        response.data.department === "Administración"
          ? "HomeAdmin"
          : "Home Operations";
      history.replace(redirectPath);
      //   ctx.setusuarioActual(response.data.name);
      //   history.push("/signIn");
    } else {
      setvalidCode({
        ...validCode,
        state: true,
        message: response.data.message,
      });
    }
  };
  const validateNm = (nm) => {
    let re = /nm[0-9]{6}/;
    return re.test(String(nm).toLowerCase());
  };

  return (
    <div className="signup">
      <div className="navBar">
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Banco
            </Typography>
            {/* <Button color="inherit">Login</Button> */}
          </Toolbar>
        </AppBar>
      </div>

      {/* <Boton /> */}
      <img className="logoBancoVenezuela" src="/BancoVenezuela2.png" alt="" />

      <Container
        className="loginContainerSignUp"
        component="main"
        maxWidth="xs"
      >
        <CssBaseline />
        <div className={classes.paper}>
          {/* <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar> */}
          <Typography component="h1" variant="h5">
            Por favor introduzca el codigo de acceso
          </Typography>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField
                  error={validCode.state}
                  helperText={validCode.message}
                  autoComplete="Codigo de acceso"
                  name="Codigo de acceso"
                  variant="outlined"
                  required
                  fullWidth
                  id="NM"
                  label="Codigo de acceso"
                  autoFocus
                  value={accessCode}
                  onChange={(e) => {
                    setaccessCode(e.target.value);
                  }}
                />
              </Grid>

              {/* <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid> */}
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={(e) => {
                e.preventDefault();
                //console.log("Este es el usuario");
                //console.log(user);
                //registerUser(user);
                disableTemporarlyRequestButton();
                solicitarCodigo();
              }}
              className={validCode.disabled ? classes.disabled : classes.submit}
            >
              Solicitar codigo
            </Button>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={(e) => {
                e.preventDefault();
                //console.log("Este es el usuario");
                //console.log(user);
                //registerUser(user);
                signIn();
              }}
              className={classes.submit}
            >
              Iniciar sesion
            </Button>
          </form>
        </div>
        <Box mt={5}>{/* <Copyright /> */}</Box>
      </Container>
    </div>
  );
}
