import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import { Container, Paper, Button, IconButton } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Title from "./Title";
import CreateIcon from "@material-ui/icons/Create";
import DeleteIcon from "@material-ui/icons/Delete";
import BlockIcon from "@material-ui/icons/Block";
import TablePagination from "@material-ui/core/TablePagination";

//Helpers functions
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

  registerButton: {
    marginRight: "16px",
    float: "right",
  },

  disabledButton: {
    opacity: "0.5",
    pointerEvents: "none",
    cursor: "pointer",
  },

  enabledButton: {
    opacity: "1",
    pointerEvents: "auto",
    cursor: "pointer",
  },
}));

export default function Orders({ solitudes, fetchSolitudes }) {
  //Component context state
  const ctx = useContext(MyContext);

  //Users currently being shown
  const paginatedListOfUsers = solitudes.slice(0, 5);
  const [listOfUsers, setlistOfUsers] = useState(paginatedListOfUsers);
  const [paginationData, setpaginationData] = useState({
    actualPage: 0,
    pageLimit: 5,
  });
  const history = useHistory();

  //Component Functions

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
    setlistOfUsers(newPaginatedListOfUsers);
  };

  //Function for changing the numbers of users being shown by page
  const handleChangeRowsPerPage = (e) => {
    let newRowsPerPage = e.target.value;
    //Based on the new number of inputs per page we calculate the new portion off the original users array to be shown
    let newPaginatedUsers = solitudes.slice(
      paginationData.actualPage * newRowsPerPage,
      (paginationData.actualPage + 1) * newRowsPerPage
    );
    //We update the data
    setpaginationData({ ...paginationData, pageLimit: newRowsPerPage });
    setlistOfUsers(newPaginatedUsers);
  };

  //For getting all the users once the component is mounted
  useEffect(() => {
    setlistOfUsers(
      solitudes.slice(
        paginationData.actualPage * paginationData.pageLimit,
        (paginationData.actualPage + 1) * paginationData.pageLimit
      )
    );
  }, [solitudes]);

  const classes = useStyles();

  //JSX Component
  return (
    <React.Fragment>
      <Container maxWidth="lg" className={classes.container}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Title className={classes.padding8}>Lista de usuarios</Title>

            <Button
              type="submit"
              //fullWidth
              variant="contained"
              color="primary"
              onClick={(e) => {
                ctx.setpreviousPage("/usersTable");
                history.replace("/HomeOperations");
                // registerUser(user);
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
                ctx.setpreviousPage("/usersTable");
                history.replace("/signUpUser");

                // registerUser(user);
              }}
              className={classes.registerButton}
            >
              Crear usuario
            </Button>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Fecha de registro</TableCell>
                  <TableCell>Nombre completo</TableCell>
                  <TableCell>NM</TableCell>
                  <TableCell>Mail</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Editar</TableCell>
                  <TableCell>Borrar</TableCell>
                  <TableCell>Desbloquear</TableCell>
                  {/* <TableCell align="right">Sale Amount</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {listOfUsers.map((solitude) => (
                  <TableRow
                    style={{
                      opacity: solitude.status === "deleted" ? 0.5 : 1,
                      pointerEvents:
                        solitude.status === "deleted" ? "none" : "auto",
                    }}
                    key={solitude.id}
                  >
                    <TableCell className={classes.row}>
                      {convertDateToHumanReadable(solitude.createdAt)}
                    </TableCell>
                    <TableCell>
                      {solitude.name + " " + solitude.lastname}
                    </TableCell>
                    <TableCell>{solitude.nm}</TableCell>
                    <TableCell>{solitude.mail}</TableCell>
                    <TableCell>
                      {solitude.status === "active"
                        ? "Activo"
                        : solitude.status === "blocked"
                        ? "Bloqueado"
                        : "Deshabilitado"}
                    </TableCell>
                    <TableCell>
                      {
                        <IconButton
                          onClick={(e) => {
                            ctx.setpreviousPage("/usersTable");
                            history.push({
                              pathname: "/modifyUser",
                              state: {
                                user: solitude,
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
                        <IconButton>
                          <DeleteIcon />
                        </IconButton>
                      }
                    </TableCell>

                    <TableCell
                      className={
                        solitude.status !== "blocked"
                          ? classes.disabledButton
                          : classes.enabledButton
                      }
                    >
                      {
                        <IconButton
                          onClick={async (e) => {
                            if (solitude.status === "blocked") {
                              const response = await axios.post(
                                "/admin/unblockUser",
                                {
                                  nm: solitude.nm,
                                }
                              );
                              fetchSolitudes();
                            }
                          }}
                        >
                          {" "}
                          <BlockIcon />{" "}
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
