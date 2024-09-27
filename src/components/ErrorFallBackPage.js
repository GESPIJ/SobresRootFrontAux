import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import BarraNavegacion from "./BarraNavegacion";
import Button from "@material-ui/core/Button";
import MyContext from "../context/mycontext";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
    width: 200,
  },
}));

const ErrorFallBackPage = ({ redirectFcn }) => {
  const history = useHistory();
  const ctx = useContext(MyContext);
  const classes = useStyles();

  const redirectToLogin = () => {
    history.replace("/");
  };

  return (
    <div className="signup">
      <BarraNavegacion />
      <p>Usted no esta autorizado para ver esta pagina, favor inicie sesión</p>
      <Button
        variant="contained"
        color="primary"
        className={classes.submit}
        onClick={() => {
          ctx.setusuarioActual("/11");
          redirectToLogin();
        }}
      >
        Iniciar sesión
      </Button>
    </div>
  );
};

export default ErrorFallBackPage;
