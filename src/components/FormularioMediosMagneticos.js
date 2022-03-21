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
import moment from "moment";

//Helper functions
import { convertDateToHumanReadable } from "../utils/helper";

import MyContext from "../context/mycontext";
import "./PaginaFormularios.css";

//COMPONENTES DE LOS FORMULARIOS
import TitleWithGrayBackground from "./Formularios/TitleWithGrayBackground";
import Fila3Elementos from "./Formularios/Fila3Elementos";
import Fila4Elementos from "./Formularios/Fila4Elementos";
import CamposTipo1 from "./Formularios/CamposTipo1";
import TextoDescripcionHechos from "./Formularios/TextoDescripcionHechos";

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
    //paddingTop: 85,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },

  primeraFilaMembrete: {
    border: "1px solid black",
    borderBottom: "0px solid black",
    backgroundColor: "grey",
    textAlign: "center",
  },

  titleWithGreyBackground: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    //backgroundColor: "grey",
    backgroundColor: "#E4E4E4",
  },

  firstMultiline: {
    height: "20px",
    marginTop: "8px",
    marginBottom: "8px",
    display: "block",
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
    width: "100%",
    paddingTop: 150,
    paddingBottom: 30,
    paddingHorizontal: 35,
  },

  title: {
    fontSize: 16,
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
    height: "50px",
    width: "100px",
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
  page: {
    paddingBottom: 40,
    marginBottom: 30,
  },
  document: {
    paddingBottom: 40,
    marginBottom: 30,
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
      //history.replace("/waitingForPrint");
      console.log("La impresión termino");
      console.log(e);
      // setEnableView(false);
    };
    window.addEventListener("beforeprint", beforePrintHandler);
    window.addEventListener("afterprint", afterPrintHandler);

    setEnableView(true);
  }, []);

  const [counter, setcounter] = useState(1);
  const [altura, setaltura] = useState("16px");
  const [entrada1, setentrada1] = useState("");
  const [texto, settexto] = useState("");
  const [formattedText, setformattedText] = useState("");
  const [datosPlanilla, setdatosPlanilla] = useState({
    Nombre_del_Cliente: "ARELIS JOSEFINA MUNOZ",
    Cedula_RIF_Cliente: "V-6.951.584",
    Numero_Cuenta_Cliente: "0102-0107-14-00-00138312",
    Numero_Tarjeta_Cliente: "5899-4162-2175-6589",
    Numero_SAKE_Cliente: "40508178",
    Fecha_UltimoUso_Tarjeta_Cliente: "06/09/2021",
    Fecha_Inicio: "05/09/2021",
    Fecha_Fin: "05/09/2021",
    Fecha_Bloqueo: "07/09/2021",
    Total_Monto_Reclamado: "54.000.000",
    Total_TX_Reclamadas: "3",
    Monto_Reclamado: {
      ATM: "0,00",
      POS: "54.000.000,00",
      TDC: "0,00",
      Credicompra: "0,00",
      Otras_Operaciones: "0,00",
      Comisiones: "0,00",
    },
    Monto_Salvado: {
      ATM: "0,00",
      POS: "0,00",
      TDC: "0,00",
      Credicompra: "0,00",
      Otras_Operaciones: "0,00",
      Comisiones: "0,00",
    },
    Monto_Sujeto_Decision: {
      ATM: "0,00",
      POS: "54.000.000,00",
      TDC: "0,00",
      Credicompra: "0,00",
      Otras_Operaciones: "0,00",
      Comisiones: "0,00",
    },
    Numero_TX: {
      ATM: "0",
      POS: "3",
      TDC: "0",
      Credicompra: "0",
      Otras_Operaciones: "0",
      Comisiones: "0",
    },
  });

  //   useEffect(() => {
  //     let newHeight = counter * 16 + "px";
  //     setaltura(newHeight);
  //   }, [counter]);

  useEffect(() => {
    //debugger;
    const elementoFinal = document.getElementById("elemento-final");
    if (elementoFinal) {
      let difference = 1980 - elementoFinal.offsetTop;
      //debugger;
      elementoFinal.style.height = difference + "px";
    }

    if (enableView) {
      // window.print();
    }
  }, [enableView]);

  return (
    <React.Fragment>
      {/* <div class="header">Hola</div> */}
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
            padding: "40px",
            // paddingLeft: "70px",
            paddingTop: "0px",
            textAlign: "justify",
          }}
        >
          <div
            className={"page-header"}
            //ref={myRef}
            style={{
              paddingRight: "2.7px",
              paddingLeft: "30px",
              position: "fixed",
              top: "0px",
              left: "10px",
              width: "90%",
              height: "71px",
              backgroundColor: "white",
            }}
          >
            <div style={{ borderColor: "#000000", maxWidth: "100%" }}>
              <div style={{ display: "flex" }}>
                <img
                  src={"/bdv_logo_large_rif.png"}
                  alt="Banco de Venezuela"
                  style={{ maxWidth: "200px" }}
                  //onLoad={() => window.print()}
                />
              </div>
            </div>
            <DateHeader />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "10px",
                fontSize: "9px",
                fontWeight: "bolder",
              }}
            >
              <span>ACTA DE ANÁLISIS PARA RECLAMOS MEDIOS MAGNÉTICOS</span>
            </div>
          </div>
          <table className="report-container">
            <thead className="report-header">
              <tr>
                <th className="report-header-cell">
                  <div
                    style={{
                      height: "240px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <div style={{ height: "45px" }}></div>
                    <View style={styles.view}>
                      {/* <Text style={styles.titleWithGreyBackground}>
                    Datos del reclamo
                  </Text> */}
                      <TitleWithGrayBackground title="DATOS DEL RECLAMO" />
                    </View>
                    <View style={styles.view}>
                      <Fila3Elementos
                        counter={counter}
                        datosPlanilla={[
                          {
                            value: datosPlanilla.Nombre_del_Cliente,
                            name: "Nombre del cliente:",
                          },
                          {
                            name: "C.I./ R.I.F. / Pasaporte",
                            value: datosPlanilla.Cedula_RIF_Cliente,
                          },
                          {
                            name: "Número de Cuenta:",
                            value: formattedText,
                          },
                          // datosPlanilla.Cedula_RIF_Cliente,
                          // formattedText,
                        ]}
                      />
                      {/* <CamposTipo1
                    counter={counter}
                    datosPlanilla={datosPlanilla.Nombre_del_Cliente}
                  />
                  <CamposTipo1
                    counter={counter}
                    datosPlanilla={datosPlanilla.Cedula_RIF_Cliente}
                  />
                  <CamposTipo1
                    counter={counter}
                    datosPlanilla={datosPlanilla.Numero_Cuenta_Cliente}
                  /> */}

                      {/* <Text style={styles.leftColumnText}>{"Nombre "}</Text>
                  <Text style={styles.rightColumnText}>
                    {datosSistemaRoot.name}
                  </Text> */}
                      {/* <View style={styles.fill1} /> */}
                    </View>
                    <View style={styles.view}>
                      <Fila3Elementos
                        counter={1}
                        datosPlanilla={[
                          {
                            name: "Número de Tarjeta",
                            value: datosPlanilla.Numero_Tarjeta_Cliente,
                          },
                          {
                            name: "Numero de S.A.K.E",
                            value: datosPlanilla.Numero_SAKE_Cliente,
                          },
                          {
                            name: "Fecha ultimo uso de tarjeta",
                            value:
                              datosPlanilla.Fecha_UltimoUso_Tarjeta_Cliente,
                          },
                        ]}
                      />
                    </View>
                    <View style={styles.view}>
                      <Fila3Elementos
                        counter={1}
                        datosPlanilla={[
                          {
                            name: "Fecha Inicio:",
                            value: datosPlanilla.Fecha_Inicio,
                          },
                          {
                            name: "Fecha Fin:",
                            value: datosPlanilla.Fecha_Fin,
                          },
                          {
                            name: "Fecha de Bloqueo:",
                            value: datosPlanilla.Fecha_Bloqueo,
                          },
                        ]}
                      />
                    </View>
                    <View style={styles.view}>
                      <Fila4Elementos
                        withBottomBorder={true}
                        elementos={[
                          {
                            width: "19%",
                            value: "Total monto reclamado",
                            textAlign: "left",
                          },
                          {
                            width: "27%",
                            value: datosPlanilla.Total_Monto_Reclamado,
                          },
                          {
                            width: "27%",
                            value: "Numero de TX reclamadas",
                          },
                          {
                            width: "27%",
                            value: datosPlanilla.Total_TX_Reclamadas,
                            withRightBorder: true,
                          },
                        ]}
                      />
                    </View>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="report-content">
              <tr>
                <td className="report-content-cell">
                  <div style={{ paddingTop: "1px" }}>
                    <Document style={styles.document}>
                      <Page size="A2" style={styles.page} debug>
                        {/* <Link
                style={styles.title}
                src="https://es.wikipedia.org/wiki/Lorem_ipsum"
              >
                Lorem Ipsum
              </Link> */}
                        {/* <Text style={styles.title}>
                ACTA DE ANALISIS PARA RECLAMOS MEDIOS MAGNÉTICOS
              </Text> */}
                        {/* <img
                        width="100px"
                        style={styles.image}
                        src="/BancoVenezuela.jpg" */}
                        {/* /> */}

                        <View style={styles.view}>
                          <TitleWithGrayBackground title="DISTRIBUCION DEL MONTO RECLAMADO" />
                        </View>
                        <View style={styles.view}>
                          <Fila4Elementos
                            elementos={[
                              {
                                width: "13.6%",
                                value: "Monto",
                                height: "38px",
                              },
                              { width: "14.4%", value: "ATM", height: "38px" },
                              { width: "14.4%", value: "POS", height: "38px" },
                              {
                                width: "14.4%",
                                value: "Adelanto Taquilla TDC",
                                height: "38px",
                              },
                              {
                                width: "14.4%",
                                value: "Credicompra",
                                height: "38px",
                              },
                              {
                                width: "14.4%",
                                value: "Otras Operaciones",
                                height: "38px",
                              },
                              {
                                width: "14.4%",
                                value: "Comisiones",
                                height: "38px",
                                withRightBorder: true,
                              },
                            ]}
                          />
                        </View>
                        <View style={styles.view}></View>
                        <View style={styles.view}>
                          <Fila4Elementos
                            elementos={[
                              {
                                width: "13.6%",
                                value: "Monto Reclamado",
                                height: "38px",
                              },
                              {
                                width: "14.4%",
                                value: datosPlanilla.Monto_Reclamado.ATM,
                                height: "38px",
                              },
                              {
                                width: "14.4%",
                                value: datosPlanilla.Monto_Reclamado.POS,
                                height: "38px",
                              },
                              {
                                width: "14.4%",
                                value: datosPlanilla.Monto_Reclamado.TDC,
                                height: "38px",
                              },
                              {
                                width: "14.4%",
                                value:
                                  datosPlanilla.Monto_Reclamado.Credicompra,
                                height: "38px",
                              },
                              {
                                width: "14.4%",
                                value:
                                  datosPlanilla.Monto_Reclamado
                                    .Otras_Operaciones,
                                height: "38px",
                              },
                              {
                                width: "14.4%",
                                value: datosPlanilla.Monto_Reclamado.Comisiones,
                                height: "38px",
                                withRightBorder: true,
                              },
                            ]}
                          />
                        </View>
                        <View style={styles.view}>
                          <Fila4Elementos
                            elementos={[
                              {
                                width: "13.6%",
                                value: "Monto Salvado",
                                height: "38px",
                              },
                              {
                                width: "14.4%",
                                value: datosPlanilla.Monto_Salvado.ATM,
                                height: "38px",
                              },
                              {
                                width: "14.4%",
                                value: datosPlanilla.Monto_Salvado.POS,
                                height: "38px",
                              },
                              {
                                width: "14.4%",
                                value: datosPlanilla.Monto_Reclamado.TDC,
                                height: "38px",
                              },
                              {
                                width: "14.4%",
                                value: datosPlanilla.Monto_Salvado.Credicompra,
                                height: "38px",
                              },
                              {
                                width: "14.4%",
                                value:
                                  datosPlanilla.Monto_Salvado.Otras_Operaciones,
                                height: "38px",
                              },
                              {
                                width: "14.4%",
                                value: datosPlanilla.Monto_Salvado.Comisiones,
                                height: "38px",
                                withRightBorder: true,
                              },
                            ]}
                          />
                        </View>
                        <View style={styles.view}>
                          <Fila4Elementos
                            elementos={[
                              {
                                width: "13.6%",
                                value: "Monto Sujeto Decision",
                                height: "38px",
                              },
                              {
                                width: "14.4%",
                                value: datosPlanilla.Monto_Sujeto_Decision.ATM,
                                height: "38px",
                              },
                              {
                                width: "14.4%",
                                value: datosPlanilla.Monto_Sujeto_Decision.POS,
                                height: "38px",
                              },
                              {
                                width: "14.4%",
                                value: datosPlanilla.Monto_Sujeto_Decision.TDC,
                                height: "38px",
                              },
                              {
                                width: "14.4%",
                                value:
                                  datosPlanilla.Monto_Sujeto_Decision
                                    .Credicompra,
                                height: "38px",
                              },
                              {
                                width: "14.4%",
                                value:
                                  datosPlanilla.Monto_Sujeto_Decision
                                    .Otras_Operaciones,
                                height: "38px",
                              },
                              {
                                width: "14.4%",
                                value:
                                  datosPlanilla.Monto_Sujeto_Decision
                                    .Comisiones,
                                height: "38px",
                                withRightBorder: true,
                              },
                            ]}
                          />
                        </View>
                        <View style={styles.view}>
                          <Fila4Elementos
                            elementos={[
                              {
                                width: "13.6%",
                                value: "Numero de TX",
                                height: "38px",
                              },
                              {
                                width: "14.4%",
                                value: datosPlanilla.Numero_TX.ATM,
                                height: "38px",
                              },
                              {
                                width: "14.4%",
                                value: datosPlanilla.Numero_TX.POS,
                                height: "38px",
                              },
                              {
                                width: "14.4%",
                                value: datosPlanilla.Numero_TX.TDC,
                                height: "38px",
                              },
                              {
                                width: "14.4%",
                                value: datosPlanilla.Numero_TX.Credicompra,
                                height: "38px",
                              },
                              {
                                width: "14.4%",
                                value:
                                  datosPlanilla.Numero_TX.Otras_Operaciones,
                                height: "38px",
                              },
                              {
                                width: "14.4%",
                                value: datosPlanilla.Numero_TX.Comisiones,
                                height: "38px",
                                withRightBorder: true,
                              },
                            ]}
                          />
                        </View>
                        <View style={styles.view}>
                          <TitleWithGrayBackground title="DESCRIPCION DE LOS HECHOS" />
                        </View>
                        <View
                        //style={styles.view}
                        >
                          <div
                            style={{
                              border: "1px solid black",
                              paddingLeft: "5px",
                              paddingRight: "5px",
                              paddingTop: "5px",
                            }}
                          >
                            <TextoDescripcionHechos />
                          </div>
                          <FactsDescription />
                        </View>
                        <View>
                          <ManagementAnalysis />
                        </View>
                        <View>
                          <div style={{ borderBottom: "solid black 1px" }}>
                            <PreliminaryDecision />
                          </div>
                        </View>
                        {/* <Text
                style={styles.pageNumber}
                render={({ pageNumber, totalPages }) =>
                  `${pageNumber} / ${totalPages}`
                }
                fixed
              /> */}
                      </Page>
                    </Document>
                  </div>
                  <div
                    id="elemento-final"
                    style={{ height: "1px", display: "block" }}
                  ></div>
                </td>
              </tr>
            </tbody>
            <tfoot className="report-footer">
              <tr>
                <td className="report-footer-cell">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      height: "100px",
                    }}
                  >
                    <div style={{ height: "30px" }}></div>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>

          <div
            className={"page-footer"}
            style={{
              display: "flex",
              flexDirection: "column",
              alignContent: "space-between",
              justifyContent: "flex-end",
              position: "fixed",
              bottom: "0px",
              backgroundColor: "white",
              height: "60px",
              width: "90%",
              //right: "20px",
            }}
          >
            <div style={{ fontSize: "9px" }}>
              <strong>SOE.262 (11-19)</strong>
            </div>
            <div
              style={{
                borderStyle: "solid none none none",
                borderWidth: "thin",
                marginRight: "120px",
                borderColor: "lightgray",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <img
                src={"/footer_img.png"}
                alt="Banco de Venezuela"
                style={{ width: "100px" }}
              />
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <div style={{ fontSize: "9px", marginRight: "7px" }}>
                  Confidencial
                </div>
                <div>
                  <img
                    src={"/pentagon.jpg"}
                    alt="Banco de Venezuela"
                    style={{ width: "20px" }}
                  />
                </div>
              </div>
            </div>
          </div>
          <form>
            <input
              style={{ display: "block" }}
              onChange={(e) => {
                //debugger;
                //setentrada1(e.target.value);
                setdatosPlanilla({
                  ...datosPlanilla,
                  Nombre_del_Cliente: e.target.value,
                });
              }}
              label="Entrada"
              placeholder="Nombre del cliente"
            ></input>
            {/* <label>Cedula o RIF del cliente</label> */}
            <input
              style={{ display: "block" }}
              label="CedulaORIF"
              placeholder="CedulaRIF"
              onChange={(e) => {
                setdatosPlanilla({
                  ...datosPlanilla,
                  Cedula_RIF_Cliente: e.target.value,
                });
              }}
            ></input>
            <input
              style={{ display: "block" }}
              label="Numero de cuenta"
              placeholder="Numero de cuenta"
              onChange={(e) => {
                setdatosPlanilla({
                  ...datosPlanilla,
                  Numero_Cuenta_Cliente: e.target.value,
                });
              }}
            ></input>
          </form>
          <textarea
            onChange={(e) => {
              settexto(e.target.value);
            }}
          ></textarea>
          <button
            onClick={() => {
              console.log(texto);
              let sentences = texto.split("\n");
              let numberOfRows = sentences.length;

              let newHTMLSentences = sentences.map((sentence) => (
                //   <Text style={styles.firstMultiline}>{sentence}</Text>
                <div>{sentence}</div>
              ));
              //settexto(newHTMLSentences);
              setformattedText(newHTMLSentences);
              // debugger;
              setcounter(numberOfRows);
            }}
          >
            {counter}
          </button>
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

function FactsDescription() {
  const classes = useStyles();
  //console.log(globalResponseData.descripcion_hechos);
  //debugger;

  return (
    <>
      <div
        style={{
          display: "flex",
          flexGrow: 1,
          borderStyle: "solid",
          borderWidth: "thin",
          fontSize: "7.5px",
          fontWeight: "900",
          //padding: "2px"
        }}
      >
        <div
          style={{
            flexGrow: 1,
            textAlign: "center",
            width: "30%",
            borderStyle: "none solid none none",
            borderWidth: "thin",
            padding: "3px",
          }}
        >
          ALERTA DE MONITOREO:
        </div>
        <div
          style={{
            flexGrow: 1,
            textAlign: "center",
            width: "35%",
            borderStyle: "none solid none none",
            borderWidth: "thin",
            padding: "3px",
          }}
        >
          GESTIÓN DE ALERTA:
        </div>
        <div
          style={{
            flexGrow: 1,
            textAlign: "center",
            width: "35%",
            //borderStyle: "none solid none none",
            borderWidth: "thin",
            padding: "3px",
          }}
        >
          NOTIFICACIÓN SMS:
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexGrow: 1,
          borderStyle: "none solid",
          borderWidth: "thin",
          fontSize: "8px",
          fontWeight: "bolder",
          //padding: "2px"
        }}
      >
        <div
          style={{
            flexGrow: 1,
            textAlign: "center",
            width: "30%",
            borderStyle: "none solid none none",
            borderWidth: "thin",
            padding: "3px",
          }}
        >
          <div
            style={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <FillableOptionCheck
              title={"SI"}
              selected={true}
              //selected={globalResponseData.alerta_monitoreo}
            />
            <FillableOptionCheck
              title={"NO"}
              selected={false}
              //selected={!globalResponseData.alerta_monitoreo}
            />
          </div>
        </div>
        <div
          style={{
            flexGrow: 1,
            textAlign: "center",
            width: "35%",
            borderStyle: "none solid none none",
            borderWidth: "thin",
            padding: "3px",
          }}
        >
          <div
            style={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <FillableOptionCheck
              title={"SI"}
              selected={false}
              //selected={globalResponseData.gestion_alerta}
            />
            <FillableOptionCheck
              title={"NO"}
              selected={true}
              //selected={!globalResponseData.gestion_alerta}
            />
          </div>
        </div>
        <div
          style={{
            flexGrow: 1,
            textAlign: "center",
            width: "35%",
            //borderStyle: "none solid none none",
            borderWidth: "thin",
            padding: "3px",
          }}
        >
          <div
            style={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <FillableOptionCheck
              title={"SI"}
              selected={true}
              //selected={globalResponseData.notificacion_sms}
            />
            <FillableOptionCheck
              title={"NO"}
              selected={false}
              // selected={!globalResponseData.notificacion_sms}
            />
          </div>
        </div>
      </div>
      <div
        style={{
          fontSize: "7.5px",
          display: "flex",
          borderStyle: "solid solid none solid",
          borderWidth: "thin",
        }}
      >
        <div
          style={{
            width: "42%",
            borderStyle: "none solid none none",
            borderWidth: "thin",
          }}
        >
          Tipificación Identificada en el Reclamo:
        </div>
        <div style={{ width: "58%" }}>
          Hola
          {/* //{globalResponseData.tipificacion_identificada_reclamo} */}
        </div>
      </div>
    </>
  );
}

function DateHeader() {
  const [globalDate, setglobalDate] = useState("11/16/2021");
  const classes = useStyles();

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          position: "absolute",
          top: "20px",
          right: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderStyle: "solid",
            borderWidth: "thin",
            paddingLeft: "4px",
            paddingRight: "3px",
            //maxWidth: "280px",
            //marginBottom: "12px",
          }}
          //className={classes.dateColumn}
        >
          <div
            className="titleWithGreyBackground"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#afaeae",
              padding: "4px",
              borderColor: "#000000",
              borderStyle: "none none solid none",
              borderWidth: "thin",
              fontSize: "7px",
            }}
            //className={classes.dateHeader}
          >
            <strong>FECHA DE ELABORACIÓN</strong>
          </div>
          <div
            //className={classes.dateBody}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "8px",
            }}
          >
            {
              //globalResponseData["fecha_elaboracion"]
              //?
              moment(
                new Date(
                  globalDate
                  //`${globalResponseData["fecha_elaboracion"]}T00:00:00`
                )
              ).format("DD/MM/YYYY")
              //: "23/05/2021"
            }
          </div>
        </div>
      </div>
    </>
  );
}

function FillableOptionCheck({ title = "TEST", selected = false }) {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            borderStyle: "solid",
            width: "11px",
            height: "11px",
            borderWidth: "thin",
            //marginRight: "2px",
            fontSize: "0.6em",
            fontWeight: "bold",
          }}
        >
          {/*{selected ? <span>&#10003;</span> : ''}*/}
          {selected ? (
            <img
              src={"/check_mark.png"}
              alt="Banco de Venezuela"
              style={{ maxWidth: "8.5px" }}
            />
          ) : (
            ""
          )}
        </div>
        <div
          style={{ fontSize: "0.78em", fontWeight: "bold", marginTop: "2px" }}
        >
          {title}
        </div>
      </div>
    </>
  );
}

function ManagementAnalysis() {
  //const classes = useStyles();

  return (
    <>
      <div
        className="titleWithGreyBackground"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#afaeae",
          padding: "0.5px",
          borderColor: "#000000",
          borderStyle: "solid",
          borderWidth: "thin",
          fontSize: "8px",
        }}
        //className={classes.header}
      >
        <strong>ANÁLISIS DE LA GERENCIA DETECCIÓN Y ÁNALISIS DE FRAUDE</strong>
      </div>
      <div
        style={{
          borderStyle: "none solid",
          borderWidth: "thin",
          padding: "4px",
          fontSize: "10px",
        }}
      >
        Se recomienda declarar el caso NO PROCEDENTE debido a que las
        transacciones reclamadas se efectuaron con las credenciales y
        validaciones de seguridad del cliente a través del canal BDVenlínea.
        Vale acotar que la contraseña y los métodos de autenticación son de
        carácter personal, confidencial, secreto e intransferibles, siendo
        responsabilidad del cliente la guarda y custodia de los mismos.
        {/* {globalResponseData.analisis_gerencia_descripcion} */}
      </div>
    </>
  );
}

function PreliminaryDecision() {
  const classes = useStyles();

  return (
    <>
      <div
        //className=classes.header
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#afaeae",
          padding: "0.5px",
          borderColor: "#000000",
          borderStyle: "solid",
          borderWidth: "thin",
          fontSize: "8px",
        }}
      >
        <strong>
          DECISIÓN PRELIMINAR DE LA GERENCIA DETECCIÓN Y ÁNALISIS DE FRAUDE
        </strong>
      </div>
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "space-around",
          borderStyle: "none solid",
          borderWidth: "thin",
        }}
      >
        <FillableOptionCheck
          title={"Aprobado"}
          //  selected={globalResponseData.decision_preliminar === "aprobado"}
          selected={true}
        />
        <FillableOptionCheck
          title={"Negado"}
          //selected={globalResponseData.decision_preliminar === "negado"}
          selected={false}
        />
      </div>
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          fontSize: "8px",
          borderStyle: "solid",
          borderWidth: "thin",
        }}
      >
        <div style={{ flexGrow: 1, width: "52%", padding: "1px" }}>
          Remitir caso a protocolo multidisciplinario para la Atención de
          Actividades Irregulares:
        </div>
        <div
          style={{
            flexGrow: 1,
            display: "flex",
            width: "48%",
            justifyContent: "space-around",
            borderWidth: "thin",
            borderStyle: "none none none solid",
            padding: "1px",
          }}
        >
          <FillableOptionCheck
            title={"Si"}
            //selected={globalResponseData.remitir_caso}
            selected={false}
          />
          <FillableOptionCheck
            title={"No"}
            //selected={!globalResponseData.remitir_caso}
            selected={true}
          />
        </div>
      </div>
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          fontSize: "8px",
          borderStyle: "none solid",
          borderWidth: "thin",
        }}
      >
        <div style={{ flexGrow: 1, width: "35%", padding: "2px" }}>
          Proceso incumplido:
        </div>
        <div
          style={{
            flexGrow: 1,
            width: "65%",
            padding: "2px",
            borderStyle: "none none none solid",
            borderWidth: "thin",
          }}
        >
          El proceso se cumplió a cabalidad
          {/* {globalResponseData.proceso_incumplido} */}
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <div
          style={{
            width: "52%",
            borderStyle: "solid none none solid",
            borderWidth: "thin",
          }}
        >
          <TileComponent
            title={"Nombre del Especialista Junior:"}
            content="Greg Spinetti"
            //content={globalResponseData.nombre_especialista_junior}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            width: "48%",
            borderStyle: "solid solid none solid",
            borderWidth: "thin",
            fontSize: "0.8em",
          }}
        >
          Firma:
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <div
          style={{
            width: "52%",
            borderStyle: "solid none none solid",
            borderWidth: "thin",
          }}
        >
          <TileComponent
            title={"Nombre del Especialista Senior:"}
            content={"Greg Spinetti"}
            //content={globalResponseData.nombre_especialista_senior}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "48%",
            borderStyle: "solid solid none solid",
            borderWidth: "thin",
            fontSize: "0.8em",
          }}
        >
          Firma:
        </div>
      </div>

      <div style={{ display: "flex" }}>
        <div
          style={{
            width: "52%",
            borderStyle: "solid none none solid",
            borderWidth: "thin",
          }}
        >
          <TileComponent
            title={"Nombre del Gerente:"}
            content={"Vladidmir Mujica"}
            //content={globalResponseData.nombre_gerente}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "48%",
            borderStyle: "solid solid none solid",
            borderWidth: "thin",
            fontSize: "0.8em",
          }}
        >
          Firma:
        </div>
      </div>

      <div style={{ display: "flex" }}>
        <div
          style={{
            width: "52%",
            borderStyle: "solid none none solid",
            borderWidth: "thin",
          }}
        >
          <TileComponent
            title={"Nombre del Gerente de Línea:"}
            content={"Juan Angulo"}
            //content={globalResponseData.nombre_gerente_linea}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "48%",
            borderStyle: "solid solid none solid",
            borderWidth: "thin",
            fontSize: "0.8em",
          }}
        >
          Firma:
        </div>
      </div>
    </>
  );
}

function TileComponent({
  title = "TItulo prueba:",
  content = "Data de prueba",
}) {
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: "0.8em", fontWeight: 800 }}>{title}</div>
        <div style={{ fontSize: "0.8em" }}>{content ?? <>&nbsp;</>}</div>
      </div>
    </>
  );
}

//export default ReactPDF.render(MyDocument);
export default MyDocument;
