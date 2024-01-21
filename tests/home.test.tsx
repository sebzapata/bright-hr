import { render, screen } from "@testing-library/react";
import Home from "../src/app/page";
import "@testing-library/jest-dom";

describe("Home page", () => {
  it("should have the correct header when showing all absences", () => {
    render(<Home />);

    const headerText = screen.getByText("List of absences");

    expect(headerText).toBeInTheDocument();
  });
});
