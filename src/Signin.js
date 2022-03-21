import React, { useState, useEffect, useContext } from "react";
import { useHistory, withRouter } from "react-router-dom";
import axios from "axios";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import MyContext from "./context/mycontext";
import moment from "moment";
import Boton from "./boton";
import SnackAlert from "./SnackBarAlert";
import FormDialog from "./components/FormDialogInput";

//Internal Components and modules
import BarraNavegacion from "./components/BarraNavegacion";
import AlertMessageDialog from "./components/AlertDialog";

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
  const [invalidEmail, setinvalidEmail] = useState(false);
  const [changeOldPassword, setchangeOldPassword] = useState(false);

  //Component Functions
  const fetchLocal = async ({ name, password, nm }) => {
    try {
      //We check if user is currently not blocked to make the request
      if (ctx.userStatus === "active") {
        //let parsedNm = nm.substring(2);

        const payload = { name, password, nm };
        //Server Response
        const response = await axios.post("/admin/signIn", payload);

        let message = response.data.message;

        //If the user is connected from a wrong ip that the previous assigned we display a message
        if (message === "WrongIp") {
          setinvalidCredentials(true);
          setinvalidCredentialsState(
            "Usted esta ingresando desde una ip que no se encuentra registrada"
          );

          //If the user already has an open session we display the corresponding message
        } else if (message === "loggedIn") {
          setinvalidCredentials(true);
          setinvalidCredentialsState("Usted ya tiene una sesión activa");
          return;
          //If the Sign in on the local system was succesfull we display the message, set a new JWT Token
        } else if (message === "approved") {
          setinvalidCredentials(false);
          setuser({ ...user, department: response.data.department });
          ctx.setuserAditionalInfo({ ...response.data });

          //console.log("This is the whole response that I'm getting", response);
          ctx.settimerForJwt(!ctx.timerForJwt);
          const messageText =
            "Usuario logeado " + ctx.usuarioActual + " con exito en local";
          //We register the corresponding Log
          await axios.post("/admin/registerLog", {
            solitude: null,
            message: messageText,
          });
          window.localStorage.setItem("code", response.data.authorizationCode);

          //La fecha fue modificada para compatibilidad con Mozilla Firefox, ya que Chrome si hace el parse automáticamente.
          let lastPasswordChange = moment(
            response.data.lastUpdatedPassword,
            "MMM-D-YYYY h-m-s"
          );
          let passwordTooOld =
            moment().subtract(30, "days") > lastPasswordChange;

          //Si la clave no es mayor a 30 días se termina de redirigir al usuario a la página principal o al siguiente mecanismo de autenticación
          if (!passwordTooOld) {
            const responseFailedAttemps = await axios.post(
              "/admin/updateUserFailedAttemps",
              {
                name: ctx.usuarioActual,
                failedAttemps: ctx.failedAttemps,
                reset: true,
              }
            );
            ctx.setisSuccesfullyLogged(true);
            redirectToHomePage(response);

            //If password is older than 30 days we request the user for changing it
          } else {
            console.log(ctx.usuarioActual);
            setchangeOldPassword(passwordTooOld);
          }
        }

        //If the user failed signing in we increment the number of failed attempts before blocking the user (3 max failed attemps)
        else {
          if (ctx.failedAttemps < 2) {
            const intentosQueQuedan = 2 - ctx.failedAttemps;
            const texto =
              ctx.failedAttemps === 1
                ? "Clave incorrecta, usted tiene solo un intento más antes de bloquear su usuario"
                : "Clave incorrecta, usted tiene " +
                  intentosQueQuedan +
                  " intentos mas antes de bloquear su usuario";
            //If the user has less than 3 failed attemps
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
              "Inicio de sesión fallido en autenticación local para " +
              ctx.usuarioActual +
              " con nm " +
              ctx.nmActual +
              tryText;

            //We register the corresponding Log
            const response = axios.post("/admin/registerLog", {
              solitude: null,
              message: logMessage,
            });
            setinvalidCredentialsState(texto);
            ctx.setFailedAttemps(ctx.failedAttemps + 1);

            //If the user failed to login in the system 3 times his user is currently blocked
          } else {
            const response = axios.post("/admin/registerLog", {
              solitude: null,
              message: "Usuario bloqueado tras tres intentos fallidos en local",
            });
            const responseFailedAttemps = await axios.post(
              "/admin/updateUserFailedAttemps",
              {
                name: ctx.usuarioActual,
                failedAttemps: ctx.failedAttemps,
                reset: false,
              }
            );

            ctx.setUserStatus("blocked");
            ctx.setFailedAttemps(ctx.failedAttemps + 1);
            history.replace({
              pathname: "/",
              state: {
                helperTextBlockedUser:
                  "Su usuario se encuentra bloqueado debido a más de 3 intentos fallidos",
                validateInfo: { password: true },
              },
            });
          }

          setinvalidCredentials(true);
        }

        //Blocked user
      } else {
        //console.log("BLOCKEEEEEEEEEEEEEEEEEEEED USER");
      }
    } catch (e) {
      console.log(e);
    }
  };

  //We validate the user email
  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  //We reditect to the next authentication phase
  const redirectToHomePage = (response = null) => {
    //history.replace("/doubleAuth");
    history.replace("/signInLDAP");
    // let department;
    // if (response !== null) {
    //   department = response.data.department;
    // } else {
    //   department = user.department;
    // }
    // if (department === "Administración") {
    //   history.replace("/HomeOperations");
    // } else if (department === "Operaciones") {
    //   history.replace("/HomeAdmin");
    // }
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
    setinvalidEmail(!validationResult);
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
            " Hemos detectado que su clave tiene mas de 30 días, por motivos de seguridad es necesario que la cambie. Recuerde que la clave debe contener al minimo 8 caracteres especiales incluyendo 1 caracter especial, una letra y un numero"
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
          <Typography component="h1" variant="h5">
            Iniciar sesion
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
              autoComplete="email"
              //autoFocus
              value={user.nm}
            />

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              error={invalidCredentials}
              helperText={invalidCredentials ? invalidCredentialsState : ""}
              onChange={(e) => {
                //setcontraseña(e.target.value);
                setuser({ ...user, password: e.target.value });
              }}
              name="password"
              label={invalidCredentials ? "Error" : ""}
              type="password"
              id="password"
              autoComplete="current-password"
              value={user.password}
            />

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
              Iniciar sesión
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
});
