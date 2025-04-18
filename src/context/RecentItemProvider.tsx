import React, { useState } from "react";
import RecentItemContext from "./RecentItemContext";
import { Item } from "../types/item.types";

const RecentItemProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [recentItem, setRecentItem] = useState<Item | null>(null);

  return (
    <RecentItemContext.Provider value={{ recentItem, setRecentItem }}>
      {children}
    </RecentItemContext.Provider>
  );
};

export default RecentItemProvider;
