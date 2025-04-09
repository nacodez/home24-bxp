import React, { useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Switch,
  Select,
  Button,
  Space,
  Card,
  Typography,
  Modal,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { AttributeValue, AttributeType } from "../../types/product.types";

const { Title, Text } = Typography;
const { Option } = Select;
const { confirm } = Modal;

interface AttributeEditorProps {
  productId: number;
  attributes: AttributeValue[];
  onSave: (attributes: AttributeValue[]) => Promise<void>;
}
interface AttributeFormValues {
  code: string;
  type: AttributeType;
  label?: string;
  value: string | number | boolean | string[] | null;
}

const AttributeEditor: React.FC<AttributeEditorProps> = ({
  attributes: initialAttributes,
  onSave,
}) => {
  const [attributes, setAttributes] =
    useState<AttributeValue[]>(initialAttributes);
  const [form] = Form.useForm<AttributeFormValues>();
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Handle saving all attributes
  const handleSave = async () => {
    try {
      setSaving(true);
      await onSave(attributes);
      setEditing(null);
    } catch (error) {
      console.error("Failed to save attributes", error);
    } finally {
      setSaving(false);
    }
  };

  // Add a new attribute
  const handleAddAttribute = () => {
    const newAttribute: AttributeValue = {
      code: `attr_${Date.now()}`,
      value: "",
      type: "text",
      label: "",
    };

    setAttributes([...attributes, newAttribute]);
    setEditing(newAttribute.code);
  };

  // Delete an attribute
  const handleDeleteAttribute = (code: string) => {
    confirm({
      title: "Are you sure you want to delete this attribute?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      onOk() {
        setAttributes(attributes.filter((attr) => attr.code !== code));
        if (editing === code) {
          setEditing(null);
        }
      },
    });
  };

  // Edit an attribute
  const startEditing = (code: string) => {
    const attribute = attributes.find((attr) => attr.code === code);
    if (attribute) {
      form.setFieldsValue({
        code: attribute.code,
        type: attribute.type,
        label: attribute.label || "",
        value: attribute.value,
      });
      setEditing(code);
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditing(null);
    form.resetFields();
  };

  // Update an attribute
  const updateAttribute = (values: AttributeFormValues) => {
    const updatedAttributes = attributes.map((attr) =>
      attr.code === editing ? { ...attr, ...values } : attr
    );
    setAttributes(updatedAttributes);
    setEditing(null);
    form.resetFields();
  };

  const renderValueInput = (type: AttributeType) => {
    switch (type) {
      case "number":
        return <InputNumber style={{ width: "100%" }} />;
      case "boolean":
        return <Switch />;
      case "url":
        return <Input />;
      case "tags":
        return (
          <Select
            mode="tags"
            style={{ width: "100%" }}
            placeholder="Enter tags"
          ></Select>
        );
      case "text":
      default:
        return <Input />;
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
          alignItems: "center",
        }}
      >
        <Title level={4}>Product Attributes</Title>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddAttribute}
          >
            Add Attribute
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            loading={saving}
          >
            Save All
          </Button>
        </Space>
      </div>

      {attributes.length === 0 ? (
        <Text type="secondary">No attributes defined for this product.</Text>
      ) : (
        <>
          {attributes.map((attribute) => (
            <Card
              key={attribute.code}
              style={{ marginBottom: 16 }}
              title={
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>
                    {attribute.label || attribute.code}
                    <Text type="secondary" style={{ marginLeft: 8 }}>
                      ({attribute.type})
                    </Text>
                  </span>
                  <Space>
                    <Button
                      type="text"
                      onClick={() => startEditing(attribute.code)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteAttribute(attribute.code)}
                    />
                  </Space>
                </div>
              }
            >
              <div>
                <Text strong>Code: </Text>
                <Text>{attribute.code}</Text>
              </div>

              {attribute.label && (
                <div>
                  <Text strong>Label: </Text>
                  <Text>{attribute.label}</Text>
                </div>
              )}

              <div>
                <Text strong>Value: </Text>
                <Text>
                  {attribute.type === "boolean"
                    ? attribute.value
                      ? "Yes"
                      : "No"
                    : attribute.type === "tags" &&
                      Array.isArray(attribute.value)
                    ? attribute.value.join(", ")
                    : String(attribute.value || "")}
                </Text>
              </div>
            </Card>
          ))}
        </>
      )}
      <Modal
        title="Edit Attribute"
        open={!!editing}
        onCancel={cancelEditing}
        footer={[
          <Button key="cancel" onClick={cancelEditing}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            Save
          </Button>,
        ]}
      >
        <Form<AttributeFormValues>
          form={form}
          layout="vertical"
          onFinish={updateAttribute}
        >
          <Form.Item
            name="code"
            label="Attribute Code"
            rules={[
              { required: true, message: "Please enter the attribute code" },
              {
                validator: (_, value) => {
                  if (
                    editing &&
                    value !== editing &&
                    attributes.some((attr) => attr.code === value)
                  ) {
                    return Promise.reject("Attribute code must be unique");
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="label" label="Display Label (Optional)">
            <Input />
          </Form.Item>

          <Form.Item
            name="type"
            label="Type"
            rules={[
              { required: true, message: "Please select the attribute type" },
            ]}
          >
            <Select>
              <Option value="text">Text</Option>
              <Option value="number">Number</Option>
              <Option value="boolean">Boolean</Option>
              <Option value="url">URL</Option>
              <Option value="tags">Tags</Option>
            </Select>
          </Form.Item>

          <Form.Item
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.type !== currentValues.type
            }
            noStyle
          >
            {({ getFieldValue }) => (
              <Form.Item name="value" label="Value">
                {renderValueInput(getFieldValue("type"))}
              </Form.Item>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AttributeEditor;
