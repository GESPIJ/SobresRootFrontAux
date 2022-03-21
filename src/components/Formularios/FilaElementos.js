import React from "react";
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
    fontStyle: "normal",
    fontSize: 10,
    fontWeight: 400,
  },
  TextoInferior: {
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: 400,
    textAlign: "center",
  },
  TextoInferiorTipo2: {
    fontSize: 10,
    fontStyle: "normal",
    fontWeight: 400,
    textAlign: "center",
  },
});

const Fila4Elementos = ({ elementos, withBottomBorder }) => {
  return (
    <>
      {elementos.map((datosPlanilla) => {
        return (
          <div
            style={{
              border: "1px solid black",
              borderRightStyle: datosPlanilla.withRightBorder
                ? "solid"
                : "none",
              borderBottomStyle: datosPlanilla.withBottomBorder
                ? "solid"
                : "none",
              //paddingLeft: "5px",
              //borderBottom: "0px",
              width: datosPlanilla.width,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              //height: altura,
              //height: counter * 16 + "px",
              //height: (counter + 1) * 28 + "px"
              //height: (counter + 1) * 20 + "px",
              height: datosPlanilla.height ? datosPlanilla.height : "40px",
            }}
          >
            <div style={{ height: datosPlanilla.tipo2 ? "15px" : "20px" }}>
              <Text style={styles.TextoSuperior}>{datosPlanilla.name}</Text>
            </div>

            {/* <div style={{ textAlign: "center" }}>
              
                {datosPlanilla.value}
           
              </div> */}
            <div style={{ textAlign: "center" }}>
              <Text
                style={
                  datosPlanilla.tipo2
                    ? styles.TextoInferiorTipo2
                    : styles.TextoInferior
                }
              >
                {datosPlanilla.value}
              </Text>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Fila4Elementos;
