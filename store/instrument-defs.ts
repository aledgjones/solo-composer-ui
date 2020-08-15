import {
    InstrumentType,
    ClefDrawType,
    Expression,
    InstrumentDef,
    PlayerType,
} from "./defs";
import { useMemo } from "react";

const defs: InstrumentDef[] = [
    {
        id: "brass.bass-trombone",
        instrument_type: InstrumentType.Melodic,
        path: ["Brass", "Bass Trombone"],
        long_name: "Bass Trombone",
        short_name: "B. Tbn.",
        staves: [
            {
                lines: [1, 0, 1, 0, 1, 0, 1, 0, 1],
                clef: {
                    pitch: 53,
                    offset: 2,
                    draw_as: ClefDrawType.F,
                },
            },
        ],
        patches: {
            [PlayerType.Solo]: {
                [Expression.Natural]: "/patches/bass-trombone/natural.json",
            },
            [PlayerType.Section]: {
                [Expression.Natural]: "/patches/bass-trombone/natural.json",
            },
        },
    },
    {
        id: "brass.horn.f",
        instrument_type: InstrumentType.Melodic,
        path: ["Brass", "Horn", "F"],
        long_name: "Horn in F",
        short_name: "F Hn.",
        staves: [
            {
                lines: [1, 0, 1, 0, 1, 0, 1, 0, 1],
                clef: {
                    pitch: 67,
                    offset: -2,
                    draw_as: ClefDrawType.G,
                },
            },
        ],
        patches: {
            [PlayerType.Solo]: {
                [Expression.Natural]: "/patches/horn/natural.json",
                [Expression.Staccato]: "/patches/horn/staccato.json",
                [Expression.Mute]: "/patches/horn/mute.json",
            },
            [PlayerType.Section]: {
                [Expression.Natural]: "/patches/horn/natural.json",
                [Expression.Staccato]: "/patches/horn/staccato.json",
                [Expression.Mute]: "/patches/horn/mute.json",
            },
        },
    },
    {
        id: "brass.trombone",
        instrument_type: InstrumentType.Melodic,
        path: ["Brass", "Trombone"],
        long_name: "Trombone",
        short_name: "Tbn.",
        staves: [
            {
                lines: [1, 0, 1, 0, 1, 0, 1, 0, 1],
                clef: {
                    pitch: 53,
                    offset: 2,
                    draw_as: ClefDrawType.F,
                },
            },
        ],
        patches: {
            [PlayerType.Solo]: {
                [Expression.Natural]: "/patches/trombone/natural.json",
                [Expression.Staccato]: "/patches/trombone/staccato.json",
            },
            [PlayerType.Section]: {
                [Expression.Natural]: "/patches/trombone/natural.json",
                [Expression.Staccato]: "/patches/trombone/staccato.json",
            },
        },
    },
    {
        id: "brass.trumpet.b-flat",
        instrument_type: InstrumentType.Melodic,
        path: ["Brass", "Trumpet", "B${flat}"],
        long_name: "Trumpet in B${flat}",
        short_name: "B${flat} Tpt.",
        staves: [
            {
                lines: [1, 0, 1, 0, 1, 0, 1, 0, 1],
                clef: {
                    pitch: 67,
                    offset: -2,
                    draw_as: ClefDrawType.G,
                },
            },
        ],
        patches: {
            [PlayerType.Solo]: {
                [Expression.Natural]: "/patches/trumpet/natural.json",
                [Expression.Staccato]: "/patches/trumpet/staccato.json",
                [Expression.Mute]: "/patches/trumpet/mute.json",
            },
            [PlayerType.Section]: {
                [Expression.Natural]: "/patches/trumpet/natural.json",
                [Expression.Staccato]: "/patches/trumpet/staccato.json",
                [Expression.Mute]: "/patches/trumpet/mute.json",
            },
        },
    },
    {
        id: "brass.trumpet.c",
        instrument_type: InstrumentType.Melodic,
        path: ["Brass", "Trumpet", "C"],
        long_name: "Trumpet in C",
        short_name: "C Tpt.",
        staves: [
            {
                lines: [1, 0, 1, 0, 1, 0, 1, 0, 1],
                clef: {
                    pitch: 67,
                    offset: -2,
                    draw_as: ClefDrawType.G,
                },
            },
        ],
        patches: {
            [PlayerType.Solo]: {
                [Expression.Natural]: "/patches/trumpet/natural.json",
                [Expression.Staccato]: "/patches/trumpet/staccato.json",
                [Expression.Mute]: "/patches/trumpet/mute.json",
            },
            [PlayerType.Section]: {
                [Expression.Natural]: "/patches/trumpet/natural.json",
                [Expression.Staccato]: "/patches/trumpet/staccato.json",
                [Expression.Mute]: "/patches/trumpet/mute.json",
            },
        },
    },
    {
        id: "brass.tuba",
        instrument_type: InstrumentType.Melodic,
        path: ["Brass", "Tuba"],
        long_name: "Tuba",
        short_name: "Tba.",
        staves: [
            {
                lines: [1, 0, 1, 0, 1, 0, 1, 0, 1],
                clef: {
                    pitch: 53,
                    offset: 2,
                    draw_as: ClefDrawType.F,
                },
            },
        ],
        patches: {
            [PlayerType.Solo]: {
                [Expression.Natural]: "/patches/tuba/natural.json",
                [Expression.Staccato]: "/patches/tuba/staccato.json",
            },
            [PlayerType.Section]: {
                [Expression.Natural]: "/patches/tuba/natural.json",
                [Expression.Staccato]: "/patches/tuba/staccato.json",
            },
        },
    },
    {
        id: "guitar.acoustic",
        instrument_type: InstrumentType.Melodic,
        path: ["Guitar", "Acoustic Guitar"],
        long_name: "Acoustic Guitar",
        short_name: "A. Gtr.",
        staves: [
            {
                lines: [1, 0, 1, 0, 1, 0, 1, 0, 1],
                clef: {
                    pitch: 53,
                    offset: 2,
                    draw_as: ClefDrawType.F,
                },
            },
        ],
        patches: {
            [PlayerType.Solo]: {
                [Expression.Natural]: "/patches/acoustic-guitar/natural.json",
            },
            [PlayerType.Section]: {
                [Expression.Natural]: "/patches/acoustic-guitar/natural.json",
            },
        },
    },
    {
        id: "guitar.bass",
        instrument_type: InstrumentType.Melodic,
        path: ["Guitar", "Bass Guitar"],
        long_name: "Bass Guitar",
        short_name: "B. Gtr.",
        staves: [
            {
                lines: [1, 0, 1, 0, 1, 0, 1, 0, 1],
                clef: {
                    pitch: 53,
                    offset: 2,
                    draw_as: ClefDrawType.F,
                },
            },
        ],
        patches: {
            [PlayerType.Solo]: {
                [Expression.Natural]: "/patches/bass-guitar/natural.json",
            },
            [PlayerType.Section]: {
                [Expression.Natural]: "/patches/bass-guitar/natural.json",
            },
        },
    },
    {
        id: "guitar.distortion",
        instrument_type: InstrumentType.Melodic,
        path: ["Guitar", "Distortion Guitar"],
        long_name: "Distortion Guitar",
        short_name: "Gtr.",
        staves: [
            {
                lines: [1, 0, 1, 0, 1, 0, 1, 0, 1],
                clef: {
                    pitch: 53,
                    offset: 2,
                    draw_as: ClefDrawType.F,
                },
            },
        ],
        patches: {
            [PlayerType.Solo]: {
                [Expression.Natural]: "/patches/distortion-guitar/natural.json",
            },
            [PlayerType.Section]: {
                [Expression.Natural]: "/patches/distortion-guitar/natural.json",
            },
        },
    },
    {
        id: "unpitched-percussion.crash-cymbal",
        instrument_type: InstrumentType.Percussive,
        path: ["Unpitched Percussion", "Crash Cymbal"],
        long_name: "Crash Cymbal",
        short_name: "Cym.",
        staves: [
            {
                lines: [1],
                clef: {
                    pitch: 60,
                    offset: 0,
                    draw_as: ClefDrawType.Percussion,
                },
            },
        ],
        patches: {
            [PlayerType.Solo]: {
                [Expression.Natural]: "/patches/kit-crash/natural.json",
            },
            [PlayerType.Section]: {
                [Expression.Natural]: "/patches/kit-crash/natural.json",
            },
        },
    },
    {
        id: "unpitched-percussion.hi-hat",
        instrument_type: InstrumentType.Percussive,
        path: ["Unpitched Percussion", "Hi-Hat"],
        long_name: "Hi-Hat",
        short_name: "HH.",
        staves: [
            {
                lines: [1],
                clef: {
                    pitch: 60,
                    offset: 0,
                    draw_as: ClefDrawType.Percussion,
                },
            },
        ],
        patches: {
            [PlayerType.Solo]: {
                [Expression.Natural]: "/patches/kit-hihat/natural.json",
            },
            [PlayerType.Section]: {
                [Expression.Natural]: "/patches/kit-hihat/natural.json",
            },
        },
    },
    {
        id: "unpitched-percussion.kick",
        instrument_type: InstrumentType.Percussive,
        path: ["Unpitched Percussion", "Kick Drum"],
        long_name: "Kick Drum",
        short_name: "K Drm.",
        staves: [
            {
                lines: [1],
                clef: {
                    pitch: 60,
                    offset: 0,
                    draw_as: ClefDrawType.Percussion,
                },
            },
        ],
        patches: {
            [PlayerType.Solo]: {
                [Expression.Natural]: "/patches/kit-kicks/natural.json",
            },
            [PlayerType.Section]: {
                [Expression.Natural]: "/patches/kit-kicks/natural.json",
            },
        },
    },
    {
        id: "unpitched-percussion.snare",
        instrument_type: InstrumentType.Percussive,
        path: ["Unpitched Percussion", "Snare"],
        long_name: "Snare",
        short_name: "Sn.",
        staves: [
            {
                lines: [1],
                clef: {
                    pitch: 60,
                    offset: 0,
                    draw_as: ClefDrawType.Percussion,
                },
            },
        ],
        patches: {
            [PlayerType.Solo]: {
                [Expression.Natural]: "/patches/snare/natural.json",
            },
            [PlayerType.Section]: {
                [Expression.Natural]: "/patches/snare/natural.json",
            },
        },
    },
    {
        id: "pitched-percussion.glockenspiel",
        instrument_type: InstrumentType.Melodic,
        path: ["Pitched Percussion", "Glockenspiel"],
        long_name: "Glokenspiel",
        short_name: "Glock.",
        staves: [
            {
                lines: [1, 0, 1, 0, 1, 0, 1, 0, 1],
                clef: {
                    pitch: 67,
                    offset: -2,
                    draw_as: ClefDrawType.G,
                },
            },
        ],
        patches: {
            [PlayerType.Solo]: {
                [Expression.Natural]: "/patches/glockenspiel/natural.json",
            },
            [PlayerType.Section]: {
                [Expression.Natural]: "/patches/glockenspiel/natural.json",
            },
        },
    },
    {
        id: "pitched-percussion.harp",
        instrument_type: InstrumentType.Melodic,
        path: ["Pitched Percussion", "Harp"],
        long_name: "Harp",
        short_name: "Hrp.",
        staves: [
            {
                lines: [1, 0, 1, 0, 1, 0, 1, 0, 1],
                clef: {
                    pitch: 67,
                    offset: -2,
                    draw_as: ClefDrawType.G,
                },
            },
            {
                lines: [1, 0, 1, 0, 1, 0, 1, 0, 1],
                clef: {
                    pitch: 53,
                    offset: 2,
                    draw_as: ClefDrawType.F,
                },
            },
        ],
        patches: {
            [PlayerType.Solo]: {
                [Expression.Natural]: "/patches/harp/natural.json",
            },
            [PlayerType.Section]: {
                [Expression.Natural]: "/patches/harp/natural.json",
            },
        },
    },
    {
        id: "pitched-percussion.marimba",
        instrument_type: InstrumentType.Melodic,
        path: ["Pitched Percussion", "Marimba"],
        long_name: "Marimba",
        short_name: "Mrm.",
        staves: [
            {
                lines: [1, 0, 1, 0, 1, 0, 1, 0, 1],
                clef: {
                    pitch: 67,
                    offset: -2,
                    draw_as: ClefDrawType.G,
                },
            },
            {
                lines: [1, 0, 1, 0, 1, 0, 1, 0, 1],
                clef: {
                    pitch: 53,
                    offset: 2,
                    draw_as: ClefDrawType.F,
                },
            },
        ],
        patches: {
            [PlayerType.Solo]: {
                [Expression.Natural]: "/patches/marimba/natural.json",
            },
            [PlayerType.Section]: {
                [Expression.Natural]: "/patches/marimba/natural.json",
            },
        },
    },
    {
        id: "pitched-percussion.timpani",
        instrument_type: InstrumentType.Melodic,
        path: ["Pitched Percussion", "Timpani"],
        long_name: "Timpani",
        short_name: "Timp.",
        staves: [
            {
                lines: [1, 0, 1, 0, 1, 0, 1, 0, 1],
                clef: {
                    pitch: 53,
                    offset: 2,
                    draw_as: ClefDrawType.F,
                },
            },
        ],
        patches: {
            [PlayerType.Solo]: {
                [Expression.Natural]: "/patches/timpani/natural.json",
                [Expression.Tremolo]: "/patches/timpani/roll.json",
            },
            [PlayerType.Section]: {
                [Expression.Natural]: "/patches/timpani/natural.json",
                [Expression.Tremolo]: "/patches/timpani/roll.json",
            },
        },
    },
    {
        id: "pitched-percussion.vibraphone",
        instrument_type: InstrumentType.Melodic,
        path: ["Pitched Percussion", "Vibraphone"],
        long_name: "Vibraphone",
        short_name: "Vib.",
        staves: [
            {
                lines: [1, 0, 1, 0, 1, 0, 1, 0, 1],
                clef: {
                    pitch: 67,
                    offset: -2,
                    draw_as: ClefDrawType.G,
                },
            },
        ],
        patches: {
            [PlayerType.Solo]: {
                [Expression.Natural]: "/patches/vibraphone/natural.json",
            },
            [PlayerType.Section]: {
                [Expression.Natural]: "/patches/vibraphone/natural.json",
            },
        },
    },
    {
        id: "pitched-percussion.xylophone",
        instrument_type: InstrumentType.Melodic,
        path: ["Pitched Percussion", "Xylophone"],
        long_name: "Xylophone",
        short_name: "Xyl.",
        staves: [
            {
                lines: [1, 0, 1, 0, 1, 0, 1, 0, 1],
                clef: {
                    pitch: 79,
                    offset: -2,
                    draw_as: ClefDrawType.G,
                },
            },
        ],
        patches: {
            [PlayerType.Solo]: {
                [Expression.Natural]: "/patches/xylophone/natural.json",
            },
            [PlayerType.Section]: {
                [Expression.Natural]: "/patches/xylophone/natural.json",
            },
        },
    },
    {
        id: "keyboard.celesta",
        instrument_type: InstrumentType.Melodic,
        path: ["Keyboards", "Celesta"],
        long_name: "Celesta",
        short_name: "Cel.",
        staves: [
            {
                lines: [1, 0, 1, 0, 1, 0, 1, 0, 1],
                clef: {
                    pitch: 79,
                    offset: -2,
                    draw_as: ClefDrawType.G,
                },
            },
            {
                lines: [1, 0, 1, 0, 1, 0, 1, 0, 1],
                clef: {
                    pitch: 65,
                    offset: 2,
                    draw_as: ClefDrawType.F,
                },
            },
        ],
        patches: {
            [PlayerType.Solo]: {
                [Expression.Natural]: "/patches/celesta/natural.json",
            },
            [PlayerType.Section]: {
                [Expression.Natural]: "/patches/celesta/natural.json",
            },
        },
    },
    {
        id: "keyboard.harpsichord",
        instrument_type: InstrumentType.Melodic,
        path: ["Keyboards", "Harpsichord"],
        long_name: "Harpsichord",
        short_name: "Hch.",
        staves: [
            {
                lines: [1, 0, 1, 0, 1, 0, 1, 0, 1],
                clef: {
                    pitch: 67,
                    offset: -2,
                    draw_as: ClefDrawType.G,
                },
            },
            {
                lines: [1, 0, 1, 0, 1, 0, 1, 0, 1],
                clef: {
                    pitch: 53,
                    offset: 2,
                    draw_as: ClefDrawType.F,
                },
            },
        ],
        patches: {
            [PlayerType.Solo]: {
                [Expression.Natural]: "/patches/harpsichord/natural.json",
            },
            [PlayerType.Section]: {
                [Expression.Natural]: "/patches/harpsichord/natural.json",
            },
        },
    },
    {
        id: "keyboard.piano",
        instrument_type: InstrumentType.Melodic,
        path: ["Keyboards", "Piano"],
        long_name: "Piano",
        short_name: "Pno.",
        staves: [
            {
                lines: [1, 0, 1, 0, 1, 0, 1, 0, 1],
                clef: {
                    pitch: 67,
                    offset: -2,
                    draw_as: ClefDrawType.G,
                },
            },
            {
                lines: [1, 0, 1, 0, 1, 0, 1, 0, 1],
                clef: {
                    pitch: 53,
                    offset: 2,
                    draw_as: ClefDrawType.F,
                },
            },
        ],
        patches: {
            [PlayerType.Solo]: {
                [Expression.Natural]: "/patches/piano/natural.json",
            },
            [PlayerType.Section]: {
                [Expression.Natural]: "/patches/piano/natural.json",
            },
        },
    },
    {
        id: "strings.contrabass",
        instrument_type: InstrumentType.Melodic,
        path: ["Strings", "Contrabass"],
        long_name: "Contrabass",
        short_name: "Cb.",
        staves: [
            {
                lines: [1, 0, 1, 0, 1, 0, 1, 0, 1],
                clef: {
                    pitch: 41,
                    offset: 2,
                    draw_as: ClefDrawType.F,
                },
            },
        ],
        patches: {
            [PlayerType.Solo]: {
                [Expression.Natural]: "/patches/contrabass/natural.json",
                [Expression.Pizzicato]: "/patches/contrabass/pizzicato.json",
                [Expression.Staccato]: "/patches/contrabass/spiccato.json",
            },
            [PlayerType.Section]: {
                [Expression.Natural]:
                    "/patches/contrabass-[PlayerType.Section]/natural.json",
                [Expression.Pizzicato]:
                    "/patches/contrabass-[PlayerType.Section]/pizzicato.json",
                [Expression.Staccato]:
                    "/patches/contrabass-[PlayerType.Section]/spiccato.json",
            },
        },
    },
    {
        id: "strings.viola",
        instrument_type: InstrumentType.Melodic,
        path: ["Strings", "Viola"],
        long_name: "Viola",
        short_name: "Vla.",
        staves: [
            {
                lines: [1, 0, 1, 0, 1, 0, 1, 0, 1],
                clef: {
                    pitch: 60,
                    offset: 0,
                    draw_as: ClefDrawType.C,
                },
            },
        ],
        patches: {
            [PlayerType.Solo]: {
                [Expression.Natural]: "/patches/viola/natural.json",
                [Expression.Pizzicato]: "/patches/viola/pizzicato.json",
                [Expression.Staccato]: "/patches/viola/staccato.json",
            },
            [PlayerType.Section]: {
                [Expression.Natural]:
                    "/patches/viola-[PlayerType.Section]/natural.json",
                [Expression.Pizzicato]:
                    "/patches/viola-[PlayerType.Section]/pizzicato.json",
                [Expression.Staccato]:
                    "/patches/viola-[PlayerType.Section]/staccato.json",
            },
        },
    },
    {
        id: "strings.violin",
        instrument_type: InstrumentType.Melodic,
        path: ["Strings", "Violin"],
        long_name: "Violin",
        short_name: "Vln.",
        staves: [
            {
                lines: [1, 0, 1, 0, 1, 0, 1, 0, 1],
                clef: {
                    pitch: 67,
                    offset: -2,
                    draw_as: ClefDrawType.G,
                },
            },
        ],
        patches: {
            [PlayerType.Solo]: {
                [Expression.Natural]: "/patches/violin/natural.json",
                [Expression.Pizzicato]: "/patches/violin/pizzicato.json",
                [Expression.Staccato]: "/patches/violin/spiccato.json",
                [Expression.Tremolo]: "/patches/violin/tremolo.json",
            },
            [PlayerType.Section]: {
                [Expression.Natural]:
                    "/patches/violin-[PlayerType.Section]/natural.json",
                [Expression.Pizzicato]:
                    "/patches/violin-[PlayerType.Section]/pizzicato.json",
                [Expression.Staccato]:
                    "/patches/violin-[PlayerType.Section]/spiccato.json",
                [Expression.Tremolo]:
                    "/patches/violin-[PlayerType.Section]/tremolo.json",
            },
        },
    },
    {
        id: "strings.violoncello",
        instrument_type: InstrumentType.Melodic,
        path: ["Strings", "Violoncello"],
        long_name: "Violoncello",
        short_name: "Vc.",
        staves: [
            {
                lines: [1, 0, 1, 0, 1, 0, 1, 0, 1],
                clef: {
                    pitch: 53,
                    offset: 2,
                    draw_as: ClefDrawType.F,
                },
            },
        ],
        patches: {
            [PlayerType.Solo]: {
                [Expression.Natural]: "/patches/violoncello/natural.json",
                [Expression.Pizzicato]: "/patches/violoncello/pizzicato.json",
                [Expression.Staccato]: "/patches/violoncello/staccato.json",
            },
            [PlayerType.Section]: {
                [Expression.Natural]:
                    "/patches/violoncello-[PlayerType.Section]/natural.json",
                [Expression.Pizzicato]:
                    "/patches/violoncello-[PlayerType.Section]/pizzicato.json",
                [Expression.Staccato]:
                    "/patches/violoncello-[PlayerType.Section]/staccato.json",
            },
        },
    },
    {
        id: "woodwinds.alto-flute",
        instrument_type: InstrumentType.Melodic,
        path: ["Woodwinds", "Alto Flute"],
        long_name: "Alto Flute",
        short_name: "A. Fl.",
        staves: [
            {
                lines: [1, 0, 1, 0, 1, 0, 1, 0, 1],
                clef: {
                    pitch: 67,
                    offset: -2,
                    draw_as: ClefDrawType.G,
                },
            },
        ],
        patches: {
            [PlayerType.Solo]: {
                [Expression.Natural]: "/patches/alto-flute/natural.json",
            },
            [PlayerType.Section]: {
                [Expression.Natural]: "/patches/alto-flute/natural.json",
            },
        },
    },
    {
        id: "woodwinds.alto-sxophone",
        instrument_type: InstrumentType.Melodic,
        path: ["Woodwinds", "Alto Saxophone"],
        long_name: "Alto Saxophone",
        short_name: "A. Sax.",
        staves: [
            {
                lines: [1, 0, 1, 0, 1, 0, 1, 0, 1],
                clef: {
                    pitch: 67,
                    offset: -2,
                    draw_as: ClefDrawType.G,
                },
            },
        ],
        patches: {
            [PlayerType.Solo]: {
                [Expression.Natural]: "/patches/alto-saxophone/natural.json",
                [Expression.Staccato]: "/patches/alto-saxophone/staccato.json",
            },
            [PlayerType.Section]: {
                [Expression.Natural]: "/patches/alto-saxophone/natural.json",
                [Expression.Staccato]: "/patches/alto-saxophone/staccato.json",
            },
        },
    },
    {
        id: "woodwinds.bassoon",
        instrument_type: InstrumentType.Melodic,
        path: ["Woodwinds", "Bassoon"],
        long_name: "Bassoon",
        short_name: "Bsn.",
        staves: [
            {
                lines: [1, 0, 1, 0, 1, 0, 1, 0, 1],
                clef: {
                    pitch: 53,
                    offset: 2,
                    draw_as: ClefDrawType.F,
                },
            },
        ],
        patches: {
            [PlayerType.Solo]: {
                [Expression.Natural]: "/patches/bassoon/natural.json",
                [Expression.Staccato]: "/patches/bassoon/staccato.json",
            },
            [PlayerType.Section]: {
                [Expression.Natural]: "/patches/bassoon/natural.json",
                [Expression.Staccato]: "/patches/bassoon/staccato.json",
            },
        },
    },
    {
        id: "woodwinds.bass-clarinet",
        instrument_type: InstrumentType.Melodic,
        path: ["Woodwinds", "Bass Clarinet"],
        long_name: "Bass Clarinet",
        short_name: "B. Cl.",
        staves: [
            {
                lines: [1, 0, 1, 0, 1, 0, 1, 0, 1],
                clef: {
                    pitch: 67,
                    offset: -2,
                    draw_as: ClefDrawType.G,
                },
            },
        ],
        patches: {
            [PlayerType.Solo]: {
                [Expression.Natural]: "/patches/bass-clarinet/natural.json",
                [Expression.Staccato]: "/patches/bass-clarinet/staccato.json",
            },
            [PlayerType.Section]: {
                [Expression.Natural]: "/patches/bass-clarinet/natural.json",
                [Expression.Staccato]: "/patches/bass-clarinet/staccato.json",
            },
        },
    },
    {
        id: "woodwinds.clarinet.a",
        instrument_type: InstrumentType.Melodic,
        path: ["Woodwinds", "Clarinet", "A"],
        long_name: "Clarinet in A",
        short_name: "A Cl.",
        staves: [
            {
                lines: [1, 0, 1, 0, 1, 0, 1, 0, 1],
                clef: {
                    pitch: 67,
                    offset: -2,
                    draw_as: ClefDrawType.G,
                },
            },
        ],
        patches: {
            [PlayerType.Solo]: {
                [Expression.Natural]: "/patches/clarinet/natural.json",
                [Expression.Staccato]: "/patches/clarinet/staccato.json",
            },
            [PlayerType.Section]: {
                [Expression.Natural]: "/patches/clarinet/natural.json",
                [Expression.Staccato]: "/patches/clarinet/staccato.json",
            },
        },
    },
    {
        id: "woodwinds.clarinet.b-flat",
        instrument_type: InstrumentType.Melodic,
        path: ["Woodwinds", "Clarinet", "B${flat}"],
        long_name: "Clarinet in B${flat}",
        short_name: "B${flat} Cl.",
        staves: [
            {
                lines: [1, 0, 1, 0, 1, 0, 1, 0, 1],
                clef: {
                    pitch: 67,
                    offset: -2,
                    draw_as: ClefDrawType.G,
                },
            },
        ],
        patches: {
            [PlayerType.Solo]: {
                [Expression.Natural]: "/patches/clarinet/natural.json",
                [Expression.Staccato]: "/patches/clarinet/staccato.json",
            },
            [PlayerType.Section]: {
                [Expression.Natural]: "/patches/clarinet/natural.json",
                [Expression.Staccato]: "/patches/clarinet/staccato.json",
            },
        },
    },
    {
        id: "woodwinds.contrabassoon",
        instrument_type: InstrumentType.Melodic,
        path: ["Woodwinds", "Contrabassoon"],
        long_name: "Contrabasson",
        short_name: "Cbsn.",
        staves: [
            {
                lines: [1, 0, 1, 0, 1, 0, 1, 0, 1],
                clef: {
                    pitch: 53,
                    offset: 2,
                    draw_as: ClefDrawType.F,
                },
            },
        ],
        patches: {
            [PlayerType.Solo]: {
                [Expression.Natural]: "/patches/contrabassoon/natural.json",
            },
            [PlayerType.Section]: {
                [Expression.Natural]: "/patches/contrabassoon/natural.json",
            },
        },
    },
    {
        id: "woodwinds.english-horn",
        instrument_type: InstrumentType.Melodic,
        path: ["Woodwinds", "English Horn"],
        long_name: "English Horn",
        short_name: "E Hn.",
        staves: [
            {
                lines: [1, 0, 1, 0, 1, 0, 1, 0, 1],
                clef: {
                    pitch: 67,
                    offset: -2,
                    draw_as: ClefDrawType.G,
                },
            },
        ],
        patches: {
            [PlayerType.Solo]: {
                [Expression.Natural]: "/patches/cor-anglais/natural.json",
                [Expression.Staccato]: "/patches/cor-anglais/staccato.json",
            },
            [PlayerType.Section]: {
                [Expression.Natural]: "/patches/cor-anglais/natural.json",
                [Expression.Staccato]: "/patches/cor-anglais/staccato.json",
            },
        },
    },
    {
        id: "woodwinds.flute",
        instrument_type: InstrumentType.Melodic,
        path: ["Woodwinds", "Flute"],
        long_name: "Flute",
        short_name: "Fl.",
        staves: [
            {
                lines: [1, 0, 1, 0, 1, 0, 1, 0, 1],
                clef: {
                    pitch: 67,
                    offset: -2,
                    draw_as: ClefDrawType.G,
                },
            },
        ],
        patches: {
            [PlayerType.Solo]: {
                [Expression.Natural]: "/patches/flute/natural.json",
                [Expression.Staccato]: "/patches/flute/staccato.json",
            },
            [PlayerType.Section]: {
                [Expression.Natural]: "/patches/flute/natural.json",
                [Expression.Staccato]: "/patches/flute/staccato.json",
            },
        },
    },
    {
        id: "woodwinds.oboe",
        instrument_type: InstrumentType.Melodic,
        path: ["Woodwinds", "Oboe"],
        long_name: "Oboe",
        short_name: "Ob.",
        staves: [
            {
                lines: [1, 0, 1, 0, 1, 0, 1, 0, 1],
                clef: {
                    pitch: 67,
                    offset: -2,
                    draw_as: ClefDrawType.G,
                },
            },
        ],
        patches: {
            [PlayerType.Solo]: {
                [Expression.Natural]: "/patches/oboe/natural.json",
                [Expression.Staccato]: "/patches/oboe/staccato.json",
            },
            [PlayerType.Section]: {
                [Expression.Natural]: "/patches/oboe/natural.json",
                [Expression.Staccato]: "/patches/oboe/staccato.json",
            },
        },
    },
    {
        id: "woodwinds.piccolo",
        instrument_type: InstrumentType.Melodic,
        path: ["Woodwinds", "Piccolo"],
        long_name: "Piccolo",
        short_name: "Pc.",
        staves: [
            {
                lines: [1, 0, 1, 0, 1, 0, 1, 0, 1],
                clef: {
                    pitch: 79,
                    offset: -2,
                    draw_as: ClefDrawType.G,
                },
            },
        ],
        patches: {
            [PlayerType.Solo]: {
                [Expression.Natural]: "/patches/piccolo/natural.json",
                [Expression.Staccato]: "/patches/piccolo/staccato.json",
            },
            [PlayerType.Section]: {
                [Expression.Natural]: "/patches/piccolo/natural.json",
                [Expression.Staccato]: "/patches/piccolo/staccato.json",
            },
        },
    },
];

export function get_def(id: string) {
    return defs.find((def) => def.id === id);
}

export function get_patches(id: string, player_type: PlayerType) {
    const def = get_def(id);
    return def.patches[player_type];
}

export function get_full_path_from_partial(
    selection: string[]
): { path: string[]; id: string } {
    const def = defs.find((def) => {
        for (let i = 0; i < selection.length; i++) {
            if (selection[i] !== def.path[i]) {
                // we have a mis-match
                return false;
            }
        }
        // we have run out of selection so the first def is the one we want even if partial
        return true;
    });

    return {
        path: def.path,
        id: def.id,
    };
}

export function useDefsList(path: string[]): string[][] {
    return useMemo(() => {
        const seen: Set<string> = new Set();
        const tree: string[][] = [[], [], []];
        defs.forEach((def) => {
            for (let i = 0; i < def.path.length; i++) {
                if (!seen.has(def.path[i])) {
                    tree[i].push(def.path[i]);
                    seen.add(def.path[i]);
                }
                if (def.path[i] !== path[i]) {
                    break;
                }
            }
        });
        return tree;
    }, [path]);
}
