import React, { useState, useContext } from "react";
import InputMask from "react-input-mask";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

//Internal modules and components
import MyContext from "../context/mycontext";
import BarraNavegacion from "./BarraNavegacion";

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

export default function SignUp(props) {
  //Context
  const ctx = useContext(MyContext);

  //For navigating between pages
  const history = useHistory();

  //Component States
  const [nm, setnm] = useState("");
  const [validateInfo, setvalidateInfo] = useState(
    props.location && props.location.state && ctx.usuarioActual !== ""
      ? props.location.state.validateInfo
      : { password: false }
  );
  const [helperText, sethelperText] = useState(
    props.location && props.location.state && ctx.usuarioActual !== ""
      ? props.location.state.helperTextBlockedUser
      : ""
  );

  const classes = useStyles();

  //Component Functions

  //Function for handle the user sign in
  const signIn = async (nm) => {
    //User info
    const payload = {
      //nm: nm != 0 ? "NM" + nm : "0",
      nm: nm.toUpperCase(),
    };
    //Server Response
    const response = await axios.post("/admin/", payload);

    //We check if the nm placed is valid and that the user is not currently blocked
    if (
      response.data.message === "Approved" &&
      response.data.data.status !== "blocked"
    ) {
      //We save the user info on the component context state, including the number of failed attempts the user currently has
      ctx.setusuarioActual(response.data.data.name);
      ctx.setnmActual(response.data.data.nm);
      ctx.setFailedAttemps(response.data.data.failedAttemps);
      ctx.setUserStatus(response.data.data.status);
      setvalidateInfo({ ...validateInfo, password: false });
      history.replace("/signIn");
      // history.replace("signInLDAP");

      //If the nm is not valid or it's not registered yet in the system we display a message
    } else if (response.data.message !== "Approved") {
      setvalidateInfo({ ...validateInfo, password: true });
      sethelperText("El nm no es valido");

      //If the user is blocked we display the corresponding message
    } else if (response.data.data.status === "blocked") {
      sethelperText(
        "Su usuario se encuentra bloqueado, por favor hable con administración para desbloquearlo"
      );
      setvalidateInfo({ ...validateInfo, password: true });
    }
  };

  //JSX Component
  return (
    <div className="signup">
      <BarraNavegacion />

      {/* <img className="logoBancoVenezuela" src="/BancoVenezuela2.png" alt="" /> */}

      <Container
        className="loginContainerSignUp"
        component="main"
        maxWidth="xs"
      >
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Identificarse
          </Typography>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <InputMask
                  mask="aa999999"
                  maskChar={null}
                  error={validateInfo.password}
                  //helperText={validateInfo.password ? "El nm no existe" : ""}
                  helperText={helperText}
                  autoComplete="NM"
                  name="NM"
                  variant="outlined"
                  required
                  fullWidth
                  id="NM"
                  label="NM"
                  autoFocus
                  value={nm}
                  onChange={(e) => {
                    setnm(e.target.value);
                  }}
                >
                  {(inputProps) => <TextField {...inputProps} />}
                </InputMask>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={(e) => {
                e.preventDefault();

                console.log(ctx.userStatus);
                signIn(nm);
              }}
              className={classes.submit}
            >
              Iniciar sesion
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
}
