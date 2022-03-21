import React, { useEffect, useState, useRef, useContext } from "react";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";

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
import BarraNavegacion from "./BarraNavegacion";
import { makeStyles } from "@material-ui/core/styles";

//Helper functions
import { convertDateToHumanReadable } from "../utils/helper";

import MyContext from "../context/mycontext";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  littleButton: {
    width: "200px",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },

  view: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  leftColumnText: {
    minWidth: "200px",
    fontSize: 16,
    textAlign: "justify",
    fontFamily: "Times-Roman",
    fontWeight: "bold",
  },

  rightColumnText: {
    minWidth: "150px",
    margin: 12,
    fontSize: 16,
    textAlign: "justify",
    fontFamily: "Times-Roman",
  },

  parentView: {
    display: "inline-block",
    width: "500px",
    paddingTop: 60,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },

  title: {
    fontSize: 24,
    textAlign: "center",
    fontFamily: "Oswald",
    //fontWeight: "bold",
  },
  author: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
    fontFamily: "Oswald",
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: "justify",
    fontFamily: "Times-Roman",
  },

  textWithBold: {
    width: 200,
    margin: 12,
    // marginRight: 50,
    fontSize: 14,
    textAlign: "justify",
    fontFamily: "Times-Roman",
    fontWeight: "bold",
    minWidth: "200px",
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100,
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
  littleButton: {
    width: "250px",
  },
});

Font.register({
  family: "Oswald",
  src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
});

const Subtitle = ({ children, ...props }) => (
  <Text style={styles.subtitle} {...props}>
    {children}
  </Text>
);

const MyDocument = (props) => {
  const history = useHistory();
  const ctx = useContext(MyContext);
  const classes = useStyles();

  const showContent = useRef(false);

  const [datosSistemaRoot, setDatosSistemaRoot] = useState(
    props.location && props.location.state
      ? {
          date: props.location.state.date,
          name: props.location.state.name,
          admin: props.location.state.admin,
          ip: props.location.state.ip,
          port: props.location.state.port,
          password: props.location.state.password,
          operator: ctx.usuarioActual,
        }
      : {
          date: new Date().toDateString(),
          name: "Sistema A",
          admin: "Oswaldo",
          ip: "180.183.16.25",
          port: "1050",
          password: "1234abcd",
          operator: "Kris",
        }
  );

  const [enableView, setEnableView] = useState(false);

  useEffect(() => {
    const beforePrintHandler = (e) => {
      console.log("Ya termino el tiempo en el before print");
    };

    const afterPrintHandler = (e) => {
      history.replace("/waitingForPrint");
      console.log("La impresión termino");
      console.log(e);
      setEnableView(false);
    };
    window.addEventListener("beforeprint", beforePrintHandler);
    window.addEventListener("afterprint", afterPrintHandler);

    setEnableView(true);
  }, []);

  useEffect(() => {
    if (enableView) {
      window.print();
    }
  }, [enableView]);

  return (
    <React.Fragment>
      {/* <PDFViewer
        showToolbar={false}
        height="780px"
        width="960px"
        onAfterPrint={() => {
          history.push("/waitingForPrint");
          console.log("La impresión termino");
        }}
      > */}
      {enableView && (
        <div
          style={{
            padding: "50px",
            paddingLeft: "70px",
            paddingTop: "80px",
            textAlign: "justify",
          }}
        >
          <Document>
            <Page size="A4">
              {/* <Link
                style={styles.title}
                src="https://es.wikipedia.org/wiki/Lorem_ipsum"
              >
                Lorem Ipsum
              </Link> */}
              <Text style={styles.title}>
                Solicitud sobre root para el {datosSistemaRoot.name} en fecha{" "}
                {convertDateToHumanReadable(datosSistemaRoot.date)}
              </Text>
              <br />
              <br />

              <View style={styles.parentView}>
                <View style={styles.view}>
                  <Text style={styles.leftColumnText}>{"Nombre "}</Text>
                  <Text style={styles.rightColumnText}>
                    {datosSistemaRoot.name}
                  </Text>
                  {/* <View style={styles.fill1} /> */}
                </View>
                <br />

                <View style={styles.view}>
                  <Text style={styles.leftColumnText}>
                    {"Persona de operaciones a cargo "}
                  </Text>
                  <Text style={styles.rightColumnText}>
                    {datosSistemaRoot.operator}
                  </Text>
                  {/* <View style={styles.fill1} /> */}
                </View>
                <br />

                <View style={styles.view}>
                  <Text style={styles.leftColumnText}>{"Administrador "}</Text>
                  <Text style={styles.rightColumnText}>
                    {datosSistemaRoot.admin}
                  </Text>
                  {/* <View style={styles.fill1} /> */}
                </View>
                <br />

                <View style={styles.view}>
                  <Text style={styles.leftColumnText}>{"Ip y puerto"}</Text>
                  <Text style={styles.rightColumnText}>
                    {datosSistemaRoot.ip + ":" + datosSistemaRoot.port}
                  </Text>
                  {/* <View style={styles.fill1} /> */}
                </View>
                <br />

                <View style={styles.view}>
                  <Text style={styles.leftColumnText}>{"Clave"}</Text>
                  <Text style={styles.rightColumnText}>
                    {datosSistemaRoot.password}
                  </Text>
                  {/* <View style={styles.fill1} /> */}
                </View>
                <br />
              </View>
            </Page>
          </Document>
        </div>
      )}
      {/* </PDFViewer> */}
      <br />
      {!enableView && (
        <Button
          onClick={() => {
            //showContent.current = true;
            setEnableView(true);
            //   setTimeout(() => {
            //     console.log("It's working");
            //     window.print();
            //   }, 2000);
          }}
          //color="inherit"
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.littleButton}
        >
          Print
        </Button>
      )}
    </React.Fragment>
  );
};

export default MyDocument;
