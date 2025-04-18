import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AppLayout from "../components/Layout/AppLayout";
import ItemDetails from "../components/Products/Details/ItemDetails";
import EditAttributes from "../components/Products/Attributes/EditAttributes";
import { useItems } from "../hooks/useItems";
import { Item } from "../types/item.types";
import { Tabs, Spin, Alert } from "antd";
import { AttrVal } from "../types/item.types";
import type { TabsProps } from "antd";

interface ItemPageProps {
  editMode?: boolean;
}

const ItemDetailPage: React.FC<ItemPageProps> = ({ editMode = false }) => {
  const { id } = useParams<{ id: string }>();
  const { updateItemAttrs, getItemById } = useItems();
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const loadItem = async () => {
      if (id) {
        try {
          setIsLoading(true);
          setErrorMsg(null);
          const itemData = await getItemById(parseInt(id));
          setCurrentItem(itemData);
        } catch (err) {
          console.error("Error loading item:", err);
          setErrorMsg("Failed to load item. Please try again later.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadItem();
  }, [id, getItemById]);

  const handleSaveAttrs = async (attrs: AttrVal[]) => {
    if (id && currentItem) {
      try {
        await updateItemAttrs(parseInt(id), {
          ...currentItem,
          attributes: attrs,
        });
        const refreshedItem = await getItemById(parseInt(id));
        setCurrentItem(refreshedItem);
      } catch (err) {
        console.error("Failed to save attributes", err);
      }
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" />
        </div>
      </AppLayout>
    );
  }

  if (errorMsg) {
    return (
      <AppLayout>
        <Alert message="Error" description={errorMsg} type="error" showIcon />
      </AppLayout>
    );
  }

  if (!currentItem) {
    return (
      <AppLayout>
        <Alert
          message="Item Not Found"
          description="The requested item could not be found."
          type="warning"
          showIcon
        />
      </AppLayout>
    );
  }

  const tabItems: TabsProps["items"] = [
    {
      key: "info",
      label: "Item Information",
      children: <ItemDetails item={currentItem} editMode={true} />,
    },
    {
      key: "attributes",
      label: "Edit Attributes",
      children: (
        <EditAttributes
          itemId={parseInt(id as string)}
          attributes={currentItem.attributes}
          onSave={handleSaveAttrs}
        />
      ),
    },
  ];

  return (
    <AppLayout>
      {editMode ? (
        <Tabs defaultActiveKey="attributes" items={tabItems} />
      ) : (
        <ItemDetails item={currentItem} />
      )}
    </AppLayout>
  );
};

export default ItemDetailPage;
