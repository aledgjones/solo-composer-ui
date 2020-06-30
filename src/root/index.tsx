import React, { FC, useEffect, Suspense } from "react";
import { mdiUndo, mdiRedo } from "@mdi/js";
import { useStore, actions, ThemeMode, View, useAutoSetup } from "../../store";
import { Tabs, useTheme, merge, Tab, Icon } from "../../ui";
import { Transport } from "./transport";
import { Loading } from "../components/loading";
import { File } from "./file";

import "./styles.css";

const Setup = React.lazy(() => import("../setup"));
// const Write = React.lazy(() => import("../../routes/write"));
// const Engrave = React.lazy(() => import("../../routes/engrave"));
const Play = React.lazy(() => import("../play"));

export const Root: FC = () => {
    const [view, theme] = useStore((s) => [s.ui.view, s.app.theme]);
    useTheme(theme === ThemeMode.Light ? "#888888" : "#252429");
    useAutoSetup();

    useEffect(() => {
        if (theme == ThemeMode.Light) {
            document.body.classList.remove("ui-dark");
            document.body.classList.add("ui-light");
        } else {
            document.body.classList.remove("ui-light");
            document.body.classList.add("ui-dark");
        }
    }, [theme]);

    return (
        <div
            className={merge("root", {
                "root--light": theme === ThemeMode.Light,
                "root--dark": theme === ThemeMode.Dark
            })}
        >
            <div className="root__title-bar">
                <File />
                <Tabs className="root__tabs" value={view} onChange={actions.ui.view}>
                    <Tab value={View.Setup}>Setup</Tab>
                    <Tab value={View.Write}>Write</Tab>
                    <Tab value={View.Engrave}>Engrave</Tab>
                    <Tab value={View.Play}>Sequence</Tab>
                    <Tab value={View.Print}>Publish</Tab>
                </Tabs>
                <Transport />
                <div className="root__history">
                    <Icon disabled onClick={() => false} className="root__history-icon" size={24} path={mdiUndo} />
                    <Icon disabled onClick={() => false} size={24} path={mdiRedo} />
                </div>
            </div>

            <div className="root__content">
                <Suspense fallback={<Loading />}>
                    {view === View.Setup && <Setup />}
                    {/* {tab === TabState.write && <Write />}
                    {tab === TabState.engrave && <Engrave />} */}
                    {view === View.Play && <Play />}
                    {/* {tab === TabState.print && <Fallback color={theme.background[500].fg} type="empty" />} */}
                </Suspense>
            </div>
        </div>
    );
};
