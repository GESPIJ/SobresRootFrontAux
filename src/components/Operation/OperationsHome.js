import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import { PersonAdd, Storage, Print } from "@material-ui/icons";
//import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { IconButton, Card, CardHeader } from "@material-ui/core";
import BarraNavegacion from "../BarraNavegacion";
import MyContext from "../../context/mycontext";
import CssBaseline from "@material-ui/core/CssBaseline";

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
    // backgroundColor: "yellow",
  },
}));

const useStyles2 = makeStyles({
  card: {
    cursor: "pointer",
  },
  grid: {
    marginTop: "5%",
  },
});

const Home = () => {
  const ctx = useContext(MyContext);
  const history = useHistory();
  const classes = useStyles();
  const classes2 = useStyles2();
  debugger;
  return (
    <div className="signup">
      <BarraNavegacion />

      <div
      //className={classes.root}
      >
        <br />
        <Container className={classes2.card} component="main" maxWidth="lg">
          <CssBaseline />
          <Typography
            //classes={classes.card}
            variant="h4"
          >
            Administrador, seleccione una acción
          </Typography>
          <Grid className={classes2.grid} container spacing={5}>
            <Grid item xs={1} sm={1} md={1} lg={1}></Grid>
            <Grid item xs={11} sm={5} md={5} lg={5}>
              <Card
                className={classes2.card}
                onClick={() => {
                  ctx.setpreviousPage("HomeOperations");
                  history.replace("/signUpUser");
                }}
              >
                <CardHeader
                  title={"Registrar Usuario"}
                  action={
                    <IconButton>
                      <PersonAdd />
                    </IconButton>
                  }
                />
              </Card>
            </Grid>
            <Grid item xs={11} sm={5} md={5} lg={5}>
              <Card
                className={classes2.card}
                onClick={() => {
                  ctx.setpreviousPage("HomeOperations");
                  history.replace("/signUpSystem");
                }}
              >
                <CardHeader
                  title={"Registrar Sistema"}
                  action={
                    <IconButton>
                      <Storage />
                    </IconButton>
                  }
                />
              </Card>
            </Grid>
            <Grid item xs={1} sm={1} md={1} lg={1}></Grid>
            {/* <Grid item xs={12} sm={4} md={4} lg={4}>
              <Card
                className={classes2.card}
                onClick={() => {
                  ctx.setpreviousPage("HomeOperations");
                  history.replace("/signUpprinter");
                }}
              >
                <CardHeader
                  title={"Registrar Impresora"}
                  action={
                    <IconButton>
                      <Print />
                    </IconButton>
                  }
                />
              </Card>
            </Grid> */}
            <Grid item xs={1} sm={1} md={1} lg={1}></Grid>
            <Grid item xs={11} sm={5} md={5} lg={5}>
              <Card
                className={classes2.card}
                onClick={() => {
                  ctx.setpreviousPage("HomeOperations");
                  history.replace("/usersTable");
                }}
              >
                <CardHeader
                  title={"Modificar Usuario"}
                  action={
                    <IconButton>
                      <PersonAdd />
                    </IconButton>
                  }
                />
              </Card>
            </Grid>
            <Grid item xs={12} sm={5} md={5} lg={5}>
              <Card
                className={classes2.card}
                onClick={() => {
                  ctx.setpreviousPage("HomeOperations");
                  history.replace("/systemsTable");
                }}
              >
                <CardHeader
                  title={"Modificar Sistema"}
                  action={
                    <IconButton>
                      <Storage />
                    </IconButton>
                  }
                />
              </Card>
            </Grid>
            {/* <Grid item xs={12} sm={4} md={4} lg={4}>
              <Card
                className={classes2.card}
                onClick={() => {
                  ctx.setpreviousPage("HomeOperations");
                  history.replace("/printersTable");
                }}
              >
                <CardHeader
                  title={"Modificar Impresora"}
                  action={
                    <IconButton>
                      <Print />
                    </IconButton>
                  }
                />
              </Card>
            </Grid> */}
          </Grid>
        </Container>
      </div>
    </div>
  );
};

export default Home;
