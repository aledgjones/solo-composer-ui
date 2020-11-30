import { actions } from "../store/actions";

export enum HotKey {
  ClearAll = 1,
  KeySignaturePopover,
  TimeSignaturePopover,
}

export const hotKeys = {
  [HotKey.ClearAll]: "esc",
  [HotKey.KeySignaturePopover]: "shift+k",
  [HotKey.TimeSignaturePopover]: "shift+b",
};

export const hotKeyHandlers = {
  [HotKey.ClearAll]: () => {
    actions.ui.write.popover.hide();
  },
  [HotKey.KeySignaturePopover]: () => {
    actions.ui.write.popover.show(HotKey.KeySignaturePopover);
  },
};
