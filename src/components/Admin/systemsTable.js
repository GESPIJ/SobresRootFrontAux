import React, { useState, useEffect, useContext } from "react";
//import axios from "../../axios/axios";
import axios from "../../axios/axios";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import CreateIcon from "@material-ui/icons/Create";
import DeleteIcon from "@material-ui/icons/Delete";
import { Container, Paper, Button, IconButton } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Title from "./Title";
import AlertDialog from "../AlertDialog";
import TablePagination from "@material-ui/core/TablePagination";

//Helper functions
import { convertDateToHumanReadable } from "../../utils/helper";
import MyContext from "../../context/mycontext";

//Component Styles
const useStyles = makeStyles((theme) => ({
  padding8: {
    paddingTop: "8px",
  },
  seeMore: {
    marginTop: theme.spacing(3),
  },
  row: {
    paddingTop: "16px",
  },

  disabledRow: {
    paddingTop: "16px",
    opacity: 0.5,
    pointerEvents: "none",
  },

  registerButton: {
    marginRight: "16px",
    float: "right",
  },
}));

export default function Orders({ solitudes, fetchSystems }) {
  const history = useHistory();

  //Context State
  const ctx = useContext(MyContext);
  //Component States
  const [alert, setalert] = useState(false);
  const [actualSolitude, setactualSolitude] = useState({});
  const [listOfSystems, setListOfSystems] = useState(solitudes.slice(0, 5));
  const [paginationData, setpaginationData] = useState({
    actualPage: 0,
    pageLimit: 5,
  });

  //Functions

  //Function for changing the current page of users being displayed
  const handleChangePage = (e) => {
    let newActualPage =
      e.currentTarget.ariaLabel === "Next page"
        ? paginationData.actualPage + 1
        : paginationData.actualPage - 1;
    //Based on the new page placed by the user we determine the portion of the original Users Array to be shown
    let newPaginatedListOfUsers = solitudes.slice(
      newActualPage * paginationData.pageLimit,
      (newActualPage + 1) * paginationData.pageLimit
    );
    //We update the data
    setpaginationData({ ...paginationData, actualPage: newActualPage });
    setListOfSystems(newPaginatedListOfUsers);
  };

  //Function for changing the numbers of users being shown by page
  const handleChangeRowsPerPage = (e) => {
    let newRowsPerPage = e.target.value;

    //Based on the new number of inputs per page we calculate the new portion off the original users array to be shown
    let newPaginatedUsers = solitudes.slice(
      paginationData.actualPage * newRowsPerPage,
      (paginationData.actualPage + 1) * newRowsPerPage
    );
    setpaginationData({ ...paginationData, pageLimit: newRowsPerPage });
    setListOfSystems(newPaginatedUsers);
  };

  //Function for disabling a system on the DB
  const disableSystem = async ({ id }) => {
    const payload = {
      id,
    };

    //Server Response
    const response = await axios.post("/admin/disableSystem", payload);

    //We call again all the systems for having the info updated
    fetchSystems();
  };

  //Handler for the user confirming the Alert
  const confirmAlertFunction = async () => {
    const response = await disableSystem(actualSolitude);
    setalert(false);
  };

  //Handler for the using cancelling the alert
  const cancelAlertFunction = () => {
    setalert(false);
  };
  useEffect(() => {
    setListOfSystems(
      solitudes.slice(
        paginationData.actualPage * paginationData.pageLimit,
        (paginationData.actualPage + 1) * paginationData.pageLimit
      )
    );
  }, [solitudes]);
  const classes = useStyles();
  return (
    <React.Fragment>
      {alert && (
        <AlertDialog
          title="Esta a punto de eliminar un sistema, esta seguro?"
          confirmFunction={confirmAlertFunction}
          cancelFunction={cancelAlertFunction}
        />
      )}

      <Container maxWidth="lg" className={classes.container}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Title className={classes.padding8}>Lista de sistemas</Title>
            <Button
              type="submit"
              //fullWidth
              variant="contained"
              color="primary"
              onClick={(e) => {
                history.replace("/HomeOperations");
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
                ctx.setpreviousPage("/systemsTable");
                history.replace("/signUpSystem");
                // registerUser(user);
              }}
              className={classes.registerButton}
            >
              Crear sistema
            </Button>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Fecha de registro</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Ip</TableCell>
                  <TableCell>Puerto</TableCell>
                  <TableCell>Admin</TableCell>
                  <TableCell>Editar</TableCell>
                  <TableCell>Borrar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listOfSystems.map((solitude) => (
                  <TableRow
                    key={solitude.id}
                    className={
                      solitude.disabled ? classes.disabledRow : classes.row
                    }
                  >
                    <TableCell className={classes.row}>
                      {convertDateToHumanReadable(solitude.createdAt)}
                    </TableCell>
                    <TableCell>{solitude.name}</TableCell>
                    <TableCell>{solitude.ip}</TableCell>
                    <TableCell>{solitude.port}</TableCell>
                    <TableCell>{solitude.admin}</TableCell>
                    <TableCell>
                      {
                        <IconButton
                          onClick={(e) => {
                            ctx.setpreviousPage("/systemsTable");
                            history.push({
                              pathname: "/modifySystem",
                              state: {
                                system: solitude,
                              },
                            });
                          }}
                        >
                          {" "}
                          <CreateIcon />{" "}
                        </IconButton>
                      }
                    </TableCell>
                    <TableCell>
                      {
                        <IconButton
                          onClick={() => {
                            setactualSolitude(solitude);
                            setalert(true);
                            //disableSystem(solitude);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <TablePagination
              showFirstButton
              showLastButton
              rowsPerPageOptions={[3, 5, 8]}
              component="div"
              count={solitudes.length}
              rowsPerPage={paginationData.pageLimit}
              page={paginationData.actualPage}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Paper>
        </Grid>
      </Container>
    </React.Fragment>
  );
}
