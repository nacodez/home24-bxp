import React from "react";
import { Table, Tag, Typography } from "antd";
import { AttrVal } from "../../../types/item.types";

const { Text } = Typography;

interface ProdPropsProps {
  attributes: AttrVal[];
  readOnly?: boolean;
}

const ItemProperties: React.FC<ProdPropsProps> = ({ attributes }) => {
  const cols = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      width: "20%",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: "15%",
      render: (type: string) => {
        let color = "default";

        switch (type) {
          case "text":
            color = "blue";
            break;
          case "number":
            color = "green";
            break;
          case "boolean":
            color = "volcano";
            break;
          case "url":
            color = "purple";
            break;
          case "tags":
            color = "orange";
            break;
        }

        return <Tag color={color}>{type}</Tag>;
      },
    },
    {
      title: "Label",
      dataIndex: "label",
      key: "label",
      width: "20%",
      render: (text: string) => text || <Text type="secondary">No label</Text>,
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      width: "45%",
      render: (
        value: string | number | boolean | string[] | null,
        record: AttrVal
      ) => {
        switch (record.type) {
          case "boolean":
            return value ? "Yes" : "No";
          case "url":
            return value ? (
              <a href={String(value)} target="_blank" rel="noopener noreferrer">
                {String(value)}
              </a>
            ) : (
              ""
            );
          case "tags":
            if (Array.isArray(value)) {
              return (
                <div>
                  {value.map((tag, index) => (
                    <Tag key={index}>{tag}</Tag>
                  ))}
                </div>
              );
            }
            return String(value || "");
          default:
            return String(value || "");
        }
      },
    },
  ];

  return (
    <Table
      rowKey="code"
      columns={cols}
      dataSource={attributes}
      pagination={false}
      size="middle"
    />
  );
};

export default ItemProperties;
