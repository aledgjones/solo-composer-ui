import { getNotationBaseDuration, getIsDotted } from "./notation-track";

export function getNoteSpacing(
    duration: number,
    subdivisions: number,
    quarter_spacing: number,
    minimum_width: number,
    spacing_ratio: number,
    dotted_ratio: number
) {
    const base = getNotationBaseDuration(duration, subdivisions);
    const dotted = getIsDotted(duration, subdivisions);
    const width = quarter_spacing * (base * spacing_ratio) * (dotted ? dotted_ratio : 0);
    if (width > minimum_width) {
        return width;
    } else {
        return minimum_width;
    }
}
