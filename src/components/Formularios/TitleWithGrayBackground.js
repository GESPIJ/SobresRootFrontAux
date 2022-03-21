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
import "./styles/titleWithGrayBackground.css";

const styles = StyleSheet.create({
  Titulo: {
    marginTop: "0px",
    marginBottom: "0px",
    textAlign: "center",
    fontSize: 12,
    fontStyle: "bold",
  },
});

const TitleWithGrayBackground = ({ title }) => {
  return (
    <div
      className="titleWithGreyBackground"

      //   style={{
      //     backgroundColor: "grey",
      //     border: "1px solid black",
      //     borderBottom: "0px solid black",
      //     width: "100%",
      //     textAlign: "center",
      //  }}
    >
      <Text style={styles.Titulo}>{title}</Text>
      {/* <h4 style={{ marginTop: "0px", marginBottom: "0px" }}>{title}</h4> */}
    </div>
  );
};

export default TitleWithGrayBackground;
