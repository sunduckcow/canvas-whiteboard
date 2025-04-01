import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  FC,
  PropsWithChildren,
  useState,
} from "react";

import {
  JsonContextState,
  JsonNodePath,
  JsonNodeState,
  UpdateNodeStateFunction,
} from "./types";

interface JsonContextValue extends JsonContextState {
  updateNodeState: UpdateNodeStateFunction;
  getNodeState: (path: JsonNodePath) => JsonNodeState;
}

const defaultState: JsonContextState = {
  nodeStates: {},
  initialExpanded: false,
};

const jsonContext = createContext<JsonContextValue>({
  ...defaultState,
  updateNodeState: () => undefined,
  getNodeState: () => ({ expanded: false, foldDepth: Infinity }),
});

export const useJsonContext = () => useContext(jsonContext);

interface JsonContextProviderProps extends PropsWithChildren {
  initialExpanded?: boolean | number;
}

export const JsonContextProvider: FC<JsonContextProviderProps> = ({
  children,
  initialExpanded = false,
}) => {
  const [state, setState] = useState<JsonContextState>({
    nodeStates: {},
    initialExpanded,
  });

  const updateNodeState: UpdateNodeStateFunction = useCallback(
    (path: JsonNodePath, updates: Partial<JsonNodeState>) => {
      const pathKey = path.join(".");
      setState((prevState) => ({
        ...prevState,
        nodeStates: {
          ...prevState.nodeStates,
          [pathKey]: {
            ...prevState.nodeStates[pathKey],
            ...updates,
          },
        },
      }));
    },
    []
  );

  const getNodeState = useCallback(
    (path: JsonNodePath): JsonNodeState => {
      const pathKey = path.join(".");
      const nodeState = state.nodeStates[pathKey];
      const depth = path.length - 1;

      if (nodeState) return nodeState;

      // Auto-expand based on initialExpanded value
      const expanded =
        typeof state.initialExpanded === "number"
          ? depth < state.initialExpanded
          : state.initialExpanded;

      return {
        expanded,
        foldDepth: Infinity,
      };
    },
    [state]
  );

  const value = useMemo(
    () => ({
      ...state,
      updateNodeState,
      getNodeState,
    }),
    [state, updateNodeState, getNodeState]
  );

  return <jsonContext.Provider value={value}>{children}</jsonContext.Provider>;
};
