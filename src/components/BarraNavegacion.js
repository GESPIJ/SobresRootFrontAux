import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import MyContext from "../context/mycontext";
import axios from "axios";
import socket from "../socket";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },

  AppBarra: {
    minHeight: "80px",
    // backgroundColor: "#9f02bb",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const BarraNavegacion = () => {
  const classes = useStyles();
  const history = useHistory();
  const ctx = useContext(MyContext);

  const cerrandoTab = async () => {
    const response = await axios.post("/admin/closingTab", {
      name: ctx.usuarioActual,
      nm: ctx.nmActual,
    });
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.AppBarra}>
          <Typography variant="h6" className={classes.title}></Typography>

          {ctx.usuarioActual !== "" && (
            <Button
              onClick={async () => {
                if (ctx.isSuccesfullyLogged) {
                  await axios.post("/admin/updateJWToken", {
                    name: ctx.usuarioActual,
                    code: "123",
                  });
                  const messageText =
                    "Usuario " +
                    ctx.usuarioActual +
                    " con nm " +
                    ctx.nmActual +
                    " deslogeado con exito";
                  await axios.post("/admin/registerLog", {
                    message: messageText,
                    solitude: null,
                  });
                  await cerrandoTab();

                  try {
                    socket.disconnect();
                    history.replace("/");
                  } catch (err) {}
                }

                history.replace("/");
              }}
              color="inherit"
            >
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <img className="logoBancoVenezuela" src="/BancoVenezuela2.png" alt="" />
    </div>
  );
};

export default BarraNavegacion;
