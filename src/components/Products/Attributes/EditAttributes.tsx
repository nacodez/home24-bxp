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
  message,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { AttrVal, AttrType } from "../../../types/item.types";

const { Title, Text } = Typography;
const { Option } = Select;

interface EditAttrsProps {
  itemId: number;
  attributes: AttrVal[];
  onSave: (attributes: AttrVal[]) => Promise<void>;
}

interface AttrFormValues {
  code: string;
  type: AttrType;
  label?: string;
  value: string | number | boolean | string[] | null;
}

const EditAttributes: React.FC<EditAttrsProps> = ({
  attributes: initAttrs,
  onSave,
}) => {
  const [attrs, setAttrs] = useState<AttrVal[]>(initAttrs);
  const [form] = Form.useForm<AttrFormValues>();
  const [editingAttr, setEditingAttr] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const saveChanges = async () => {
    try {
      setIsSaving(true);
      await onSave(attrs);
      setEditingAttr(null);
      message.success("Attributes saved successfully");
    } catch (err) {
      console.error("Failed to save attributes", err);
      message.error("Failed to save attributes");
    } finally {
      setIsSaving(false);
    }
  };

  const addNewAttr = () => {
    const newAttr: AttrVal = {
      code: `attr_${Date.now()}`,
      value: "",
      type: "text",
      label: "",
    };

    setAttrs([...attrs, newAttr]);
    setEditingAttr(newAttr.code);
  };

  const handleDeleteConfirm = (codeToDelete: string) => {
    const newAttrs = attrs.filter((attr) => attr.code !== codeToDelete);
    setAttrs(newAttrs);

    if (editingAttr === codeToDelete) {
      setEditingAttr(null);
    }

    message.success(`Attribute deleted successfully`);
  };

  const handleDeleteCancel = () => {
    message.info("Deletion canceled");
  };

  const beginEdit = (code: string) => {
    const attr = attrs.find((attr) => attr.code === code);
    if (attr) {
      form.setFieldsValue({
        code: attr.code,
        type: attr.type,
        label: attr.label || "",
        value: attr.value,
      });
      setEditingAttr(code);
    }
  };

  const cancelEdit = () => {
    setEditingAttr(null);
    form.resetFields();
  };

  const updateAttr = (values: AttrFormValues) => {
    const updatedAttrs = attrs.map((attr) =>
      attr.code === editingAttr ? { ...attr, ...values } : attr
    );
    setAttrs(updatedAttrs);
    setEditingAttr(null);
    form.resetFields();
    message.success("Attribute updated");
  };

  const renderValueInput = (type: AttrType) => {
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
        <Title level={4}>Item Attributes</Title>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={addNewAttr}>
            Add Attribute
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={saveChanges}
            loading={isSaving}
          >
            Save All
          </Button>
        </Space>
      </div>

      {attrs.length === 0 ? (
        <Text type="secondary">No attributes defined for this item.</Text>
      ) : (
        <>
          {attrs.map((attr) => (
            <Card
              key={attr.code}
              style={{ marginBottom: 16 }}
              title={
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>
                    {attr.label || attr.code}
                    <Text type="secondary" style={{ marginLeft: 8 }}>
                      ({attr.type})
                    </Text>
                  </span>
                  <Space>
                    <Button type="text" onClick={() => beginEdit(attr.code)}>
                      Edit
                    </Button>

                    {/* Using Popconfirm instead of Modal */}
                    <Popconfirm
                      title="Delete Attribute"
                      description={`Are you sure you want to delete "${attr.code}"?`}
                      icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                      onConfirm={() => handleDeleteConfirm(attr.code)}
                      onCancel={handleDeleteCancel}
                      okText="Yes, Delete"
                      cancelText="Cancel"
                      okButtonProps={{ danger: true }}
                    >
                      <Button type="text" danger icon={<DeleteOutlined />}>
                        Delete
                      </Button>
                    </Popconfirm>
                  </Space>
                </div>
              }
            >
              <div>
                <Text strong>Code: </Text>
                <Text>{attr.code}</Text>
              </div>

              {attr.label && (
                <div>
                  <Text strong>Label: </Text>
                  <Text>{attr.label}</Text>
                </div>
              )}

              <div>
                <Text strong>Value: </Text>
                <Text>
                  {attr.type === "boolean"
                    ? attr.value
                      ? "Yes"
                      : "No"
                    : attr.type === "tags" && Array.isArray(attr.value)
                    ? attr.value.join(", ")
                    : String(attr.value || "")}
                </Text>
              </div>
            </Card>
          ))}
        </>
      )}

      <Modal
        title="Edit Attribute"
        open={!!editingAttr}
        onCancel={cancelEdit}
        footer={[
          <Button key="cancel" onClick={cancelEdit}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            Save
          </Button>,
        ]}
      >
        <Form<AttrFormValues>
          form={form}
          layout="vertical"
          onFinish={updateAttr}
        >
          <Form.Item
            name="code"
            label="Attribute Code"
            rules={[
              { required: true, message: "Please enter the attribute code" },
              {
                validator: (_, value) => {
                  if (
                    editingAttr &&
                    value !== editingAttr &&
                    attrs.some((attr) => attr.code === value)
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

export default EditAttributes;
