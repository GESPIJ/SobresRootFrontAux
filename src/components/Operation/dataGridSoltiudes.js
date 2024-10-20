import * as React from "react";
import axios from "../../axios/axios";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "firstName", headerName: "First name", width: 130 },
  { field: "lastName", headerName: "Last name", width: 130 },
  {
    field: "age",
    headerName: "Age",
    type: "number",
    width: 90,
  },
  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 160,
    valueGetter: (params) =>
      `${params.getValue(params.id, "firstName") || ""} ${
        params.getValue(params.id, "lastName") || ""
      }`,
  },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

const columns1 = [
  {
    field: "fecha",
    headerName: "Fecha",
    width: 130,
  },
  {
    field: "nmSolicitante",
    headerName: "Nm",
    width: 70,
  },
  { headerName: "System id", field: "systemId", width: 70 },
  {
    headerName: "Motivo",
    field: "motive",
    width: 200,
  },
  { headerName: "Tiempo restante", field: "remainingTime", width: 130 },
];

const rowsInitital = [{}];

export default function DataTable() {
  const [rows1, setrows1] = React.useState(rowsInitital);

  const fetchSystems = async () => {
    //const payload = { id: ctx.nmActual };
    const payload = { id: "123456" };
    //console.log("Este es el id ", ctx.nmActual);
    const response = await axios.post("/operation/solitudesAll", payload);

    //debugger;
    let formattedRow = response.data.systems.map((system)=>{
        return {
            { id: system.id, lastName: "Snow", firstName: "Jon", age: 35 }
        }
    })
    setSystems({ ...systems, systems: response.data.systems.reverse() });
  };
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows1}
        columns={columns1}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </div>
  );
}
