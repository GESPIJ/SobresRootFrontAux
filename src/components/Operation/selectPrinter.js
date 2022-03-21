import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { IconButton, Paper, Card, CardHeader } from "@material-ui/core";
import MyContext from "../../context/mycontext";
import { Print } from "@material-ui/icons";
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

const Home = () => {
  //Component States
  const [printers, setprinters] = useState({
    printers: [],
    selectedPrinter: "",
  });
  const history = useHistory();
  const classes = useStyles();
  const classes2 = useStyles2();

  //Function for fetching all printers in the system DB
  const fetchPrinters = async () => {
    //Server Response
    const response = await axios.get("/admin/printersAll");
    //We update the data
    setprinters({ ...printers, printers: response.data.printers });
  };

  useEffect(() => {
    fetchPrinters();
  }, []);
  return (
    <div className="signup">
      <BarraNavegacion />

      <div className={classes.root}>
        <br />
        <Container component="main" maxWidth="lg">
          <Typography classes={classes.card} variant="h4">
            Selecciona una Impresora
          </Typography>
          <Grid className={classes.grid} justify="start" container spacing={5}>
            {printers.printers.map((printer) => {
              return (
                <Grid item xs={12} sm={4} md={4} lg={4}>
                  <Card
                    className={classes2.card}
                    onClick={() => {
                      history.replace("/waitingForPrint");
                    }}
                  >
                    <CardHeader
                      title={printer.name}
                      action={
                        <IconButton>
                          <Print />
                        </IconButton>
                      }
                    />
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </div>
    </div>
  );
};

export default Home;
