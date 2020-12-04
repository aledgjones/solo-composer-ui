import { NoteDuration } from "../entries";

export enum Tool {
  Select,
  Draw,
  Slice,
  Erase,
}

export enum View {
  Setup,
  Write,
  Engrave,
  Play,
  Print,
}

export enum PopoverType {
  KeySignature,
  TimeSignature,
  Bar,
}

export interface UiDefs {
  view: View;
  snap: NoteDuration;
  flow_key: string;
  setup: {
    expanded: { [key: string]: boolean };
    panels: {
      players: boolean;
      layouts: boolean;
    };
  };
  write: {
    panels: {
      elements: boolean;
    };
    popover: PopoverType | null;
  };
  play: {
    selected: { [key: string]: boolean };
    expanded: { [key: string]: boolean };
    keyboard: { [key: string]: number };
    tool: Tool;
    zoom: number;
  };
}
