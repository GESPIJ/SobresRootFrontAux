import React from "react";
import CamposTipo1 from "./CamposTipo1";

function Fila3Elementos({ counter, datosPlanilla }) {
  return (
    <>
      <CamposTipo1 datosPlanilla={datosPlanilla[0]} counter={counter} />
      <CamposTipo1 datosPlanilla={datosPlanilla[1]} counter={counter} />
      <CamposTipo1
        datosPlanilla={datosPlanilla[2]}
        counter={counter}
        withRightBorder={true}
      />
    </>
  );
}

export default Fila3Elementos;
