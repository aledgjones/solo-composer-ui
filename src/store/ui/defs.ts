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

export interface UiDefs {
    view: View;
    snap: NoteDuration;
    flow_key: string;
    setup: {
        expanded: { [key: string]: boolean };
    };
    play: {
        selected: { [key: string]: boolean };
        expanded: { [key: string]: boolean };
        keyboard: { [key: string]: { base: number; height: number } };
        tool: Tool;
        zoom: number;
    };
}
