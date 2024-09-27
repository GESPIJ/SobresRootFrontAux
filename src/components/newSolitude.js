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
import MyContext from "../context/mycontext";
import {
  AppBar,
  Toolbar,
  IconButton,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from "@material-ui/core";
import Boton from "../boton";
import MenuIcon from "@material-ui/icons/Menu";
import moment from "moment";

import socket from "../socket"

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

export default function SignUp() {
  const ctx = useContext(MyContext);
  const history = useHistory();
  const [systems, setSystems] = useState({ systems: [], selectedSystem: "" });
  const [solitudes, setsolitudes] = useState([]);
  const [userData, setuserData] = useState({ nm: "", motivo: "" });

  const [validData, setvalidData] = useState({
    email: true,
    nm: false,
    password: false,
  });
  const classes = useStyles();

  const validateNm = (nm) => {
    let re = /nm[0-9]{6}/;
    return re.test(String(nm).toLowerCase());
  };

  const fetchSolitudes = async () => {
    const response = await axios.get("http://localhost:5000/solitudesAll");
    let solitudes = response.data.systems.reverse();
    //console.log(response);
    //debugger;
    let currentDate = new Date();
    let filterSolitudes = solitudes.filter(
      (solitud) =>
        moment(currentDate).diff(moment(solitud.createdAt), "seconds") < 28800
    );
    //debugger;
    setsolitudes(filterSolitudes);

    return filterSolitudes;
    //setSystems({ ...systems, systems: response.data.systems.reverse() });
  };
  const fetchSystems = async (solitudes) => {

    const response = await axios.get("http://localhost:5000/systemsName");
    let allSystems = response.data.systems;
    let availableSystems = allSystems.filter (system=>)
     setSystems({ ...systems, systems: response.data.systems });
  };

  const registerSolitude = async ({ nm, motivo }) => {

    const payload = {
      nm,
      motivo,
      usuarioOperaciones: ctx.usuarioActual,
      sistema: systems.selectedSystem,
    };

    const response = await axios.post(
      "http://localhost:5000/admin/registerSolitude",
      payload
    );

    // const response = await axios.post(
    //   "http://localhost:5000/sendEmail",
    //   payload
    // );
    if (response.data.mensaje === "Valido") {
      //history.push("/selectPrinter");
     
      const propObjects = {
        date: new Date().toDateString(),
          name: systems.selectedSystem,
          admin: "Oswaldo",
          ip: "180.183.98.17",
          port: "80",
          password: "123456",
          operator: ctx.usuarioActual,
      }
     // debugger;
      history.push({pathname:"/pageToPDF", state:propObjects,})
    }
  };

  useEffect(async () => {
    let currentSolitudes = await fetchSolitudes();
    fetchSystems(currentSolitudes);

    return () => {};
  }, []);

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
            <Button color="inherit"></Button>
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
            Nueva solicitud
          </Typography>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {/* <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="department"
                  label="Department"
                  name="department"
                  autoComplete="department"
                  value={user.department}
                  onChange={(e) => {
                    setuser({ ...user, department: e.target.value });
                  }}
                /> */}
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
                        <MenuItem value={system.name}>{system.name}</MenuItem>
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
                registerSolitude(userData);
              }}
              className={classes.submit}
            >
              Procesar solicitud
            </Button>
            {/* <Grid container justify="center">
              <Grid item>
                <Link
                  href="#"
                  variant="body2"
                  onClick={(e) => {
                    try {
                      history.push("/signIn");
                    } catch (e) {
                      console.log(e);
                    }
                  }}
                >
                  Procesar Solicitud
                </Link>
              </Grid>
            </Grid> */}
          </form>
        </div>
        <Box mt={5}>{/* <Copyright /> */}</Box>
      </Container>
    </div>
  );
}
