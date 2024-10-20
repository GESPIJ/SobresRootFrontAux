import MaterialTable from "material-table";
import axios from "../../axios/axios";
import Button from "@material-ui/core/Button";
import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import MyContext from "../../context/mycontext";

export default function ReportesDetallesTable({ solitudes, id }) {
  const ctx = useContext(MyContext);
  const formatter = new Intl.NumberFormat("es-VE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  //Component States
  let [systems, setSystems] = useState({
    systems: solitudes,
    selectedSystem: "",
  });
  //let [openDialog, setOpenDialog] = useState(false);
  //const api = `${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_API_PORT}`;

  async function searchTableData(query) {
    let filters =
      query.filters !== null && query.filters.length > 0
        ? query.filters[0].value
        : null;
    try {
      let params = {
        number: query.pageSize,
        page: query.page + 1,
        search: query.search,
        filters: filters,
        //id: id,
        id: "123456",
      };

      //Server Response
      const response = await axios.post("/operation/solitudesAll", params);
      //   let response = await axios.get(`http://${api}/api/detalles-reportes`, {
      //     params: params,
      //   });

      let data = response.data;

      return {
        data: data.systems,
        page: 1,
        // page: data.current_page - 1,
        //totalCount: data.total,
        totalCount: 5,
      };
    } catch (e) {
      console.log(e);
    }
  }

  //Function for fetching all solitudes
  const fetchSystems = async () => {
    //const payload = { id: ctx.nmActual };
    const payload = { id: "123456" };

    const response = await axios.post("/operation/solitudesAll", payload);

    setSystems({ ...systems, systems: response.data.systems.reverse() });
  };

  return (
    <>
      <MaterialTable
        //icons={tableIcons}
        title="Detalles del Reporte"
        localization={{
          body: {
            emptyDataSourceMessage: "No hay reportes",
          },
          toolbar: {
            searchTooltip: "Buscar",
            searchPlaceholder: "Por Nm",
          },
          pagination: {
            labelRowsSelect: "filas",
            labelDisplayedRows: " {from}-{to} de {count}",
            firstTooltip: "Primera página",
            previousTooltip: "Atrás",
            nextTooltip: "Siguiente",
            lastTooltip: "Última página",
          },
          header: {
            actions: "Acciones",
          },
        }}
        options={{
          debounceInterval: 400,
          pageSize: 5,
          toolbar: true,
          paging: true,
          sorting: false,
          search: true,
          actionsColumnIndex: -1,
          filtering: true,
        }}
        columns={[
          {
            title: "Fecha",
            field: "solitude_date",
            render: (rowData) => {
              return `${rowData.nombre}`;
            },
            filtering: false,
          },
          {
            title: "NM Solicitante",
            field: "nm_solitude",
            render: (rowData) => {
              return `${rowData.rif}`;
            },
            filtering: false,
          },

          {
            title: "Sistema Id",
            field: "system_id",
            render: (rowData) => {
              return `${rowData.sake}`;
            },
            filtering: false,
          },

          //   {
          //     title: "Fecha de Registro",
          //     field: "fecha_registro",
          //     render: (rowData) => {
          //       const months = [
          //         "Enero",
          //         "Febrero",
          //         "Marzo",
          //         "Abril",
          //         "Mayo",
          //         "Junio",
          //         "Julio",
          //         "Agosto",
          //         "Septiembre",
          //         "Octubre",
          //         "Noviembre",
          //         "Diciembre",
          //       ];
          //       let currentDatetime = new Date(rowData.fecha_registro);
          //       let formattedDate = `${currentDatetime.getUTCDate()} de ${
          //         months[currentDatetime.getUTCMonth()]
          //       } del ${currentDatetime.getFullYear()}`;
          //       return `${formattedDate}`;
          //     },
          //     filtering: true,
          //     filterComponent: (props) =>
          //       DatePickerCustom(
          //         props,
          //         handleDateChange,
          //         selectedDate,
          //         ["year", "month", "date"],
          //         "dd-MM-yyyy",
          //         "date"
          //       ),
          //     customFilterAndSearch: (value, rowData) => {
          //       return true; // customize here according your search algorithm.
          //     },
          //   },

          {
            title: "Time remaining",
            field: "remaining_time",
            render: (rowData) => {
              const months = [
                "Enero",
                "Febrero",
                "Marzo",
                "Abril",
                "Mayo",
                "Junio",
                "Julio",
                "Agosto",
                "Septiembre",
                "Octubre",
                "Noviembre",
                "Diciembre",
              ];
              let currentDatetime = new Date(rowData.fecha_trx);
              let formattedDate = `${currentDatetime.getUTCDate()} de ${
                months[currentDatetime.getUTCMonth()]
              } del ${currentDatetime.getFullYear()}`;
              return `${formattedDate}`;
            },
            filtering: false,
          },

          //   {
          //     title: "Monto Ejecutado",
          //     field: "monto_ejecutado",
          //     filtering: false,
          //     render: (rowData) => {
          //       return formatter.format(rowData.monto_ejecutado);
          //     },
          //   },
          //   {
          //     title: "Monto Retenido",
          //     field: "monto_retenido",
          //     filtering: false,

          //     render: (rowData) => {
          //       return formatter.format(rowData.monto_retenido);
          //     },
          //   },
        ]}
        actions={[
          (rowData) => ({
            icon: () => <Button color="primary">Ver</Button>,
            tooltip: "Ver detalles",
            onClick: (event, rowData) => {
              //   if (rowData.id)
              //     return router.push(
              //       `/reporte-detalles/[id]?afectado=${rowData.nombre}`,
              //       `/reporte-detalles/${rowData.id}?afectado=${rowData.nombre}`,
              //       { shallow: true }
              //     );
            },
          }),
        ]}
        data={searchTableData}
      />
    </>
  );
}
