"use client";

import { IAbsence, IConflict } from "@/types/type";
import { Button } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridFooter,
  GridFooterContainer,
  GridValidRowModel,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";

enum AbsenceType {
  SICKNESS = "Sickness",
  ANNUAL_LEAVE = "Annual leave",
  MEDICAL = "Medical",
  COMPASSIONATE_LEAVE = "Compassionate leave",
}

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-gb", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const columns: GridColDef[] = [
  {
    field: "startDate",
    headerName: "Start date",
    width: 250,
    valueFormatter: ({ value }) => formatDate(value),
  },
  {
    field: "endDate",
    headerName: "End date",
    width: 250,
    valueFormatter: ({ value }) => formatDate(value),
  },
  { field: "employeeName", headerName: "Employee name", width: 250 },
  { field: "isApproved", headerName: "Is approved?", width: 250 },
  { field: "absenceType", headerName: "Absence type", width: 250 },
  { field: "hasConflicts", headerName: "Has conflicts", width: 250 },
];

export default function DataTable() {
  const [absenceRows, setAbsenceRows] = useState<GridValidRowModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<number>();

  const checkIfAbsenceHasConflict = async (
    absenceId: number
  ): Promise<boolean> => {
    const url = `https://front-end-kata.brighthr.workers.dev/api/conflict/${absenceId}`;

    const response = await fetch(url);
    const conflictBody: IConflict = await response.json();

    return conflictBody.conflicts;
  };

  useEffect(() => {
    const fetchAndSetData = async () => {
      setIsLoading(true);

      const absencesResponse = await fetch(
        "https://front-end-kata.brighthr.workers.dev/api/absences"
      );

      const absences: IAbsence[] = await absencesResponse.json();

      const formatAbsencesToRows = (): GridValidRowModel[] =>
        absences.map(async (absence) => {
          const absenceType =
            AbsenceType[absence.absenceType as keyof typeof AbsenceType];

          const startDate = new Date(absence.startDate);
          const endDate = new Date(absence.startDate);
          endDate.setDate(endDate.getDate() + absence.days - 1);

          const hasConflicts = (await checkIfAbsenceHasConflict(absence.id))
            ? "Yes"
            : "No";

          return {
            id: absence.id,
            startDate,
            endDate,
            employeeName: `${absence.employee.firstName} ${absence.employee.lastName}`,
            absenceType,
            isApproved: absence.approved ? "Yes" : "No",
            hasConflicts,
            employeeId: absence.employee.id,
          };
        });

      setAbsenceRows(await Promise.all(formatAbsencesToRows()));

      setIsLoading(false);
    };

    fetchAndSetData();
  }, []);

  if (isLoading) return <h2>Loading...</h2>;

  const absencesForEmployee = () =>
    absenceRows.filter((absence) => absence.employeeId === selectedEmployee);

  if (selectedEmployee) {
    const customFooter = () => {
      return (
        <GridFooterContainer>
          <Button onClick={() => setSelectedEmployee(undefined)}>
            &larr; Back to all absences
          </Button>
          <GridFooter />
        </GridFooterContainer>
      );
    };

    return (
      <div style={{ height: "100%", width: 1505 }}>
        <DataGrid
          sx={{
            ".MuiDataGrid-footerContainer, .MuiDataGrid-columnHeaders": {
              background: "white",
            },
            ".MuiDataGrid-virtualScroller": {
              background: "#e2e2e2",
            },
          }}
          disableVirtualization
          rows={absencesForEmployee()}
          columns={columns}
          pageSizeOptions={[10]}
          hideFooterSelectedRowCount
          slots={{
            footer: customFooter,
          }}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ height: "100%", width: 1505 }}>
      <DataGrid
        sx={{
          ".MuiDataGrid-footerContainer, .MuiDataGrid-columnHeaders": {
            background: "white",
          },
          ".MuiDataGrid-virtualScroller": {
            background: "gainsboro",
          },
        }}
        onRowClick={(params) => {
          setSelectedEmployee(params.row.employeeId);
        }}
        disableVirtualization
        rows={absenceRows}
        columns={columns}
        pageSizeOptions={[10]}
        hideFooterSelectedRowCount
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
      />
    </div>
  );
}
