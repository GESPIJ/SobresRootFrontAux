import React, { useState, useEffect, useContext, useRef } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import {
  Container,
  Paper,
  Button,
  IconButton,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import Title from "../Title";
import moment from "moment";

import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
//Importamos las alertas y dialogos
import InputDialog from "./../FormDialogContentText";
import { convertDateToHumanReadable } from "../../utils/helper";
import MyContext from "../../context/mycontext";

//Component Styles
const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
  row: {
    paddingTop: "12px",
  },

  registerButton: {
    marginRight: "16px",
    float: "right",
  },

  disabledButton: {
    opacity: "0.5",
    pointerEvents: "none",
  },
}));

export default function Orders({ solitudes }) {
  //Component context state
  const ctx = useContext(MyContext);
  const refUpdateTable = useRef(true);
  const refTimer = useRef("");
  //Component States
  const [timer, settimer] = useState(false);
  const [alertData, setalertData] = useState({
    active: false,
    acknowledgeSolitudes: [],
  });
  const [paginationData, setpaginationData] = useState({
    actualPage: 0,
    limitPage: 5,
  });

  const [loading, setloading] = useState(true);

  const solitudesPaginated = solitudes ? solitudes.slice(0, 5) : [];
  const [listOfSolitudes, setlistOfSolitudes] = useState(solitudesPaginated);
  const history = useHistory();

  //Component Functions

  //Function for formatting the title for the current solitude beign shown
  const formatTitleForSolitude = (solitude) => {
    let alertTitle =
      "Queda solo 1 hora para la solicitud en el sistema " +
      solitude.SistemaId +
      ", realizada por el nm " +
      solitude.nmSolicitante;
    return alertTitle;
  };

  //Handler for changing the actual page being shown
  const handleChangePage = (e) => {
    refUpdateTable.current = false;
    clearTimeout(refTimer.current);

    //We calculate the new portion of the array being shown based on the page
    let newActualPage =
      e.currentTarget.ariaLabel === "Next page"
        ? paginationData.actualPage + 1
        : paginationData.actualPage - 1;

    //We update the data
    setpaginationData({ ...paginationData, actualPage: newActualPage });
    //We reset the timer
    settimer((prev) => !prev);
    const newPaginatedSolitudes = solitudes.slice(
      newActualPage * paginationData.limitPage,
      (newActualPage + 1) * paginationData.limitPage
    );

    setlistOfSolitudes(newPaginatedSolitudes);
    console.log("Hubo un cambio aca");
  };

  //Function for changing the number of inputs per page actually being shown on the table
  const handleChangeRowsPerPage = (e) => {
    clearTimeout(refTimer.current);
    refUpdateTable.current = false;
    let newRowsPerPage = e.target.value;

    //We calculate the new portion of the array beign shown
    let newPaginatedSolitudes = solitudes.slice(
      paginationData.actualPage * newRowsPerPage,
      (paginationData.actualPage + 1) * newRowsPerPage
    );
    //We update the data and reset the timer
    setlistOfSolitudes(newPaginatedSolitudes);
    setpaginationData({ ...paginationData, limitPage: newRowsPerPage });
    settimer((prev) => !prev);
  };
  //Function for handling the confirm on the alert function
  const confirmAlertFunction = () => {
    let newAlerDataArray = [...alertData.acknowledgeSolitudes];
    newAlerDataArray.push(alertData.id);
    setalertData({
      ...alertData,
      active: false,
      acknowledgeSolitudes: newAlerDataArray,
    });
  };

  //Function for handling the cancel of the alert
  const cancelAlertFunction = () => {
    setalertData({
      ...alertData,
      active: false,
      acknowledgeSolitudes: alertData.acknowledgeSolitudes,
    });
  };
  useEffect(() => {
    if (solitudes.length > 0) {
      refTimer.current = setTimeout(() => {
        if (true) {
          let actualTime = moment();
          console.log("Paso un timer");
          if (solitudes.length > 0) {
            solitudes.forEach((solitude) => {
              let solitudeTime = moment(solitude.createdAt);
              //let actualTime = moment().subtract(8, "hours");
              let actualDate = new Date();
              let actualTime = moment(actualDate);
              let transcurredTime = actualTime.diff(solitudeTime, "seconds");

              if (transcurredTime > 28800) {
                solitude.state = "finished";
              } else {
                let idAcknowledged = false;
                idAcknowledged = alertData.acknowledgeSolitudes.some(
                  (id) => id === solitude.id
                );
                if (
                  transcurredTime > 25200 &&
                  !idAcknowledged &&
                  !alertData.active
                ) {
                  setalertData({
                    ...solitude,
                    active: true,
                    acknowledgeSolitudes: alertData.acknowledgeSolitudes,
                  });
                }
                let remainingTime = 28800 - transcurredTime;
                let hours = Math.floor(remainingTime / 3600).toString();
                hours = hours.length === 1 ? "0" + hours : hours;
                let minutes = Math.floor(
                  (remainingTime % 3600) / 60
                ).toString();
                minutes = minutes.length === 1 ? "0" + minutes : minutes;
                let seconds = ((remainingTime % 3600) % 60).toString();
                seconds = seconds.length === 1 ? "0" + seconds : seconds;

                solitude.timeLeft = remainingTime;
                solitude.state = hours + ":" + minutes + ":" + seconds;
              }
            });

            if (loading) {
              setloading(false);
            }

            // solitudes.sort((a, b) => (a.id > b.id ? 1 : -1));
            // solitudes.reverse();
            //debugger;
            if (refUpdateTable.current) {
              const solitudesAfterPagination = solitudes.slice(
                paginationData.actualPage * paginationData.limitPage,
                (paginationData.actualPage + 1) * paginationData.limitPage
              );
              setlistOfSolitudes(solitudesAfterPagination);
            } else {
              setTimeout(() => {
                refUpdateTable.current = true;
              }, 1500);
            }
          }
        }
        settimer((prev) => !prev);
      }, 2000);
    } else {
      solitudes.forEach((solitude) => {
        //Probar si esto esta funcionando
        solitude.state = "Finished";
      });
      setTimeout(() => {
        setloading(false);
        settimer((prev) => !prev);
      }, 200);
    }

    //debugger;
    console.log(solitudes.length);
    //console.log(solitudes);
  }, [timer]);

  useEffect(() => {
    const paginatedSolitudes = solitudes.slice(
      paginationData.actualPage * paginationData.limitPage,
      (paginationData.actualPage + 1) * paginationData.limitPage
    );
    setlistOfSolitudes(paginatedSolitudes);
  }, [solitudes]);
  const classes = useStyles();
  return (
    <React.Fragment>
      <Backdrop
        //className={classes.backdrop}
        open={loading}
      >
        <CircularProgress />
      </Backdrop>

      {!loading && (
        <div>
          {alertData.active && (
            <InputDialog
              title={"Solicitud a punto de expirar"}
              confirmFunction={confirmAlertFunction}
              cancelFunction={cancelAlertFunction}
              contentText={formatTitleForSolitude(alertData)}
            />
          )}

          <Container maxWidth="lg" className={classes.container}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Title>Solicitudes recientes</Title>

                <Button
                  type="submit"
                  //fullWidth
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    ctx.setpreviousPage("/solitudesTable");
                    history.replace("/HomeAdmin");
                  }}
                  className={classes.registerButton}
                >
                  Regresar
                </Button>
                <Button
                  type="submit"
                  //fullWidth
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    ctx.setpreviousPage("/solitudesTable");
                    history.replace("/newSolitude");
                  }}
                  className={classes.registerButton}
                >
                  Nueva solicitud
                </Button>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Fecha</TableCell>
                      <TableCell>NM Solicitante</TableCell>
                      <TableCell>Sistema</TableCell>
                      <TableCell>Motivo</TableCell>
                      <TableCell>Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listOfSolitudes.map((solitude) => (
                      <TableRow key={solitude.id}>
                        <TableCell className={classes.row}>
                          {convertDateToHumanReadable(solitude.createdAt)}
                        </TableCell>
                        <TableCell>{solitude.nmSolicitante}</TableCell>
                        <TableCell>{solitude.systemName}</TableCell>
                        <TableCell>{solitude.motivo}</TableCell>
                        <TableCell>{solitude.state}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => {
                              //debugger;

                              if (solitude.state) {
                                ctx.setcurrentSolitude({ id: solitude.id });
                                history.replace({
                                  pathname: "/timeoutcounter",

                                  state: {
                                    id: solitude.id,
                                    timeLeft: solitude.timeLeft,
                                  },
                                });
                              }
                            }}
                            className={
                              solitude.state === "finished"
                                ? classes.disabledButton
                                : ""
                            }
                          >
                            <ArrowForwardIosIcon />
                          </IconButton>
                        </TableCell>
                        {/* <TableCell align="right">{row.amount}</TableCell> */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <TablePagination
                  showFirstButton
                  showLastButton
                  rowsPerPageOptions={[5, 8, 12]}
                  component="div"
                  count={solitudes.length}
                  rowsPerPage={paginationData.limitPage}
                  page={paginationData.actualPage}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                />
                {/* <div className={classes.seeMore}>
       
      </div> */}
              </Paper>
            </Grid>
          </Container>
        </div>
      )}
    </React.Fragment>
  );
}
