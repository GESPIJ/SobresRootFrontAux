import React from "react";
import MyContext from "./context/mycontext";
function boton() {
  return (
    <MyContext.Consumer>
      {(context) => {
        return (
          <div
            style={{ position: "relative", top: "60px" }}
            onClick={() => {
              console.log("Estoy presionando el boton");
              context.numero = "Siete";
              //debugger;
              context.cambiarNumero();
              context.cambiarCounter((prev) => prev + 1);
            }}>
            {context.numero}
          </div>
        );
      }}
    </MyContext.Consumer>
  );
}

export default boton;
