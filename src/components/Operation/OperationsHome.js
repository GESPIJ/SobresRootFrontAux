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
import { getSocket, buildSocketMessage } from "../../socket";
const axios = require("axios");

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
  const classes2 = useStyles2();

  const fetchSystems = async () => {
    let response;
    if (ctx.userAditionalInfo.department === "Administración") {
      response = await axios.post("/admin/getSystemByNMSecurity", {
        id: ctx.userAditionalInfo.id,
      });
    } else {
      response = await axios.post("/admin/getSystemByNMTecnologie", {
        id: ctx.userAditionalInfo.id,
      });
    }

    ctx.setSystemsOwned(response.data.systems.reverse());
  };

  let addNewSnackbar = (content, severity, parameter) => {
    if(!content ) return;

    const existingSnackbar = ctx.snackbar.find((item) => item.content === content); 
    if(!existingSnackbar){
      ctx.setSnackbar((prev) => {
        return [...prev, { open: true, content: content, severity: severity }];
      });
    }
  };

    useEffect(() => {
      const socket = getSocket();
      socket.on("close", () => {});
  
      socket.on("newRootEnvelope", (parameter) => {
        if( parameter.nm ) addNewSnackbar( buildSocketMessage(socket, "newRootEnvelope", parameter), "success", parameter );
      });
  
      socket.on("rootEnvelopeAboutToEnd", (parameter) => {
         if( parameter.nm )addNewSnackbar( buildSocketMessage(socket, "rootEnvelopeAboutToEnd", parameter), "warning", parameter );
      });
  
      socket.on("rootEnvelopeEnded", (parameter) => {
        if( parameter.nm) addNewSnackbar( buildSocketMessage(socket, "rootEnvelopeEnded", parameter), "eror", parameter );
     });
    }, [ ]);

  useEffect(() => {
    fetchSystems();
    }, [ctx.usuarioActual]);

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
          </Grid>
        </Container>
      </div>
    </div>
  );
};

export default Home;
