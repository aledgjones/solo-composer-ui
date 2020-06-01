import React, { FC } from "react";
import { useStore } from "./use-store";

export const Composer: FC = () => {
    const composer = useStore((s) => s.meta.composer);
    console.log("rendered Composer!");
    return <p style={{ marginBottom: 20 }}>{composer}</p>;
};
