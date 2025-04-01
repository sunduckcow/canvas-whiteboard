// export type Primitive =

export type JsonNodePath = string[];

export interface JsonNodeState {
  expanded: boolean;
  foldDepth: number;
}

export type JsonNodeStates = Record<string, JsonNodeState>;

export interface JsonContextState {
  nodeStates: JsonNodeStates;
  initialExpanded: boolean | number;
}

export type UpdateNodeStateFunction = (
  path: JsonNodePath,
  updates: Partial<JsonNodeState>
) => void;
