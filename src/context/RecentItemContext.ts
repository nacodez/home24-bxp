import { createContext } from "react";
import { Item } from "../types/item.types";

interface RecentItemContextType {
    recentItem: Item | null;
    setRecentItem: (item: Item) => void;
}

const RecentItemContext = createContext<RecentItemContextType>({
    recentItem: null,
    setRecentItem: () => { },
});

export default RecentItemContext;
