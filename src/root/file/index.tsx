import React, { FC, useEffect, useRef, useState } from "react";
import { mdiMenu, mdiPencilOutline } from "@mdi/js";
import { Icon, Card, Content, Subheader, Label, List, ListItem, Divider, Button } from "../../../ui";
import { About } from "../../dialogs/about";
import { Help } from "../../dialogs/help";
import { Preferences } from "../../dialogs/preferences";
import { Meta } from "../../dialogs/meta";
import { useStore } from "../../../store";
import { Duration } from "../../components/duration";

import "./styles.css";

export const File: FC = () => {
    const { title, modified } = useStore((s) => s.score.meta);

    const element = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);

    const [meta, setMeta] = useState(false);
    const [about, setAbout] = useState(process.env.NODE_ENV === "production");
    const [preferences, setPreferences] = useState(false);
    const [help, setHelp] = useState(false);

    const [update, setUpdate] = useState<() => void>();

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
                <Icon className="file-menu__icon" path={mdiMenu} size={24} onClick={() => setOpen((o) => !o)} />
                {open && (
                    <Card className="file-menu">
                        <Content>
                            <Subheader compact>Current Project</Subheader>
                        </Content>
                        <ListItem className="file-menu__meta">
                            <Label style={{ paddingRight: 16 }}>
                                {title ? <p>{title}</p> : <p className="file-menu__undefined">Untitled Project</p>}
                                <p>
                                    Updated <Duration when={modified} />
                                </p>
                            </Label>
                            <Icon
                                path={mdiPencilOutline}
                                size={24}
                                onClick={() => {
                                    setMeta(true);
                                    setOpen(false);
                                }}
                            />
                        </ListItem>
                        <Content>
                            <div className="file-menu__buttons">
                                <Button outline>My Library</Button>
                            </div>
                        </Content>
                        <Divider compact />
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

            <Meta width={900} open={meta} onClose={() => setMeta(false)} />
            <Help width={500} open={help} onClose={() => setHelp(false)} />
            <About width={400} open={about} onClose={() => setAbout(false)} />
            <Preferences open={preferences} width={900} onClose={() => setPreferences(false)} />
        </>
    );
};
