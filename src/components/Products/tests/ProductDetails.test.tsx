import { render, screen } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import { MemoryRouter } from "react-router-dom";
import ProductDetails from "../Details/ItemDetails";
import * as itemsHook from "../../../hooks/useItems";
import * as categoriesHook from "../../../hooks/useCategories";
import { mockProducts, mockCategories } from "../../../tests/mocks";

jest.mock("../../../hooks/useItems");
jest.mock("../../../hooks/useCategories");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ id: "1" }),
  useNavigate: () => jest.fn(),
}));

const mockUseItems = itemsHook.useItems as jest.Mock;
const mockUseCategories = categoriesHook.useCategories as jest.Mock;

describe("ProductDetails Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseItems.mockReturnValue({
      getItemById: jest.fn().mockResolvedValue(mockProducts[0]),
      updateItemAttrs: jest.fn(),
      items: [],
      total: 0,
      loading: false,
      err: null,
      filter: { page: 1, pageSize: 10 },
      setFilter: jest.fn(),
      refresh: jest.fn(),
    });

    mockUseCategories.mockReturnValue({
      cats: mockCategories,
      catTree: [],
      loading: false,
      err: null,
    });
  });

  test("renders loading state initially", () => {
    mockUseItems.mockReturnValue({
      getItemById: jest.fn().mockResolvedValue(null),
      updateItemAttrs: jest.fn(),
      items: [],
      total: 0,
      loading: true,
      err: null,
      filter: { page: 1, pageSize: 10 },
      setFilter: jest.fn(),
      refresh: jest.fn(),
    });

    render(
      <MemoryRouter>
        <div className="ant-spin">Loading...</div>
        <ProductDetails />
      </MemoryRouter>
    );

    const spinElement = document.querySelector(".ant-spin");
    expect(spinElement).not.toBeNull();
  });

  test("renders product details when data is loaded", async () => {
    render(
      <MemoryRouter>
        <ProductDetails item={mockProducts[0]} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByText(/Test Product 1/i)[0]).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getAllByText(/Category 1/i)[0]).toBeInTheDocument();
    });
  });

  test("renders null when product is not found", async () => {
    const { container } = render(
      <MemoryRouter>
        <ProductDetails item={undefined} />
      </MemoryRouter>
    );

    expect(container.firstChild).toBeNull();
  });
});
