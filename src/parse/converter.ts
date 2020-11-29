import Big from "big.js";

export interface ConverterGroup {
  toPX: (unit: number) => number;
  toSpaces: (unit: number) => number;
}

export interface Converter {
  px: ConverterGroup;
  mm: ConverterGroup;
  spaces: ConverterGroup;
}

export function getConverter(width: number, space: number, accuracy?: number): Converter {
  return {
    px: {
      toPX: (px: number) => px,
      toSpaces: (px: number) => {
        const mm = new Big(px).div(width);
        return parseFloat(mm.div(space).toFixed(accuracy));
      },
    },
    mm: {
      toPX: (mm: number) => parseFloat(new Big(mm).times(width).toFixed(accuracy)),
      toSpaces: (mm: number) => parseFloat(new Big(mm).div(space).toFixed(accuracy)),
    },
    spaces: {
      toPX: (spaces: number) => parseFloat(new Big(spaces).times(space).times(width).toFixed(accuracy)),
      toSpaces: (spaces: number) => spaces,
    },
  };
}
