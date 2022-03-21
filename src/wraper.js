import React, { useState } from "react";
import { createMuiTheme } from "@material-ui/core";
import Brightness5Icon from "@material-ui/icons/Brightness5";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import IconButton from "@material-ui/core/IconButton";
import { ThemeProvider } from "@material-ui/core/styles";

const Wraper = (props) => {
  //const theme = React.useMemo(() => {}, []);
  const [selectedTheme, setselectedTheme] = useState("light");

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: selectedTheme,
        },
      }),
    [selectedTheme]
  );

  return (
    <div>
      {/* <h2>Hola</h2> */}
      <ThemeProvider theme={theme}>
        {props.children}
        <IconButton
          aria-label="Cambiar Tema"
          onClick={() =>
            setselectedTheme((selected) =>
              selected === "dark" ? "light" : "dark"
            )
          }
          style={{ position: "absolute", bottom: 0, right: 0 }}
        >
          {selectedTheme === "dark" ? <Brightness5Icon /> : <Brightness4Icon />}
        </IconButton>
      </ThemeProvider>
    </div>
  );
};

export default Wraper;
