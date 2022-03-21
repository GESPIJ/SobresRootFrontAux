import React, { useState } from "react";
import ReactPDF, {
  Document,
  Font,
  Page,
  Text,
  Image,
  StyleSheet,
  PDFViewer,
  PDFDownloadLink,
  View,
  Link,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  TextoSuperior: {
    //height:"20px",
    fontSize: 10,
  },
  TextoInferior: {
    fontSize: 12,
    textAlign: "center",
  },
});

function CamposTipo1({
  datosPlanilla,
  counter,
  withRightBorder = false,
  withBottomBorder = false,
}) {
  return (
    <div
      style={{
        border: "1px solid black",
        borderRightStyle: withRightBorder ? "solid" : "none",
        borderBottomStyle: withBottomBorder ? "solid" : "none",
        paddingLeft: "5px",
        //borderBottom: "0px",
        width: "33.3333%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        //height: altura,
        //height: counter * 16 + "px",
        //height: (counter + 1) * 28 + "px"
        height: (counter + 1) * 20 + "px",
      }}
    >
      <div style={{ height: "20px" }}>
        <Text style={styles.TextoSuperior}>{datosPlanilla.name}</Text>
      </div>
      <Text />

      {/* <div style={{ textAlign: "center" }}>
      
        {datosPlanilla.value}
   
      </div> */}
      <Text style={styles.TextoInferior}>{datosPlanilla.value}</Text>
    </div>
  );
}

export default CamposTipo1;
