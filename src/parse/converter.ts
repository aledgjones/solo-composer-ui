import Big from "big.js";
import { EngravingConfig } from "../store/defs";

export type ConverterGenerator = (space: number) => Converter;

export interface Converter {
    mm: {
        toPX: (mm: number) => number;
    };
    spaces: {
        toPX: (spaces: number) => number;
    };
}

export function getConverter(
    width: number,
    space: number,
    accuracy?: number
): Converter {
    return {
        mm: {
            toPX: (mm: number) =>
                parseFloat(new Big(mm).times(width).toFixed(accuracy)),
        },
        spaces: {
            toPX: (spaces: number) =>
                parseFloat(
                    new Big(spaces).times(space).times(width).toFixed(accuracy)
                ),
        },
    };
}
