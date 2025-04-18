import { render, screen } from "@testing-library/react";
import ProductAttributes from "../Attributes/ItemProperties";
import { mockAttributes } from "../../../tests/mocks";

describe("ProductAttributes Component", () => {
  test("renders all attribute rows correctly", () => {
    render(<ProductAttributes attributes={mockAttributes} />);

    const colorElements = screen.getAllByText("color");
    expect(colorElements.length).toBeGreaterThan(0);

    const widthElements = screen.getAllByText("width");
    expect(widthElements.length).toBeGreaterThan(0);

    const inStockElements = screen.getAllByText("in_stock");
    expect(inStockElements.length).toBeGreaterThan(0);

    const tagsElements = screen.getAllByText(/^tags$/);
    expect(tagsElements.length).toBeGreaterThan(0);

    const manualElements = screen.getAllByText("manual");
    expect(manualElements.length).toBeGreaterThan(0);

    //Attribute values verification
    expect(screen.getByText("Red")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();

    // Tags should render as Tag components
    expect(screen.getByText("modern")).toBeInTheDocument();
    expect(screen.getByText("stylish")).toBeInTheDocument();

    // URL should render as a link
    const link = screen.getByText("https://example.com/manual.pdf");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "https://example.com/manual.pdf");
    expect(link).toHaveAttribute("target", "_blank");
  });

  test("renders empty table when no attributes are provided", () => {
    render(<ProductAttributes attributes={[]} />);
    expect(screen.queryByText("color")).not.toBeInTheDocument();
    expect(screen.queryByText("width")).not.toBeInTheDocument();
  });

  test("handles null or empty values properly", () => {
    const attributesWithNullValues = [
      {
        code: "empty_text",
        value: "",
        type: "text" as const,
        label: "Empty Text",
      },
      {
        code: "null_value",
        value: null,
        type: "text" as const,
        label: "Null Value",
      },
    ];

    render(<ProductAttributes attributes={attributesWithNullValues} />);

    expect(screen.getByText("empty_text")).toBeInTheDocument();
    expect(screen.getByText("null_value")).toBeInTheDocument();
    const rows = screen.getAllByRole("row");
    expect(rows.length).toBe(3); // Header + 2 data rows
  });

  test("handles missing label properly", () => {
    const attributeWithoutLabel = [
      {
        code: "no_label",
        value: "test",
        type: "text" as const,
      },
    ];

    render(<ProductAttributes attributes={attributeWithoutLabel} />);

    // Code should be displayed
    expect(screen.getByText("no_label")).toBeInTheDocument();
    // Value should be displayed
    expect(screen.getByText("test")).toBeInTheDocument();
    // Should render "No label" in the label column
    expect(screen.getByText("No label")).toBeInTheDocument();
  });
});
