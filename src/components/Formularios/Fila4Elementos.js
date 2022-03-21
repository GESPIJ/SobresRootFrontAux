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
  Texto: {
    textAlign: "center",
    fontSize: 10,
    fontWeight: 400,
  },
  // TextoInferior: {
  //   fontSize: 12,
  //   textAlign: "center",
  // },
});

const Fila4Elementos = ({ elementos, withBottomBorder }) => {
  return (
    <>
      {elementos.map((elemento) => {
        return (
          <div
            style={{
              border: "1px solid black",
              borderRightStyle: elemento.withRightBorder ? "solid" : "none",
              borderBottomStyle: withBottomBorder ? "solid" : "none",
              width: elemento.width,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              height: elemento.height ? elemento.height : "40px",
              //height: altura,
              //height: counter * 16 + "px",
            }}
          >
            <Text style={styles.Texto}>{elemento.value}</Text>
            {/* <div
              style={{
                textAlign: elemento.textAlign ? elemento.textAlign : "center",
              }}
            >
             
              {elemento.value}
            
            </div>*/}
          </div>
        );
      })}
    </>
  );
};

export default Fila4Elementos;

//{
/* <Fila4Elementos
  elementos={[
    { width: "19%", value: "Total monto reclamado" },
    {
      width: "27%",
      value: datosPlanilla.Total_Monto_Reclamado,
    },
    { width: "27%", value: "Numero de TX reclamadas" },
    {
      width: "27%",
      value: datosPlanilla.Total_TX_Reclamadas,
    },
  ]}
/>; */
//}
