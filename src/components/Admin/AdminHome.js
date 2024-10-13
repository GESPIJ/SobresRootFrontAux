import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import { Assignment } from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { IconButton, Card, CardHeader } from "@material-ui/core";
import BarraNavegacion from "../BarraNavegacion";
import MyContext from "../../context/mycontext";
import CssBaseline from "@material-ui/core/CssBaseline";
import  { getSocket }  from "../../socket";

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

//Home View Component
const Home = () => {
  //Context
  const ctx = useContext(MyContext);
  const history = useHistory();
  const classes = useStyles();
  const classes2 = useStyles2();


  useEffect(() => {
    const socket = getSocket();
    ctx.setSocket(socket);
  }, [])
  

  return (
    <div className="signup">
      <BarraNavegacion />
      <CssBaseline />
      <div className={classes.root}>
        <br />
        <Container component="main" maxWidth="lg">
          <Typography classes={classes.card} variant="h4">
            Operador, seleccione una acción
          </Typography>
          <Grid
            className={classes.grid}
            //alignContent="center"
            justify="center"
            container
            spacing={5}
          >
            <Grid item xs={12} sm={4} md={4} lg={4}>
              <Card
                className={classes2.card}
                onClick={() => {
                  ctx.setpreviousPage("/HomeAdmin");
                  history.replace("/newSolitude");
                }}
              >
                <CardHeader
                  title={"Nueva solicitud"}
                  action={
                    <IconButton>
                      <Assignment />
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
                  title={"Ver solicitudes"}
                  action={
                    <IconButton>
                      <Assignment />
                    </IconButton>
                  }
                />
              </Card>
            </Grid>
          </Grid>
        </Container>
      </div>
    </div>
  );
};

export default Home;
