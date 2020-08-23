export enum Status {
    Pending,
    Ready,
    Error,
}

export interface PatchFromFile {
    envelope: {
        attack: number;
        release: number;
    };
    samples: {
        [note: string]: string;
    };
}

export interface PlaybackInstrument {
    key: string;
    id: string;
    status: Status;
    progress: number;
    expressions: {
        [key: number]: {
            key: number;
            status: Status;
            progress: number;
        };
    };
}

export interface PlaybackDefs {
    metronome: boolean;
    transport: {
        playing: boolean;
    };
    instruments: {
        [instrumentKey: string]: PlaybackInstrument;
    };
}
