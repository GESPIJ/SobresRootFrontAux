import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import { Container, Paper, Button, IconButton } from "@material-ui/core";
import CreateIcon from "@material-ui/icons/Create";
import DeleteIcon from "@material-ui/icons/Delete";
import Grid from "@material-ui/core/Grid";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Title from "./Title";
import MyContext from "../../context/mycontext";
import TablePagination from "@material-ui/core/TablePagination";

//Helper functions
import { convertDateToHumanReadable } from "../../utils/helper";

//Component Styles
const useStyles = makeStyles((theme) => ({
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
}));

export default function Orders({ solitudes }) {
  //Component States

  //Context
  const ctx = useContext(MyContext);
  const [listOfPrinters, setlistOfPrinters] = useState(solitudes.slice(0, 5));
  const [paginationData, setpaginationData] = useState({
    actualPage: 0,
    pageLimit: 5,
  });
  const history = useHistory();

  //Component Functions

  //Handler for going back and forward over the table
  const handleChangePage = (e) => {
    let newActualPage =
      e.currentTarget.ariaLabel === "Next page"
        ? paginationData.actualPage + 1
        : paginationData.actualPage - 1;
    //We calculate the new portion of array users to show based on the new user selected page
    let newPaginatedListOfUsers = solitudes.slice(
      newActualPage * paginationData.pageLimit,
      (newActualPage + 1) * paginationData.pageLimit
    );

    //We update the states
    setpaginationData({ ...paginationData, actualPage: newActualPage });
    setlistOfPrinters(newPaginatedListOfUsers);
  };

  //Handler for changing the number of users to show in every page
  const handleChangeRowsPerPage = (e) => {
    let newRowsPerPage = e.target.value;
    //We calculate the new portion of users Array to show based on the new Rows per page value
    let newPaginatedUsers = solitudes.slice(
      paginationData.actualPage * newRowsPerPage,
      (paginationData.actualPage + 1) * newRowsPerPage
    );

    //We update the State
    setpaginationData({ ...paginationData, pageLimit: newRowsPerPage });
    setlistOfPrinters(newPaginatedUsers);
  };

  //Everytime the user change we recalculate the portion of users to show
  useEffect(() => {
    setlistOfPrinters(
      solitudes.slice(
        paginationData.actualPage * paginationData.pageLimit,
        (paginationData.actualPage + 1) * paginationData.pageLimit
      )
    );
  }, [solitudes]);
  const classes = useStyles();
  return (
    <React.Fragment>
      <Container maxWidth="lg" className={classes.container}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Title>Lista de impresoras</Title>
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
                ctx.setpreviousPage("/printersTable");
                history.replace("/signUpSystem");
              }}
              className={classes.registerButton}
            >
              Crear Impresora
            </Button>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Fecha de Registro</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Ip</TableCell>
                  <TableCell>Puerto</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Editar</TableCell>
                  <TableCell>Borrar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listOfPrinters.map((solitude) => (
                  <TableRow key={solitude.id}>
                    <TableCell className={classes.row}>
                      {convertDateToHumanReadable(solitude.createdAt)}
                    </TableCell>
                    <TableCell>{solitude.name}</TableCell>
                    <TableCell>{solitude.ip}</TableCell>
                    <TableCell>{solitude.port}</TableCell>
                    <TableCell>{solitude.state}</TableCell>
                    <TableCell>
                      {
                        <IconButton
                          onClick={(e) => {
                            console.log("Click en el lapiz");
                            ctx.setpreviousPage("/printersTable");
                            history.push({
                              pathname: "/modifyPrinter",
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
                        <IconButton>
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
              rowsPerPageOptions={[5, 8, 12]}
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
