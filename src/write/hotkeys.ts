import { actions } from "../store/actions";
import { NoteDuration } from "../store/entries";
import { BarlineDrawType } from "../store/entries/barline/defs";
import { modeFromKey, offsetFromKey } from "../store/entries/key-signature/defs";
import { TimeSignatureDrawType } from "../store/entries/time-signature/defs";

export const barCommands = (flowKey: string, tick: number, input: string) => {
  switch (input) {
    case "clear":
      // TODO: remove barline at given tick
      break;
    case "single":
    case "normal":
    case "|":
      actions.score.entries.barline.create(flowKey, tick, BarlineDrawType.Normal);
      break;
    case "double":
    case "||":
      actions.score.entries.barline.create(flowKey, tick, BarlineDrawType.Double);
      break;
    case "final":
    case "|]":
      actions.score.entries.barline.create(flowKey, tick, BarlineDrawType.Final);
      break;
    case "start":
    case "|:":
      actions.score.entries.barline.create(flowKey, tick, BarlineDrawType.StartRepeat);
      break;
    case "end":
    case ":|":
      actions.score.entries.barline.create(flowKey, tick, BarlineDrawType.EndRepeat);
      break;
    case "endstart":
    case "end-start":
    case ":||:":
    case ":|:":
      actions.score.entries.barline.create(flowKey, tick, BarlineDrawType.EndStartRepeat);
      break;
    default:
      break;
  }
};

export const keySignatureCommands = (flowKey: string, tick: number, input: string) => {
  if (input) {
    const offset = offsetFromKey(input);
    const mode = modeFromKey(input);
    if (offset !== null) {
      actions.score.entries.key_signature.create(flowKey, tick, mode, offset);
    }
  }
};

export const timeSignatureCommands = (flowKey: string, tick: number, input: string) => {
  switch (input) {
    case "c":
      actions.score.entries.time_signature.create(
        flowKey,
        tick,
        4,
        NoteDuration.Quarter,
        TimeSignatureDrawType.CommonTime
      );
      break;
    case "cutc":
      actions.score.entries.time_signature.create(
        flowKey,
        tick,
        2,
        NoteDuration.Half,
        TimeSignatureDrawType.CutCommonTime
      );
      break;
    case "x":
    case "X":
      actions.score.entries.time_signature.create(flowKey, tick, 0, NoteDuration.Quarter, TimeSignatureDrawType.Open);
      break;
    case "open":
      actions.score.entries.time_signature.create(flowKey, tick, 0, NoteDuration.Quarter, TimeSignatureDrawType.Hidden);
      break;
    default: {
      const regex = /(\d*)\/(\d*)/;
      const valid = regex.test(input);
      if (valid) {
        const [all, beats, beatType] = regex.exec(input);
        actions.score.entries.time_signature.create(
          flowKey,
          tick,
          parseInt(beats),
          parseInt(beatType),
          TimeSignatureDrawType.Regular
        );
      }
    }
  }
};
