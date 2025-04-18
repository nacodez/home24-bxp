import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Select,
  Space,
  Typography,
  Tag,
  Pagination,
} from "antd";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import { Item } from "../../types/item.types";
import { useItems } from "../../hooks/useItems";
import { useCategories } from "../../hooks/useCategories";
import { TablePaginationConfig } from "antd/es/table";
import { ColumnsType } from "antd/es/table";
import { SorterResult } from "antd/es/table/interface";

const { Title } = Typography;
const { Option } = Select;

const ItemGrid: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [curPage, setCurPage] = useState(1);
  const location = useLocation();

  const catId = searchParams.get("categoryId")
    ? parseInt(searchParams.get("categoryId") as string)
    : undefined;

  const page = searchParams.get("_page")
    ? parseInt(searchParams.get("_page") as string)
    : 1;

  const limit = searchParams.get("_limit")
    ? parseInt(searchParams.get("_limit") as string)
    : 10;

  const sortBy = searchParams.get("_sort") || "";
  const sortDir = (searchParams.get("_order") as "asc" | "desc") || "asc";

  const initFilter = {
    categoryId: catId,
    page,
    pageSize: limit,
    sort: sortBy
      ? { field: sortBy as keyof Item, direction: sortDir }
      : undefined,
  };

  const { cats } = useCategories();
  const { items, total, loading, filter, setFilter } = useItems(initFilter);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlCategoryId = params.get("categoryId");

    if (
      (urlCategoryId &&
        (!filter.categoryId ||
          urlCategoryId !== filter.categoryId.toString())) ||
      (!urlCategoryId && filter.categoryId)
    ) {
      setFilter({
        ...filter,
        categoryId: urlCategoryId ? parseInt(urlCategoryId) : undefined,
        page: 1,
      });
      setCurPage(1);
    }
  }, [location.search, filter, setFilter]);

  useEffect(() => {
    setCurPage(filter.page);
  }, [filter.page]);

  useEffect(() => {
    const newParams = new URLSearchParams();

    if (filter.categoryId !== undefined) {
      newParams.set("categoryId", filter.categoryId.toString());
    }

    newParams.set("_page", filter.page.toString());
    newParams.set("_limit", filter.pageSize.toString());

    if (filter.sort?.field && filter.sort.direction) {
      newParams.set("_sort", filter.sort.field.toString());
      newParams.set("_order", filter.sort.direction);
    }

    setSearchParams(newParams, { replace: true });
  }, [filter, setSearchParams]);

  const changePage = (pg: number) => {
    setCurPage(pg);

    setFilter((prev) => ({
      ...prev,
      page: pg,
    }));
  };

  const changePageSize = (size: number) => {
    const startIndex = (curPage - 1) * filter.pageSize;

    const newPage = Math.floor(startIndex / size) + 1;

    setCurPage(newPage);

    setFilter((prev) => ({
      ...prev,
      pageSize: size,
      page: newPage,
    }));
  };

  const handleSort = (
    _: TablePaginationConfig,
    _filters: Record<string, unknown>,
    sorter: SorterResult<Item> | SorterResult<Item>[]
  ) => {
    if (!sorter || (Array.isArray(sorter) && sorter.length === 0)) {
      setFilter((prev) => ({
        ...prev,
        sort: undefined,
        page: 1,
      }));
      setCurPage(1);
      return;
    }

    const theSorter = !Array.isArray(sorter) ? sorter : sorter[0];

    if (!theSorter.field) {
      setFilter((prev) => ({
        ...prev,
        sort: undefined,
        page: 1,
      }));
      setCurPage(1);
      return;
    }

    const colName = theSorter.field.toString();

    if (!theSorter.order) {
      setFilter((prev) => ({
        ...prev,
        sort: undefined,
        page: 1,
      }));
      setCurPage(1);
      return;
    }
    const sortDir = theSorter.order === "ascend" ? "asc" : "desc";

    setFilter((prev) => ({
      ...prev,
      sort: {
        field: colName as keyof Item,
        direction: sortDir,
      },
      page: 1,
    }));
    setCurPage(1);
  };

  const getCatName = (catId: number) => {
    const catIdStr = catId.toString();
    const cat = cats.find((c) => c.id.toString() === catIdStr);

    if (cat) {
      return cat.name;
    }

    const catByNumber = cats.find((c) => {
      const cId = typeof c.id === "string" ? parseInt(c.id) : c.id;
      return cId === catId;
    });

    return catByNumber ? catByNumber.name : `Unknown (${catId})`;
  };

  const columns: ColumnsType<Item> = [
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
      render: (catId: number) => {
        const catName = getCatName(catId);
        const isUnknown = catName.startsWith("Unknown");
        return <Tag color={isUnknown ? "red" : "blue"}>{catName}</Tag>;
      },
    },
    {
      title: "Attributes",
      key: "attributes",
      width: "20%",
      render: (_, item: Item) => (
        <span>{item.attributes.length} attributes</span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: "15%",
      render: (_, item: Item) => (
        <Space>
          <Link to={`/products/${item.id}`}>
            <Button type="primary" icon={<EyeOutlined />} size="small">
              View
            </Button>
          </Link>
          <Link to={`/products/${item.id}/edit`}>
            <Button type="default" icon={<EditOutlined />} size="small">
              Edit
            </Button>
          </Link>
        </Space>
      ),
    },
  ];

  const getTitle = () => {
    if (catId && cats.length > 0) {
      const cat = cats.find((c) => c.id.toString() === catId.toString());
      return `Products in ${cat ? cat.name : "Category"}`;
    }
    return "All Products";
  };

  const getStyles = () => {
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
      selectBox: {
        width: isMobile ? "100%" : "auto",
      },
      dropdown: {
        width: isMobile ? "100%" : 200,
      },
    };
  };

  const styles = getStyles();

  return (
    <div>
      <div style={styles.container}>
        <Title level={3}>{getTitle()}</Title>

        <Space direction="vertical" style={styles.selectBox}>
          <span>Category:</span>
          <Select
            style={styles.dropdown}
            placeholder="Select a category"
            value={catId}
            onChange={(value: number | undefined) => {
              setFilter((prev) => ({
                ...prev,
                categoryId: value,
                page: 1,
              }));
              setCurPage(1);
            }}
            allowClear
          >
            {cats.map((cat) => {
              const catIdValue =
                typeof cat.id === "string" ? parseInt(cat.id) : cat.id;
              return (
                <Option key={cat.id} value={catIdValue}>
                  {cat.name}
                </Option>
              );
            })}
          </Select>
        </Space>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Space>
          <span>
            Page {curPage} of {Math.max(1, Math.ceil(total / filter.pageSize))}
          </span>
          <span>·</span>
          <span>Showing {filter.pageSize} per page</span>
          {filter.sort?.field && (
            <>
              <span>·</span>
              <span>
                Sorted by {filter.sort.field} ({filter.sort.direction})
              </span>
            </>
          )}
        </Space>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={items}
        loading={loading}
        pagination={false}
        onChange={handleSort}
      />

      <div
        style={{
          marginTop: "16px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Pagination
          current={curPage}
          total={total}
          pageSize={filter.pageSize}
          showSizeChanger
          pageSizeOptions={["5", "10", "20", "50"]}
          onChange={changePage}
          onShowSizeChange={changePageSize}
          showTotal={(ttl) => `Total ${ttl} items`}
        />
      </div>
    </div>
  );
};

export default ItemGrid;
