import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import { Check, Error, Schedule } from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { IconButton, Card, CardHeader } from "@material-ui/core";
import BarraNavegacion from "../BarraNavegacion";
import MyContext from "../../context/mycontext";
import CssBaseline from "@material-ui/core/CssBaseline";
import InputDialog from "./../FormDialogContentText";
import socket from "../../socket";
import moment from "moment";
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

  card: {
    cursor: "pointer",
    backgroundColor: "yellow",
  },
  grid: {
    marginTop: "5%",
  },
}));

const useStyles2 = makeStyles({
  card: {
    cursor: "pointer",
  },
});

const Home = (props) => {
  //Context
  const ctx = useContext(MyContext);

  //Component States
  const [counterTimer, setcounterTimer] = useState(
    props.location && props.location.state && props.location.state.timeLeft
      ? props.location.state.timeLeft
      : 28800
  );
  const [timerToDate, settimerToDate] = useState("");

  const [timerAboutToExpire, settimerAboutToExpire] = useState(false);
  const [extensionRequested, setextensionRequested] = useState(false);
  const [showExpiringAlert, setshowExpiringAlert] = useState(false);
  const [showExtensionButton, setshowExtensionButton] = useState(false);
  const history = useHistory();
  const classes = useStyles();
  const classes2 = useStyles2();

  //Component Functions

  //Function for finishing an active solitude
  const finalizarSolicitud = async (id) => {
    const payload = { id: id };
    console.log(ctx);
    //Server Response
    const response = await axios.post("/admin/finishSolitude", payload);
    //await axios.post("/admin/generateNewComponent", {id: ctx.currentSolitude.SistemaId});
    const response2 = await axios.post("/admin/requireSystemNewPassword", {
      id: ctx.currentSolitude.id,
    });
    // const notificationResponse = await axios.post("/admin/notifySolitudeByEmail", {
    //   nm: ctx.nmActual,
    //   textContent: `La solicitud de sobre root para el sistema de nombre ${ctx.currentSolitude.systemName} a cargo del operador con ${ctx.nmActual} ha finalizado`,
    //   textTitle: `Solicitud de sobre root finalizada para el sistema de nombre ${ctx.currentSolitude.systemName} `
    // });

    if (
      response.data.message === "success" &&
      response2.data.message === "success"
    ) {
      history.replace("/solitudesTable");
    }
  };

  const extendSolitude = async (id) => {
    const payload = { id: id };

    //Server Response
    const response = await axios.post("/admin/extendSolitude", payload);

    if (response.data.message === "success") {
      setcounterTimer((prev) => prev + 14400);
      //Do something
    }
  };

  //Function for updating the timer every 1 second and reflect it on the screen
  useEffect(() => {
    if (counterTimer < 3600 && !timerAboutToExpire) {
      setshowExtensionButton(true);
      setshowExpiringAlert(true);
      if (
        props.location.state &&
        !props.location.state.solitude.notificationSent
      ) {
        socket.emit("rootEnvelopeAboutToEnd", {
          nm: ctx.nmActual,
          system: "Sistema A",
          expirationTime: moment().add(59, "minutes").format("HH:mm"),
        });
      }

      if (!timerAboutToExpire) {
        settimerAboutToExpire(true);
      }
      //setextensionRequested(true);
    }

    setTimeout(() => {
      if (counterTimer) {
        let dateVariable = new Date(counterTimer * 1000)
          .toISOString()
          .substr(11, 8);

        settimerToDate(dateVariable);
        //console.log(dateVariable);
        setcounterTimer((prev) => prev - 1);
      }
    }, 1000);
  }, [counterTimer]);
  return (
    <div className="signup">
      <BarraNavegacion />
      <CssBaseline />
      <div className={classes.root}>
        <br />
        {showExpiringAlert && (
          <InputDialog
            title={"Solicitud a punto de expirar"}
            confirmFunction={() => {
              setshowExpiringAlert(false);
            }}
            contentText="A la solicitud le queda sola una hora antes de expirar. En caso de querer extender presione el boton solicitar extension"
          />
        )}
        <Container component="main" maxWidth="lg">
          <Typography classes={classes.card} variant="h4"></Typography>

          <Grid
            className={classes.grid}
            //alignContent="center"
            justify="center"
            container
            spacing={5}
          >
            <Grid item xs={12} sm={12} md={3} lg={4}>
              <Card
                className={classes2.card}
                onClick={() => {
                  // history.replace("/selectPrinter");
                }}
              >
                <CardHeader
                  title={"Timer"}
                  action={
                    <IconButton>
                      <Schedule />
                    </IconButton>
                  }
                />{" "}
                {timerToDate}
              </Card>
            </Grid>
          </Grid>
          <Grid className={classes.grid} justify="center" container spacing={5}>
            <Grid item xs={12} sm={4} md={4} lg={4}>
              <Card
                className={classes2.card}
                onClick={() => {
                  //history.push("/selectpRINTER");

                  finalizarSolicitud(ctx.currentSolitude.id);
                }}
              >
                <CardHeader
                  title={"Fin de Operacion"}
                  action={
                    <IconButton>
                      <Error />
                    </IconButton>
                  }
                />
              </Card>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={4}>
              <Card
                className={classes2.card}
                onClick={() => {
                  history.replace("/solitudesTable");
                }}
              >
                <CardHeader
                  title={"Volver pantalla principal"}
                  action={
                    <IconButton>
                      <Error />
                    </IconButton>
                  }
                />
              </Card>
            </Grid>
            {showExtensionButton && (
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <Card
                  className={classes2.card}
                  onClick={() => {
                    extendSolitude(ctx.currentSolitude.id);
                    //history.replace("/newSolitude");
                  }}
                >
                  <CardHeader
                    title={"Extensión?"}
                    action={
                      <IconButton>
                        <Check />
                      </IconButton>
                    }
                  />
                </Card>
              </Grid>
            )}
          </Grid>
        </Container>
      </div>
    </div>
  );
};

export default Home;
