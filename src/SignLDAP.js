import React, { useState, useEffect, useContext } from "react";
import { useHistory, Redirect, withRouter } from "react-router-dom";
import axios from "axios";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
//import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import MyContext from "./context/mycontext";
import moment from "moment";
import Boton from "./boton";
import SnackAlert from "./SnackBarAlert";
import FormDialog from "./components/FormDialogInput";
import BarraNavegacion from "./components/BarraNavegacion";
import AlertMessageDialog from "./components/AlertDialog";

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
    marginTop: theme.spacing(1),
  },
  leftButton: {
    float: "left",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default withRouter(function SignIn({ usuarioActual }) {
  //Context and history
  const history = useHistory();
  const ctx = useContext(MyContext);

  //States for the component
  const [user, setuser] = useState({
    name: ctx.usuarioActual ? ctx.usuarioActual : "",
    nm: ctx.nmActual ? ctx.nmActual : "",
    failedAttemps: ctx.failedAttemps,
    password: "",
    department: "",
  });
  const [invalidCredentials, setinvalidCredentials] = useState(false);
  const [invalidCredentialsState, setinvalidCredentialsState] =
    useState("Clave invalida");
  const [newPasswordField, setnewPasswordField] = useState({
    newPassword: "",
    newPasswordConfirmation: "",
  });
  const [AlertMessage, setAlertMessage] = useState({
    state: false,
    title: "",
    description: "",
    confirmFunction: null,
    cancelFunction: null,
  });
  //const [redirect, setredirect] = useState(false);
  //const [invalidEmail, setinvalidEmail] = useState(false);
  const [changeOldPassword, setchangeOldPassword] = useState(false);

  //const history = useHistory();

  const fetchLocal = async ({ nm, password }) => {
    console.log("Llamando a la funcion signin");
    try {
      //debugger;
      let userDomain = nm + "@Banvendes.corp";
      if (ctx.userStatus === "active") {
        const payload = { user: userDomain, password };
        //debugger;
        console.log("El usuario que estoy mandando es ");
        console.log(userDomain);
        console.log("Y la clave es", password);
        const response = await axios.post("/admin/signInLDAP", payload);
        //const response = await axios.post("/admin/signInLDAP", payload);
        console.log("Esta es la respuesta que obtengo del directorio Activo");
        console.log(response);
        //debugger;

        let message = response.data.message;

        // console.log("ESTE ES EL MENSAJE RETORNADOOOOOOO");
        // console.log(message);

        if (message === "WrongIp") {
          setinvalidCredentials(true);
          setinvalidCredentialsState(
            "Usted esta ingresando desde una ip que no se encuentra registrada"
          );
        } else if (message === "loggedIn") {
          setinvalidCredentials(true);
          setinvalidCredentialsState("Usted ya tiene una sesiÃ³n activa");
          console.log("Este es el mensaje", message);
          return;
        } else if (message === "approved") {
          console.log(response);
          setinvalidCredentials(false);
          setuser({ ...user, department: response.data.department });
          ctx.settimerForJwt(!ctx.timerForJwt);
          const messageText =
            "Usuario logeado " + ctx.usuarioActual + " con exito en local";
          await axios.post("/admin/registerLog", {
            solitude: null,
            message: messageText,
          });
          //window.localStorage.setItem("code", response.data.authorizationCode);

          //La fecha fue modificada para compatibilidad con Mozilla Firefox, ya que Chrome si hace el parse automÃ¡ticamente.
          let lastPasswordChange = moment(
            response.data.lastUpdatedPassword,
            "MMM-D-YYYY h-m-s"
          );
          let passwordTooOld =
            moment().subtract(30, "days") > lastPasswordChange;

          if (!passwordTooOld) {
            const responseFailedAttemps = await axios.post(
              "/admin/updateUserFailedAttemps",
              {
                nm: ctx.nmActual,
                name: ctx.usuarioActual,
                failedAttemps: ctx.failedAttemps,
                reset: true,
              }
            );
            ctx.setisSuccesfullyLogged(true);
            redirectToHomePage();
          } else {
            console.log(ctx.usuarioActual);
            setchangeOldPassword(passwordTooOld);
          }
        }

        // else if (message === "AlreadyLoggedIn") {
        //   setinvalidCredentials(true);
        //  }
        else {
          if (ctx.failedAttemps < 2) {
            const intentosQueQuedan = 2 - ctx.failedAttemps;
            const texto =
              ctx.failedAttemps === 1
                ? "Clave incorrecta, usted tiene solo un intento mÃ¡s antes de bloquear su usuario"
                : "Clave incorrecta, usted tiene " +
                  intentosQueQuedan +
                  " intentos mas antes de bloquear su usuario";
            if (!invalidCredentials) {
              setinvalidCredentials(true);
            }
            const tryText =
              ctx.failedAttemps === 0
                ? " primer intento"
                : ctx.failedAttemps === 1
                ? " segundo intento"
                : " tercer intento";
            const logMessage =
              "Inicio de sesiÃ³n fallido en autenticaciÃ³n local para " +
              ctx.usuarioActual +
              " con nm " +
              ctx.nmActual +
              tryText;
            const response = axios.post("/admin/registerLog", {
              solitude: null,
              message: logMessage,
            });
            setinvalidCredentialsState(texto);
            ctx.setFailedAttemps(ctx.failedAttemps + 1);
          } else {
            //debugger;

            const response = axios.post("/admin/registerLog", {
              solitude: null,
              message: "Usuario bloqueado tras tres intentos fallidos en local",
            });
            const responseFailedAttemps = await axios.post(
              "/admin/updateUserFailedAttemps",
              {
                nm: ctx.nmActual,
                name: ctx.usuarioActual,
                failedAttemps: ctx.failedAttemps,
                reset: false,
              }
            );

            console.log(responseFailedAttemps);
            ctx.setUserStatus("blocked");
            ctx.setFailedAttemps(ctx.failedAttemps + 1);
            history.replace({
              pathname: "/",
              state: {
                helperTextBlockedUser:
                  "Su usuario se encuentra bloqueado debido a mÃ¡s de 3 intentos fallidos",
                validateInfo: { password: true },
              },
            });
          }

          setinvalidCredentials(true);
          // setAlertMessage({
          //   ...AlertMessage,
          //   state: true,
          //   title: "Clave incorrecta",
          // });
        }

        //debugger;

        //setredirect(true);
      } else {
        console.log("BLOCKEEEEEEEEEEEEEEEEEEEED USER");
      }
    } catch (e) {
      console.log(e);
      //setredirect(true);
    }
  };

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const redirectToHomePage = (response = null) => {
    let department = ctx.userAditionalInfo.department;
    // history.replace("/signIn");
    // if (response !== null) {
    //   department = response.data.department;
    // } else {
    //   department = user.department;
    // }
    //
    history.replace("/doubleAuth");
    //  if (department === "AdministraciÃ³n") {
    //    history.replace("/HomeOperations");
    //  } else if (department === "Operaciones") {
    //    history.replace("/HomeAdmin");
    //  }
  };
  const cancelFormFunction = (e) => {
    setchangeOldPassword(false);
  };

  const confirmFormFunction = async (e) => {
    let payload = {
      newPassword: newPasswordField.newPassword,
      name: user.name,
      //nm: "123456",
    };
    const response = await axios.post("/admin/updateUserPassword", payload);
    if (response.data.message === "succesfully") {
      setchangeOldPassword(false);
      setAlertMessage({
        ...AlertMessage,
        state: true,
        title: "Clave cambiada correctamente",
        description: "Change_Old_Password",
      });
    } else {
    }
    //setchangeOldPassword(false);
  };

  const confirmAlertFunction = () => {
    setAlertMessage({ ...AlertMessage, state: false });
    if (AlertMessage.description === "Change_Old_Password") {
      redirectToHomePage();
    }
    // else if (AlertMessage.description === "Invalid Password"){

    // }
  };
  const cancelAlertFunction = () => {
    setAlertMessage({ ...AlertMessage, state: false });
  };
  const onBlurHandler = (e) => {
    let name = e.target.value;
    let validationResult = validateEmail(name);
    console.log(validationResult);
    //setinvalidEmail(!validationResult);
    //let re = /nm[0-9]{6}/;
    //let re = /nm[0-9]{6}/;
    //console.log(e.target.value);
  };
  const classes = useStyles();

  useEffect(() => {
    //console.log(history);
    //console.log(contextType);
    //console.log(props);
    //debugger;
    console.log(ctx);
  }, []);
  return (
    <div className="signIn">
      <BarraNavegacion />
      <div>
        <Boton />
      </div>

      {AlertMessage.state && AlertMessage.title === "Clave incorrecta" && (
        <SnackAlert
          AlertState={true}
          AlertType="error"
          AlertTitle="Clave invalida"
          anchorOrigin={("top", "center")}
        />
      )}
      {changeOldPassword && (
        <FormDialog
          title={"Actualice su clave para continuar"}
          contentText={
            " Hemos detectado que su clave tiene mas de 30 dÃ­as, por motivos de seguridad es necesario que la cambie. Recuerde que la clave debe contener al minimo 8 caracteres especiales incluyendo 1 caracter especial, una letra y un numero"
          }
          cancelFunction={cancelFormFunction}
          confirmFunction={confirmFormFunction}
          formData={newPasswordField}
          setformData={setnewPasswordField}
        />
      )}

      {AlertMessage.state && (
        <AlertMessageDialog
          title={AlertMessage.title}
          //confirmFunction={AlertMessage.confirmFunction}
          //cancelFunction={AlertMessage.cancelFunction}
          confirmFunction={confirmAlertFunction}
          cancelFunction={cancelAlertFunction}
        />
      )}

      <Container
        className="loginContainer"
        component="main"
        maxWidth="xs"
        //root={{ width: "80%" }}
      >
        <CssBaseline />
        <div className={classes.paper}>
          {/* <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar> */}

          <Typography component="h1" variant="h5">
            Iniciar sesion DA
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              onChange={(e) => {
                //setusuario(e.target.value);
                setuser({ ...user, nm: e.target.value });
              }}
              onBlur={onBlurHandler}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="nm"
              label="NM"
              name="nm"
              autoComplete="nm"
              //autoFocus
              value={user.nm}
            />
            {/* {invalidEmail && (
              <p style={{ color: "red", textAlign: "left" }}>Invalid email </p>
            )} */}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              error={invalidCredentials}
              helperText={invalidCredentials ? invalidCredentialsState : ""}
              onChange={(e) => {
                //setcontraseÃ±a(e.target.value);
                setuser({ ...user, password: e.target.value });
              }}
              name="password"
              label={invalidCredentials ? "Error" : ""}
              type="password"
              id="password"
              autoComplete="current-password"
              value={user.password}
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Recuerdame"
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={(e) => {
                e.preventDefault();
                //Checking the user credentials
                fetchLocal(user);
              }}
              color="primary"
              className={classes.submit}
            >
              Iniciar sesiÃ³n
            </Button>
            {/* <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Clave olvidada?
                </Link>
              </Grid>
            </Grid> */}
          </form>
        </div>
      </Container>
    </div>
  );
});
