import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import { Check, Error } from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { IconButton, Card, CardHeader } from "@material-ui/core";
import MyContext from "../../context/mycontext";

import BarraNavegacion from "../BarraNavegacion";

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

//Component
const Home = (props) => {
  console.log(props);
  const history = useHistory();
  const classes = useStyles();
  const classes2 = useStyles2();

  //Context State
  const ctx = useContext(MyContext);

  //JSX Component
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
            <Grid item xs={12} sm={4} md={4} lg={4}>
              <Card
                className={classes2.card}
                onClick={() => {
                  history.replace({
                    pathname: "/timeoutcounter",
                    state: {
                      id: ctx.currentSolitude,
                    },
                  });
                }}
              >
                <CardHeader
                  title={"Impresión exitosa"}
                  action={
                    <IconButton>
                      <Check />
                    </IconButton>
                  }
                />
              </Card>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={4}>
              <Card
                className={classes2.card}
                onClick={() => {
                  history.replace({
                    pathname: "/pageToPDF",
                    state: props.location.state,
                  });
                }}
              >
                <CardHeader
                  title={"Error"}
                  action={
                    <IconButton>
                      <Error />
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
