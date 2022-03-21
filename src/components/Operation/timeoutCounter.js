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
  const history = useHistory();
  const classes = useStyles();
  const classes2 = useStyles2();

  //Component Functions

  //Function for finishing an active solitude
  const finalizarSolicitud = async (id) => {
    const payload = { id: id };

    //Server Response
    const response = await axios.post("/admin/finishSolitude", payload);

    if (response.data.message === "success") {
      history.replace("/solitudesTable");
    }
  };

  //Function for updating the timer every 1 second and reflect it on the screen
  useEffect(() => {
    setTimeout(() => {
      console.log(counterTimer);
      if (counterTimer) {
        let dateVariable = new Date(counterTimer * 1000)
          .toISOString()
          .substr(11, 8);

        settimerToDate(dateVariable);
        console.log(dateVariable);
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
                  history.replace("/selectPrinter");
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
                  console.log(ctx.currentSolitude);
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
            {counterTimer < 3600 && (
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <Card
                  className={classes2.card}
                  onClick={() => {
                    history.replace("/newSolitude");
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
