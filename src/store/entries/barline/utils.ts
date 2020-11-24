import { BarlineDrawType, Barline } from "./defs";
import { Box, EntryType } from "..";
import shortid from "shortid";
import { Instruction } from "../../../render/instructions";
import { VerticalSpacing } from "../../../parse/measure-verical-spacing";
import { VerticalSpans } from "../../../parse/measure-vertical-spans";
import { Player } from "../../score-player/defs";
import { Instrument } from "../../score-instrument/defs";
import { Flow } from "../../score-flow/defs";
import { buildPath } from "../../../render/path";
import { buildCircle } from "../../../render/circle";
import { buildBox } from "../../../render/box";
import { Stave } from "../../score-stave/defs";

export function measureBarlineBox(type: BarlineDrawType): Box {
  switch (type) {
    case BarlineDrawType.Double:
      return { width: 0.5, height: 4 };
    case BarlineDrawType.Final:
      return { width: 1, height: 4 };
    case BarlineDrawType.StartRepeat:
    case BarlineDrawType.EndRepeat:
      return { width: 2, height: 4 };
    case BarlineDrawType.EndStartRepeat:
      return { width: 3.5, height: 4 };
    case BarlineDrawType.Normal:
    default:
      return { width: 0, height: 4 };
  }
}

export function measureBarlineBounds(type: BarlineDrawType): Box {
  switch (type) {
    case BarlineDrawType.Double:
      return { width: 1.5, height: 4 };
    case BarlineDrawType.Final:
      return { width: 1, height: 4 };
    case BarlineDrawType.StartRepeat:
    case BarlineDrawType.EndRepeat:
      return { width: 3, height: 4 };
    case BarlineDrawType.EndStartRepeat:
      return { width: 4.5, height: 4 };
    case BarlineDrawType.Normal:
    default:
      return { width: 1, height: 4 };
  }
}

export function createBarline(
  tick: number,
  barline_type: BarlineDrawType
): Barline {
  return {
    type: EntryType.Barline,
    key: shortid(),
    tick: tick,

    draw_type: barline_type,
  };
}

function debugBarline(
  type: BarlineDrawType,
  key: string,
  x: number,
  y: number,
  height: number
) {
  const instructions: Instruction<any> = [];
  const box = measureBarlineBox(type);
  const bounds = measureBarlineBounds(type);
  instructions.push(
    buildBox(
      `${key}-BOX`,
      {
        color: "rgba(255,0,0,.2)",
      },
      x,
      y,
      box.width,
      height
    ),
    buildBox(
      `${key}-BOUNDS`,
      {
        color: "rgba(255,0,0,.1)",
      },
      x,
      y,
      bounds.width,
      height
    )
  );
  return instructions;
}

function drawRepeatDots(
  x: number,
  y: number,
  staves: Stave[],
  vertical_spacing: VerticalSpacing,
  key: string
) {
  const instructions: Instruction<any> = [];
  const radius = 0.25;
  staves.forEach((stave) => {
    const top = vertical_spacing.staves[stave.key].y;
    instructions.push(
      buildCircle(
        `${key}-${stave.key}-dot--top`,
        { color: "#000000" },
        x,
        y + top - 0.5,
        radius
      )
    );
    instructions.push(
      buildCircle(
        `${key}-${stave.key}-dot--bottom`,
        { color: "#000000" },
        x,
        y + top + 0.5,
        radius
      )
    );
  });
  return instructions;
}

export function drawBarline(
  x: number,
  y: number,
  staves: Stave[],
  vertical_spacing: VerticalSpacing,
  vertical_spans: VerticalSpans,
  barline: BarlineDrawType,
  key: string
) {
  const instructions: Instruction<any> = [];

  vertical_spans.barlines.forEach((entry) => {
    const start = vertical_spacing.instruments[entry.start];
    const stop = vertical_spacing.instruments[entry.stop];

    const tweakForStaveLineWidth = 0.0625;
    const top = y + start.y - tweakForStaveLineWidth;
    const bottom = y + stop.y + stop.height + tweakForStaveLineWidth;

    switch (barline) {
      case BarlineDrawType.Double:
        instructions.push(
          buildPath(
            `${key}-${entry.start}-barline--1`,
            { color: "#000000", thickness: 0.125 },
            [x, top],
            [x, bottom]
          )
        );
        instructions.push(
          buildPath(
            `${key}-${entry.start}-barline--2`,
            { color: "#000000", thickness: 0.125 },
            [x + 0.5, top],
            [x + 0.5, bottom]
          )
        );

        if (process.env.NODE_ENV === "development") {
          instructions.push(
            ...debugBarline(
              BarlineDrawType.Double,
              `${key}-${entry.start}-double--DEBUG`,
              x,
              top,
              bottom - top
            )
          );
        }
        break;

      case BarlineDrawType.Final:
        instructions.push(
          buildPath(
            `${key}-${entry.start}-barline--thin`,
            { color: "#000000", thickness: 0.125 },
            [x, top],
            [x, bottom]
          )
        );
        instructions.push(
          buildPath(
            `${key}-${entry.start}-barline--thick`,
            { color: "#000000", thickness: 0.5 },
            [x + 0.75, top],
            [x + 0.75, bottom]
          )
        );

        if (process.env.NODE_ENV === "development") {
          instructions.push(
            ...debugBarline(
              BarlineDrawType.Final,
              `${key}-${entry.start}-final--DEBUG`,
              x,
              top,
              bottom - top
            )
          );
        }
        break;

      case BarlineDrawType.EndRepeat:
        instructions.push(
          buildPath(
            `${key}-${entry.start}-barline--thin`,
            { color: "#000000", thickness: 0.125 },
            [x + 1, top],
            [x + 1, bottom]
          )
        );
        instructions.push(
          buildPath(
            `${key}-${entry.start}-barline--thick`,
            { color: "#000000", thickness: 0.5 },
            [x + 1.75, top],
            [x + 1.75, bottom]
          )
        );

        if (process.env.NODE_ENV === "development") {
          instructions.push(
            ...debugBarline(
              BarlineDrawType.EndRepeat,
              `${key}-${entry.start}-end-repeat--DEBUG`,
              x,
              top,
              bottom - top
            )
          );
        }
        break;

      case BarlineDrawType.StartRepeat:
        instructions.push(
          buildPath(
            `${key}-${entry.start}-barline--thin`,
            { color: "#000000", thickness: 0.125 },
            [x + 1, top],
            [x + 1, bottom]
          )
        );
        instructions.push(
          buildPath(
            `${key}-${entry.start}-barline--thick`,
            { color: "#000000", thickness: 0.5 },
            [x + 0.25, top],
            [x + 0.25, bottom]
          )
        );

        if (process.env.NODE_ENV === "development") {
          instructions.push(
            ...debugBarline(
              BarlineDrawType.StartRepeat,
              `${key}-${entry.start}-start-repeat--DEBUG`,
              x,
              top,
              bottom - top
            )
          );
        }
        break;

      case BarlineDrawType.EndStartRepeat:
        instructions.push(
          buildPath(
            `${key}-${entry.start}-barline--thin-end`,
            { color: "#000000", thickness: 0.125 },
            [x + 1, top],
            [x + 1, bottom]
          )
        );
        instructions.push(
          buildPath(
            `${key}-${entry.start}-barline--thick`,
            { color: "#000000", thickness: 0.5 },
            [x + 1.75, top],
            [x + 1.75, bottom]
          )
        );
        instructions.push(
          buildPath(
            `${key}-${entry.start}-barline--thin-start`,
            { color: "#000000", thickness: 0.125 },
            [x + 2.5, top],
            [x + 2.5, bottom]
          )
        );

        if (process.env.NODE_ENV === "development") {
          instructions.push(
            ...debugBarline(
              BarlineDrawType.EndStartRepeat,
              `${key}-${entry.start}-end-start-repeat--DEBUG`,
              x,
              top,
              bottom - top
            )
          );
        }
        break;

      case BarlineDrawType.Normal:
      default:
        instructions.push(
          buildPath(
            `${key}-${entry.start}-barline`,
            { color: "#000000", thickness: 0.125 },
            [x, top],
            [x, bottom]
          )
        );

        if (process.env.NODE_ENV === "development") {
          instructions.push(
            ...debugBarline(
              BarlineDrawType.Normal,
              `${key}-${entry.start}-normal--DEBUG`,
              x,
              top,
              bottom - top
            )
          );
        }
        break;
    }

    if (
      barline === BarlineDrawType.StartRepeat ||
      barline === BarlineDrawType.EndRepeat ||
      barline === BarlineDrawType.EndStartRepeat
    ) {
      switch (barline) {
        case BarlineDrawType.StartRepeat:
          instructions.push(
            ...drawRepeatDots(
              x + 1.75,
              y,
              staves,
              vertical_spacing,
              `${key}-${entry.start}-start`
            )
          );
          break;

        case BarlineDrawType.EndRepeat:
          instructions.push(
            ...drawRepeatDots(
              x + 0.25,
              y,
              staves,
              vertical_spacing,
              `${key}-${entry.start}-end`
            )
          );
          break;

        case BarlineDrawType.EndStartRepeat:
          instructions.push(
            ...drawRepeatDots(
              x + 0.25,
              y,
              staves,
              vertical_spacing,
              `${key}-${entry.start}-end`
            )
          );
          instructions.push(
            ...drawRepeatDots(
              x + 3.25,
              y,
              staves,
              vertical_spacing,
              `${key}-${entry.start}-start`
            )
          );
          break;

        default:
          break;
      }
    }
  });

  return instructions;
}
