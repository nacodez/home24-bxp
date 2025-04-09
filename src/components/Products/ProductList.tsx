import React, { useEffect } from "react";
import { Table, Button, Select, Space, Typography, Tag } from "antd";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Link, useSearchParams } from "react-router-dom";
import { Product } from "../../types/product.types";
import { useProducts } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";
import { TablePaginationConfig } from "antd/es/table";
import { ColumnsType } from "antd/es/table";
import { SorterResult } from "antd/es/table/interface";

const { Title } = Typography;
const { Option } = Select;

const ProductList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryId = searchParams.get("categoryId")
    ? parseInt(searchParams.get("categoryId") as string)
    : undefined;

  const page = searchParams.get("_page")
    ? parseInt(searchParams.get("_page") as string)
    : 1;

  const pageSize = searchParams.get("_limit")
    ? parseInt(searchParams.get("_limit") as string)
    : 10;

  const initialFilter = {
    categoryId,
    page,
    pageSize,
  };

  const { categories } = useCategories();
  const { products, total, isLoading, filter, setFilter } =
    useProducts(initialFilter);

  useEffect(() => {
    const newParams = new URLSearchParams();

    if (filter.categoryId) {
      newParams.set("categoryId", filter.categoryId.toString());
    }

    newParams.set("_page", filter.page.toString());
    newParams.set("_limit", filter.pageSize.toString());

    if (filter.sort?.field && filter.sort.direction) {
      newParams.set("_sort", filter.sort.field.toString());
      newParams.set("_order", filter.sort.direction);
    }

    const currentParamsString = searchParams.toString();
    const newParamsString = newParams.toString();

    if (currentParamsString !== newParamsString) {
      setSearchParams(newParams);
    }
  }, [filter, setSearchParams, searchParams]);

  const handlePageChange = (page: number, pageSize?: number) => {
    setFilter((prev) => ({
      ...prev,
      page,
      pageSize: pageSize || prev.pageSize,
    }));
  };

  const handlePageSizeChange = (_: number, size: number) => {
    setFilter((prev) => ({
      ...prev,
      pageSize: size,
    }));
  };

  const handleSortChange = (
    _: TablePaginationConfig,
    _filters: Record<string, unknown>,
    sorter: SorterResult<Product> | SorterResult<Product>[]
  ) => {
    if (!sorter || (Array.isArray(sorter) && sorter.length === 0)) {
      return;
    }

    const singleSorter = !Array.isArray(sorter) ? sorter : sorter[0];

    if (!singleSorter.field) return;

    const fieldName = singleSorter.field.toString();
    setFilter((prev) => ({
      ...prev,
      sort: {
        field: fieldName as keyof Product | "",
        direction: singleSorter.order === "ascend" ? "asc" : "desc",
      },
    }));
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : "Unknown";
  };

  const columns: ColumnsType<Product> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: true,
      sortOrder:
        filter.sort?.field === "id"
          ? filter.sort.direction === "asc"
            ? "ascend"
            : "descend"
          : null,
      width: "10%",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
      sortOrder:
        filter.sort?.field === "name"
          ? filter.sort.direction === "asc"
            ? "ascend"
            : "descend"
          : null,
      width: "35%",
    },
    {
      title: "Category",
      dataIndex: "category_id",
      key: "category_id",
      width: "20%",
      render: (categoryId: number) => (
        <Tag color="blue">{getCategoryName(categoryId)}</Tag>
      ),
    },
    {
      title: "Attributes",
      key: "attributes",
      width: "20%",
      render: (_, record: Product) => (
        <span>{record.attributes.length} attributes</span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: "15%",
      render: (_, record: Product) => (
        <Space>
          <Link to={`/products/${record.id}`}>
            <Button type="primary" icon={<EyeOutlined />} size="small">
              View
            </Button>
          </Link>
          <Link to={`/products/${record.id}/edit`}>
            <Button type="default" icon={<EditOutlined />} size="small">
              Edit
            </Button>
          </Link>
        </Space>
      ),
    },
  ];

  const getTitle = () => {
    if (categoryId && categories.length > 0) {
      const category = categories.find((c) => c.id === categoryId);
      return `Products in ${category ? category.name : "Category"}`;
    }
    return "All Products";
  };

  const getResponsiveStyles = () => {
    const isMobile = window.innerWidth < 768;
    return {
      container: {
        display: "flex",
        flexDirection: isMobile ? ("column" as const) : ("row" as const),
        justifyContent: "space-between",
        marginBottom: 16,
        alignItems: isMobile ? ("flex-start" as const) : ("center" as const),
        gap: "12px",
      },
      selectContainer: {
        width: isMobile ? "100%" : "auto",
      },
      select: {
        width: isMobile ? "100%" : 200,
      },
    };
  };

  const styles = getResponsiveStyles();

  return (
    <div>
      <div style={styles.container}>
        <Title level={3}>{getTitle()}</Title>

        <Space direction="vertical" style={styles.selectContainer}>
          <span>Category:</span>
          <Select
            style={styles.select}
            placeholder="Select a category"
            value={categoryId}
            onChange={(value: number | undefined) => {
              setFilter((prev) => ({
                ...prev,
                categoryId: value,
                page: 1,
              }));
            }}
            allowClear
          >
            {categories.map((category) => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Space>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Space>
          <span>
            Page {filter.page} of{" "}
            {Math.max(1, Math.ceil(total / filter.pageSize))}
          </span>
          <span>·</span>
          <span>Showing {filter.pageSize} per page</span>
        </Space>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={products}
        loading={isLoading}
        pagination={{
          current: filter.page,
          pageSize: filter.pageSize,
          total,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
          onChange: handlePageChange,
          onShowSizeChange: handlePageSizeChange,
          showTotal: (total) => `Total ${total} items`,
          position: ["bottomRight"],
        }}
        onChange={handleSortChange}
      />
    </div>
  );
};

export default ProductList;
