import { actions } from "../store/actions";
import { NoteDuration } from "../store/entries/defs";
import { durationFromString } from "../store/entries/absolute-tempo/utils";
import { BarlineDrawType } from "../store/entries/barline/defs";
import { modeFromKey, offsetFromKey } from "../store/entries/key-signature/defs";
import { TimeSignatureDrawType } from "../store/entries/time-signature/defs";

export const keySignatureCommands = (flowKey: string, tick: number, input: string) => {
  if (input) {
    const offset = offsetFromKey(input);
    const mode = modeFromKey(input);
    if (offset !== null) {
      return actions.score.entries.key_signature.create(flowKey, tick, mode, offset);
    }
  }
};

export const timeSignatureCommands = (flowKey: string, tick: number, input: string) => {
  switch (input) {
    case "c":
      return actions.score.entries.time_signature.create(
        flowKey,
        tick,
        4,
        NoteDuration.Quarter,
        TimeSignatureDrawType.CommonTime
      );
    case "cutc":
    case "cut-c":
      return actions.score.entries.time_signature.create(
        flowKey,
        tick,
        2,
        NoteDuration.Half,
        TimeSignatureDrawType.CutCommonTime
      );
    case "x":
    case "X":
      return actions.score.entries.time_signature.create(
        flowKey,
        tick,
        0,
        NoteDuration.Quarter,
        TimeSignatureDrawType.Open
      );
    case "open":
      return actions.score.entries.time_signature.create(
        flowKey,
        tick,
        0,
        NoteDuration.Quarter,
        TimeSignatureDrawType.Hidden
      );
    default: {
      const regex = /(\d*)\/(\d*)/;
      const valid = regex.test(input);
      if (valid) {
        const [full, beats, beatType] = regex.exec(input);
        return actions.score.entries.time_signature.create(
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

export const barCommands = (flowKey: string, tick: number, input: string) => {
  switch (input) {
    case "clear":
      // TODO: remove barline at given tick
      break;
    case "single":
    case "normal":
    case "|":
      return actions.score.entries.barline.create(flowKey, tick, BarlineDrawType.Normal);
    case "double":
    case "||":
      return actions.score.entries.barline.create(flowKey, tick, BarlineDrawType.Double);
    case "final":
    case "|]":
      return actions.score.entries.barline.create(flowKey, tick, BarlineDrawType.Final);
    case "start":
    case "|:":
      return actions.score.entries.barline.create(flowKey, tick, BarlineDrawType.StartRepeat);
    case "end":
    case ":|":
      return actions.score.entries.barline.create(flowKey, tick, BarlineDrawType.EndRepeat);
    case "endstart":
    case "end-start":
    case ":||:":
    case ":|:":
      return actions.score.entries.barline.create(flowKey, tick, BarlineDrawType.EndStartRepeat);
    default:
      break;
  }
};

export const tempoCommands = (flowKey: string, tick: number, input: string) => {
  const tempoRegex = /\(?([whqest])(\.*?)=(\d*)\)?/; // a tempo
  const parensRegex = /\([whqest]\.*?=\d*\)/; // parens around a tempo

  const hasTempo = tempoRegex.test(input);
  const hasParens = parensRegex.test(input);

  if (hasTempo) {
    const [full, duration, dots, bpm] = tempoRegex.exec(input);
    const i = input.indexOf(full);
    const text = input.slice(0, i).trim();

    return actions.score.entries.absolute_tempo.create(
      flowKey,
      tick,
      text,
      durationFromString(duration),
      dots.length,
      parseInt(bpm),
      hasParens,
      !!text,
      true
    );
  } else if (input) {
    const text = input.trim();
    switch (text.toLocaleLowerCase()) {
      case "allegro":
        return actions.score.entries.absolute_tempo.create(
          flowKey,
          tick,
          text,
          NoteDuration.Quarter,
          0,
          120,
          false,
          true,
          false
        );
      case "adagio":
        return actions.score.entries.absolute_tempo.create(
          flowKey,
          tick,
          text,
          NoteDuration.Quarter,
          0,
          60,
          false,
          true,
          false
        );
      default:
        return actions.score.entries.absolute_tempo.create(
          flowKey,
          tick,
          text,
          NoteDuration.Quarter,
          0,
          120,
          false,
          true,
          false
        );
    }
  }
};
