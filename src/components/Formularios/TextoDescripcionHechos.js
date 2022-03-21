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
    //textAlign: "center",
    //width: "100%",
    display: "block",
    fontSize: 12,
    marginTop: "10px",
  },
  // TextoInferior: {
  //   fontSize: 12,
  //   textAlign: "center",
  // },
});

const TextoDescripcionHechos = ({ contenido }) => {
  return (
    <>
      <div
        dangerouslySetInnerHTML={{
          __html: contenido,
        }}
      ></div>
      <Text style={styles.Texto}>
        1.- El cliente indica en su carta de reclamo que observó tres (03)
        debitos realizados en su cuenta el día 05/09/2021 por la cantidad de Bs.
        18.000.000,00 c/u, bajo el concepto de "compra con tarjeta de débito"
        las cuales no reconoce. Alega que para ese día solo hizo una compra por
        Bs. 6.3000.000,00.
      </Text>

      <Text style={styles.Texto}>
        2.- El cliente presenta afiliación al servicio clave móvil en fecha
        07/04/2015, registrando el Nro. Teléfonico 0414/3025301, ejecutado por
        el usuario NM1756; con una modificación en fecha 22/11/2016 por el
        usuario NM34200. (Anexo1). Dicho número teléfonica se encuentra
        registrado en la base de datos del cliente, desde el día 18/09/2012.
        (Anexo2).
      </Text>

      <Text style={styles.Texto}>
        3.- En el reporte clave móvil se visualiza que para el día de los
        debitos objetados, no se le envió las notificaciones al Nro. Teléfonico
        0414/3023501, correspondientes a las transacciones reclamadas por el
        cliente. (Anexo 3).
      </Text>

      <Text style={styles.Texto}>
        4.- No se observa reseteo de pin para la fecha de las transacciones
        objetadas por el cliente. (Anexo 4).
      </Text>

      <Text style={styles.Texto}>
        5.- No se reflejan las transacciones fallidas en el sistema para el día
        de los débitos cuestionados. (Anexo 5).
      </Text>

      <Text style={styles.Texto}>
        6.- El modo de entrada de las transacciones objetadas se originó bajo la
        modalidad de Tarjeta Chip - Lectura Chip Tarjeta y Titular Presente.
        (Anexo 6).
      </Text>

      <Text style={styles.Texto}>
        7.- Los débitos no reconocidos por el cliente corresponden a tres (03)
        transacciones ejecutadas el día 05/09/2012, detallados de la siguiente
        manera: (Anexos 6 y 7) .- A las 12:43:04, una (01) compra por punto de
        venta, ID terminal 44734 .- A las 14:12:51, una (01) compra por punto de
        venta, ID terminal 44863 .- A las 16:28:39, una (01) compra por punto de
        venta, ID terminal 44860, todas por Bs. 18.000.000,00 en el
        establecimiento "JOEL ANTONIO AZUAJE", ubicado en Caracas, con actividad
        económica en Tiendas de equipaje, Código adquiriente 986221217,
        perteneciente al consorcio Credicard.
      </Text>

      <Text style={styles.Texto}>
        8.- Luego de efectuarse los débitos cuestionados, la cuenta del cliente
        afectado Nro. 0102-0107-14-00-00138312 quedó con un saldo disponible de
        Bs. 23.927.252,91. (Anexo 8).
      </Text>
      {/* <div
        onClick={(e) => {
          console.log("Click aca");
          console.log(e);
        }}
      > */}
      {/* <Text style={styles.Texto}>
          9.- El cliente se encuentra residenciado en el Urb. Casitas del Nogal,
          Santa Lucía, Edo. Miranda (Anexo 9).
        </Text>
        <Text style={styles.Texto}>
          1.- El cliente indica en su carta de reclamo que observó tres (03)
          debitos realizados en su cuenta el día 05/09/2021 por la cantidad de
          Bs. 18.000.000,00 c/u, bajo el concepto de "compra con tarjeta de
          débito" las cuales no reconoce. Alega que para ese día solo hizo una
          compra por Bs. 6.3000.000,00.
        </Text>

        <Text style={styles.Texto}>
          2.- El cliente presenta afiliación al servicio clave móvil en fecha
          07/04/2015, registrando el Nro. Teléfonico 0414/3025301, ejecutado por
          el usuario NM1756; con una modificación en fecha 22/11/2016 por el
          usuario NM34200. (Anexo1). Dicho número teléfonica se encuentra
          registrado en la base de datos del cliente, desde el día 18/09/2012.
          (Anexo2).
        </Text>

        <Text style={styles.Texto}>
          3.- En el reporte clave móvil se visualiza que para el día de los
          debitos objetados, no se le envió las notificaciones al Nro.
          Teléfonico 0414/3023501, correspondientes a las transacciones
          reclamadas por el cliente. (Anexo 3).
        </Text>

        <Text style={styles.Texto}>
          4.- No se observa reseteo de pin para la fecha de las transacciones
          objetadas por el cliente. (Anexo 4).
        </Text>

        <Text style={styles.Texto}>
          5.- No se reflejan las transacciones fallidas en el sistema para el
          día de los débitos cuestionados. (Anexo 5).
        </Text>

        <Text style={styles.Texto}>
          6.- El modo de entrada de las transacciones objetadas se originó bajo
          la modalidad de Tarjeta Chip - Lectura Chip Tarjeta y Titular
          Presente. (Anexo 6).
        </Text>

        <Text style={styles.Texto}>
          7.- Los débitos no reconocidos por el cliente corresponden a tres (03)
          transacciones ejecutadas el día 05/09/2012, detallados de la siguiente
          manera: (Anexos 6 y 7) .- A las 12:43:04, una (01) compra por punto de
          venta, ID terminal 44734 .- A las 14:12:51, una (01) compra por punto
          de venta, ID terminal 44863 .- A las 16:28:39, una (01) compra por
          punto de venta, ID terminal 44860, todas por Bs. 18.000.000,00 en el
          establecimiento "JOEL ANTONIO AZUAJE", ubicado en Caracas, con
          actividad económica en Tiendas de equipaje, Código adquiriente
          986221217, perteneciente al consorcio Credicard.
        </Text>

        <Text style={styles.Texto}>
          8.- Luego de efectuarse los débitos cuestionados, la cuenta del
          cliente afectado Nro. 0102-0107-14-00-00138312 quedó con un saldo
          disponible de Bs. 23.927.252,91. (Anexo 8).
        </Text>
        <Text style={styles.Texto}>
          1.- El cliente indica en su carta de reclamo que observó tres (03)
          debitos realizados en su cuenta el día 05/09/2021 por la cantidad de
          Bs. 18.000.000,00 c/u, bajo el concepto de "compra con tarjeta de
          débito" las cuales no reconoce. Alega que para ese día solo hizo una
          compra por Bs. 6.3000.000,00.
        </Text>

        <Text style={styles.Texto}>
          2.- El cliente presenta afiliación al servicio clave móvil en fecha
          07/04/2015, registrando el Nro. Teléfonico 0414/3025301, ejecutado por
          el usuario NM1756; con una modificación en fecha 22/11/2016 por el
          usuario NM34200. (Anexo1). Dicho número teléfonica se encuentra
          registrado en la base de datos del cliente, desde el día 18/09/2012.
          (Anexo2).
        </Text>

        <Text style={styles.Texto}>
          3.- En el reporte clave móvil se visualiza que para el día de los
          debitos objetados, no se le envió las notificaciones al Nro.
          Teléfonico 0414/3023501, correspondientes a las transacciones
          reclamadas por el cliente. (Anexo 3).
        </Text>

        <Text style={styles.Texto}>
          4.- No se observa reseteo de pin para la fecha de las transacciones
          objetadas por el cliente. (Anexo 4).
        </Text>

        <Text style={styles.Texto}>
          5.- No se reflejan las transacciones fallidas en el sistema para el
          día de los débitos cuestionados. (Anexo 5).
        </Text>

        <Text style={styles.Texto}>
          6.- El modo de entrada de las transacciones objetadas se originó bajo
          la modalidad de Tarjeta Chip - Lectura Chip Tarjeta y Titular
          Presente. (Anexo 6).
        </Text>

        <Text style={styles.Texto}>
          7.- Los débitos no reconocidos por el cliente corresponden a tres (03)
          transacciones ejecutadas el día 05/09/2012, detallados de la siguiente
          manera: (Anexos 6 y 7) .- A las 12:43:04, una (01) compra por punto de
          venta, ID terminal 44734 .- A las 14:12:51, una (01) compra por punto
          de venta, ID terminal 44863 .- A las 16:28:39, una (01) compra por
          punto de venta, ID terminal 44860, todas por Bs. 18.000.000,00 en el
          establecimiento "JOEL ANTONIO AZUAJE", ubicado en Caracas, con
          actividad económica en Tiendas de equipaje, Código adquiriente
          986221217, perteneciente al consorcio Credicard.
        </Text>

        <Text style={styles.Texto}>
          8.- Luego de efectuarse los débitos cuestionados, la cuenta del
          cliente afectado Nro. 0102-0107-14-00-00138312 quedó con un saldo
          disponible de Bs. 23.927.252,91. (Anexo 8).
        </Text>
        <Text style={styles.Texto}>
          1.- El cliente indica en su carta de reclamo que observó tres (03)
          debitos realizados en su cuenta el día 05/09/2021 por la cantidad de
          Bs. 18.000.000,00 c/u, bajo el concepto de "compra con tarjeta de
          débito" las cuales no reconoce. Alega que para ese día solo hizo una
          compra por Bs. 6.3000.000,00.
        </Text>

        <Text style={styles.Texto}>
          2.- El cliente presenta afiliación al servicio clave móvil en fecha
          07/04/2015, registrando el Nro. Teléfonico 0414/3025301, ejecutado por
          el usuario NM1756; con una modificación en fecha 22/11/2016 por el
          usuario NM34200. (Anexo1). Dicho número teléfonica se encuentra
          registrado en la base de datos del cliente, desde el día 18/09/2012.
          (Anexo2).
        </Text>

        <Text style={styles.Texto}>
          3.- En el reporte clave móvil se visualiza que para el día de los
          debitos objetados, no se le envió las notificaciones al Nro.
          Teléfonico 0414/3023501, correspondientes a las transacciones
          reclamadas por el cliente. (Anexo 3).
        </Text>

        <Text style={styles.Texto}>
          4.- No se observa reseteo de pin para la fecha de las transacciones
          objetadas por el cliente. (Anexo 4).
        </Text>

        <Text style={styles.Texto}>
          5.- No se reflejan las transacciones fallidas en el sistema para el
          día de los débitos cuestionados. (Anexo 5).
        </Text>

        <Text style={styles.Texto}>
          6.- El modo de entrada de las transacciones objetadas se originó bajo
          la modalidad de Tarjeta Chip - Lectura Chip Tarjeta y Titular
          Presente. (Anexo 6).
        </Text>

        <Text style={styles.Texto}>
          7.- Los débitos no reconocidos por el cliente corresponden a tres (03)
          transacciones ejecutadas el día 05/09/2012, detallados de la siguiente
          manera: (Anexos 6 y 7) .- A las 12:43:04, una (01) compra por punto de
          venta, ID terminal 44734 .- A las 14:12:51, una (01) compra por punto
          de venta, ID terminal 44863 .- A las 16:28:39, una (01) compra por
          punto de venta, ID terminal 44860, todas por Bs. 18.000.000,00 en el
          establecimiento "JOEL ANTONIO AZUAJE", ubicado en Caracas, con
          actividad económica en Tiendas de equipaje, Código adquiriente
          986221217, perteneciente al consorcio Credicard.
        </Text>

        <Text style={styles.Texto}>
          8.- Luego de efectuarse los débitos cuestionados, la cuenta del
          cliente afectado Nro. 0102-0107-14-00-00138312 quedó con un saldo
          disponible de Bs. 23.927.252,91. (Anexo 8).
        </Text>
      </div>

      <Text
        onClick={() => {
          console.log("Click aca");
        }}
        style={styles.Texto}
      >
        10.- Las transacciones objetadas fueron realizadas con la tarjeta Nro.
        58-99-4162-2175-6589, la cual no posee registro de TRACKING DE PLASTICO
        en el sistema (Anexo 10). El cliente anexa copia de la tarjeta de débito
        con la que se realizaron las operaciones reclamadas. (Anexo 10).
      </Text>

      <Text
        onClick={(e) => {
          console.log("Click aca");
          console.log(e);
        }}
        style={styles.Texto}
      >
        11.- El instrumento financiero afectado presenta bloqueo en fecha
        07/09/2021 a las 09:58:30 am, por el usuario CONSAKE, posterior a las
        transacciones reclamadas. (Anexo 14.
      </Text>

      <ol>
        <li>Blablablablabla</li>
        <li>Segunda segunda segunda segunda segunda</li>
        <li>Blablablablabla</li>
        <li>Segunda segunda segunda segunda segunda</li>
        <li>Blablablablabla</li>
        <li>Segunda segunda segunda segunda segunda</li>
        <li>Blablablablabla</li>
        <li>Segunda segunda segunda segunda segunda</li>
        <li>Blablablablabla</li>
        <li>Segunda segunda segunda segunda segunda</li>
        <li>Blablablablabla</li>
        <li>Segunda segunda segunda segunda segunda</li>
        <li>Blablablablabla</li>
        <li>Segunda segunda segunda segunda segunda</li>
        <li>Blablablablabla</li>
        <li>Segunda segunda segunda segunda segunda</li>
        <li>Blablablablabla</li>
        <li>Segunda segunda segunda segunda segunda</li>
        <li>Blablablablabla</li>
        <li>Segunda segunda segunda segunda segunda</li>
        <li>Blablablablabla</li>
        <li>Segunda segunda segunda segunda segunda</li>
        <li>Blablablablabla</li>
        <li>Segunda segunda segunda segunda segunda</li>
        <li>Blablablablabla</li>
        <li>Segunda segunda segunda segunda segunda</li>
        <li>Blablablablabla</li>
        <li>Segunda segunda segunda segunda segunda</li>
        <li>Blablablablabla</li>
        <li>Segunda segunda segunda segunda segunda</li>
        <li>Blablablablabla</li>
        <li>Segunda segunda segunda segunda segunda</li>
        <li>Blablablablabla</li>
        <li>Segunda segunda segunda segunda segunda</li>
        <li>Blablablablabla</li>
        <li>Segunda segunda segunda segunda segunda</li>
        <li>Blablablablabla</li>
        <li>Segunda segunda segunda segunda segunda</li>
        <li>Blablablablabla</li>
        <li>Segunda segunda segunda segunda segunda</li>
        <li>Blablablablabla</li>
        <li>Segunda segunda segunda segunda segunda</li>
        <li>Blablablablabla</li>
        <li>Segunda segunda segunda segunda segunda</li>
        <li>Blablablablabla</li>
        <li>Segunda segunda segunda segunda segunda</li>
        <li>Blablablablabla</li>
        <li>Segunda segunda segunda segunda segunda</li>
        <li>Blablablablabla</li>
        <li>Segunda segunda segunda segunda segunda</li>
        <li>Blablablablabla</li>
        <li>Segunda segunda segunda segunda segunda</li>
        <li>Blablablablabla</li>
        <li>Segunda segunda segunda segunda segunda</li>
      </ol> */}
    </>
  );
};

export default TextoDescripcionHechos;
