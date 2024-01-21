import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import DataTable from "../src/components/dataTable";

const mockAbsences = [
  {
    id: 0,
    startDate: new Date("2024/01/17"),
    days: 7,
    absenceType: "SICKNESS",
    employee: {
      firstName: "Jonathan",
      lastName: "Markers",
      id: "Jonathan",
    },
    approved: true,
  },
  {
    id: 1,
    startDate: new Date("2024/02/17"),
    days: 7,
    absenceType: "SICKNESS",
    employee: {
      firstName: "Louise",
      lastName: "Davidson",
      id: "Louise",
    },
    approved: true,
  },
  {
    id: 2,
    startDate: new Date("2024/03/17"),
    days: 7,
    absenceType: "SICKNESS",
    employee: {
      firstName: "Adam",
      lastName: "Barlow",
      id: "Adam",
    },
    approved: true,
  },
  {
    id: 3,
    startDate: new Date("2024/04/17"),
    days: 7,
    absenceType: "SICKNESS",
    employee: {
      firstName: "Mary",
      lastName: "Taylor",
      id: "Mary",
    },
    approved: true,
  },
  {
    id: 4,
    startDate: new Date("2024/05/17"),
    days: 7,
    absenceType: "SICKNESS",
    employee: {
      firstName: "Jonathan",
      lastName: "Markers",
      id: "Jonathan",
    },
    approved: true,
  },
];

const singleMockAbsence = [
  {
    id: 0,
    startDate: new Date("2024/01/17"),
    days: 7,
    absenceType: "SICKNESS",
    employee: {
      firstName: "Jonathan",
      lastName: "Markers",
      id: "Jonathan",
    },
    approved: true,
  },
];

describe("Data Table", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should have the correct table headers", async () => {
    global.fetch = jest.fn(
      () =>
        Promise.resolve({
          json: () => Promise.resolve(mockAbsences),
        }) as Promise<Response>
    );

    render(<DataTable />);

    const loadingText = screen.getByText("Loading...");
    expect(loadingText).toBeInTheDocument();

    const startDateHeader = await screen.findByText("Start date");
    const endDateHeader = screen.getByText("End date");
    const employeeNameHeader = screen.getByText("Employee name");
    const isApprovedHeader = screen.getByText("Is approved?");
    const absenceTypeHeader = screen.getByText("Absence type");
    const hasConflictsHeader = screen.getByText("Has conflicts");

    expect(startDateHeader).toBeInTheDocument();
    expect(endDateHeader).toBeInTheDocument();
    expect(employeeNameHeader).toBeInTheDocument();
    expect(isApprovedHeader).toBeInTheDocument();
    expect(absenceTypeHeader).toBeInTheDocument();
    expect(hasConflictsHeader).toBeInTheDocument();
  });

  it("should have rows of data", async () => {
    global.fetch = jest.fn(
      () =>
        Promise.resolve({
          json: () => Promise.resolve(singleMockAbsence),
        }) as Promise<Response>
    );

    render(<DataTable />);

    const loadingText = screen.getByText("Loading...");
    expect(loadingText).toBeInTheDocument();

    const startDateValue = await screen.findByText("Wednesday, 17 Jan 2024");
    const endDateValue = screen.getByText("Tuesday, 23 Jan 2024");
    const employeeNameValue = screen.getByText("Jonathan Markers");
    const isApprovedValue = screen.getByText("Yes");
    const absenceTypeValue = screen.getByText("Sickness");
    const hasConflictsValue = screen.getByText("No");

    expect(startDateValue).toBeInTheDocument();
    expect(endDateValue).toBeInTheDocument();
    expect(employeeNameValue).toBeInTheDocument();
    expect(isApprovedValue).toBeInTheDocument();
    expect(absenceTypeValue).toBeInTheDocument();
    expect(hasConflictsValue).toBeInTheDocument();
  });

  it("should show a single employee when clicked", async () => {
    global.fetch = jest.fn(
      () =>
        Promise.resolve({
          json: () => Promise.resolve(mockAbsences),
        }) as Promise<Response>
    );

    render(<DataTable />);

    await screen.findByText("Start date");
    const jonathanEmployee = screen.getAllByText("Jonathan Markers");

    const rowCount = screen.getByText("1–5 of 5");
    expect(rowCount).toBeInTheDocument();

    const rowToClick = jonathanEmployee.at(0);

    if (rowToClick) {
      fireEvent(
        rowToClick,
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
        })
      );
    }

    const newRowCount = screen.getByText("1–2 of 2");
    expect(newRowCount).toBeInTheDocument();

    const newJonathanEmployee = screen.getAllByText("Jonathan Markers");
    expect(newJonathanEmployee.length).toBe(2);
  });
});
