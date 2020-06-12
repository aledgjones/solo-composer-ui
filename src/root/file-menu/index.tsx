import React, { FC, useEffect, useRef, useState } from "react";
import { mdiMenu } from "@mdi/js";
import { Icon, Card, Content, Subheader, Label, List, ListItem, Divider, Button } from "../../ui";
import { About } from "../../dialogs/about";
import { Help } from "../../dialogs/help";
import { Preferences } from "../../dialogs/preferences";
import { useStore } from "../../../store";

import "./styles.css";

export const FileMenu: FC = () => {
    const meta = useStore((s) => s.score.meta);

    const element = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const [about, setAbout] = useState(process.env.NODE_ENV === "production");
    const [preferences, setPreferences] = useState(false);
    const [help, setHelp] = useState(false);

    const [update, setUpdate] = useState<() => void>();
    useEffect(() => {
        setUpdate(() => {
            return () => {
                console.log("UPDATE triggered");
            };
        });
    }, []);

    // auto close
    useEffect(() => {
        const cb = (e: any) => {
            if (!element.current || !element.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("click", cb);
        return () => document.removeEventListener("click", cb);
    }, [element]);

    return (
        <>
            <div className="file-menu__container" ref={element}>
                {!open && update && <div className="file-menu__dot file-menu__dot--badge" />}
                <Icon
                    className="file-menu__icon"
                    path={mdiMenu}
                    size={24}
                    onClick={() => setOpen((o) => !o)}
                />
                {open && (
                    <Card className="file-menu">
                        <Content className="file-menu__current">
                            <Subheader>Current Score</Subheader>
                            <div className="file-menu__meta">
                                <Label>
                                    <p>{meta.title}</p>
                                    <p>{meta.composer}</p>
                                </Label>
                            </div>
                            <div className="file-menu__buttons">
                                <Button disabled outline>
                                    My Library
                                </Button>
                            </div>
                        </Content>
                        <List onClick={() => setOpen(false)}>
                            <ListItem onClick={() => setPreferences(true)}>Preferences</ListItem>
                            <Divider />
                            {update && (
                                <>
                                    <ListItem onClick={update}>
                                        <Label>
                                            <p>Update available</p>
                                            <p>Restart to apply update now...</p>
                                        </Label>
                                        <div className="file-menu__dot" />
                                    </ListItem>
                                    <Divider />
                                </>
                            )}
                            <ListItem onClick={() => setHelp(true)}>Help &amp; Feedback</ListItem>
                            <ListItem onClick={() => setAbout(true)}>About</ListItem>
                        </List>
                    </Card>
                )}
            </div>

            <Help open={help} width={500} onClose={() => setHelp(false)} />
            <About width={400} open={about} onClose={() => setAbout(false)} />
            <Preferences open={preferences} width={900} onClose={() => setPreferences(false)} />
        </>
    );
};
