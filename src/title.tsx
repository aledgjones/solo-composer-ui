import React, { FC } from "react";
import { Select, Option, Label } from "solo-ui";
import { useStore, useActions } from "./use-store";
import { ThemeMode } from "solo-composer-parser";

export const Title: FC = () => {
    const { mode, pallet } = useStore((s) => {
        return {
            mode: s.app.theme.mode,
            pallet: s.app.theme.pallets.background.shade_200
        };
    });
    const actions = useActions();
    console.log("rendered!");
    return (
        <>
            <div
                style={{
                    border: `2px solid black`,
                    borderRadius: 6,
                    margin: `20px auto`,
                    height: 100,
                    width: 100,
                    backgroundColor: pallet.background,
                    color: pallet.foreground,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background-color .2s, color: .2s"
                }}
            >
                <p>{mode === ThemeMode.Dark ? "dark" : "light"}</p>
            </div>
            <Select label="Theme" value={mode} color="blue" onChange={(value) => actions.app.theme(value)}>
                <Option value={ThemeMode.Dark} displayAs="Dark">
                    <Label>
                        <p>Dark</p>
                        <p>Default</p>
                    </Label>
                </Option>
                <Option value={ThemeMode.Light} displayAs="Light">
                    <Label>
                        <p>Light</p>
                    </Label>
                </Option>
            </Select>
        </>
    );
};
