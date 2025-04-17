import { render } from "@testing-library/react";
import { waitFor, screen } from "@testing-library/dom";
import { MemoryRouter } from "react-router-dom";
import ProductDetails from "../../Products/Details/ProductDetails";
import * as productsHook from "../../../hooks/useProducts";
import * as categoriesHook from "../../../hooks/useCategories";
import { mockProducts, mockCategories } from "../../../tests/mocks";

jest.mock("../../hooks/useProducts");
jest.mock("../../hooks/useCategories");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ id: "1" }),
  useNavigate: () => jest.fn(),
}));

const mockUseProducts = productsHook.useProducts as jest.Mock;
const mockUseCategories = categoriesHook.useCategories as jest.Mock;

describe("ProductDetails Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseProducts.mockReturnValue({
      getProductById: jest.fn().mockResolvedValue(mockProducts[0]),
      updateProductAttributes: jest.fn(),
      products: [],
      total: 0,
      isLoading: false,
      error: null,
      filter: { page: 1, pageSize: 10 },
      setFilter: jest.fn(),
      refresh: jest.fn(),
    });

    mockUseCategories.mockReturnValue({
      categories: mockCategories,
      categoryTree: [],
      isLoading: false,
      error: null,
    });
  });

  test("renders loading state initially", () => {
    mockUseProducts.mockReturnValue({
      getProductById: jest.fn().mockReturnValue(new Promise(() => {})),
      updateProductAttributes: jest.fn(),
      products: [],
      total: 0,
      isLoading: true,
      error: null,
      filter: { page: 1, pageSize: 10 },
      setFilter: jest.fn(),
      refresh: jest.fn(),
    });

    render(
      <MemoryRouter>
        <ProductDetails />
      </MemoryRouter>
    );

    const spinElement = document.querySelector(".ant-spin");
    expect(spinElement).not.toBeNull();
  });

  test("renders product details when data is loaded", async () => {
    render(
      <MemoryRouter>
        <ProductDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      const productNameElements = screen.getAllByText("Test Product 1");
      expect(productNameElements.length).toBeGreaterThan(0);
    });

    expect(screen.getByText(/1/)).toBeInTheDocument();
    expect(screen.getByText("Category 1")).toBeInTheDocument();

    expect(screen.getByText("Product Attributes")).toBeInTheDocument();
  });

  test('renders "product not found" when product is null', async () => {
    mockUseProducts.mockReturnValue({
      getProductById: jest.fn().mockResolvedValue(null),
      updateProductAttributes: jest.fn(),
      products: [],
      total: 0,
      isLoading: false,
      error: null,
      filter: { page: 1, pageSize: 10 },
      setFilter: jest.fn(),
      refresh: jest.fn(),
    });

    render(
      <MemoryRouter>
        <ProductDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Product not found")).toBeInTheDocument();
    });
  });
});
