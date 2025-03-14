import { createContext, useContext } from "react";

export interface JsonContextType {
  initialExpanded?: boolean;
}

const jsonContext = createContext<JsonContextType>({});

export const useJsonContext = () => useContext(jsonContext);

export const JsonContextProvider = jsonContext.Provider;
