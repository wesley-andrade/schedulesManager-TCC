import { ReactNode, createContext, useContext, useState } from "react";

interface CalendarContextType {
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

export const CalendarProvider = ({ children }: { children: ReactNode }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <CalendarContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
};
