import { Entry, NoteDuration } from "../entries/defs";

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
  Tempo,
}

export interface UiDefs {
  view: View;
  snap: NoteDuration;
  flow_key: string;
  selection: { [key: string]: Entry };
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
    tick: number;
  };
  play: {
    stave: { [key: string]: string };
    expanded: { [key: string]: boolean };
    keyboard: { [key: string]: number };
    tool: Tool;
    zoom: number;
  };
}
