export enum SelectionType {
  Player,
  Flow,
  Layout,
}

export type Selection = {
  key: string;
  type: SelectionType;
} | null;
