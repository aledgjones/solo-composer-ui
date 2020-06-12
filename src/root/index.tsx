import React, { FC, useEffect, Suspense } from "react";
import { useStore, actions, ThemeMode, View } from "../../store";
import { Tabs, useTheme, merge, Tab, useLog } from "../ui";
import { FileMenu } from "./file-menu";
import { Transport } from "./transport";
import { Loading } from "../components/loading";

import "./styles.css";

const Setup = React.lazy(() => import("../setup"));
// const Write = React.lazy(() => import("../../routes/write"));
// const Engrave = React.lazy(() => import("../../routes/engrave"));
// const Play = React.lazy(() => import("../../routes/play"));

export const Root: FC = () => {
    const [view, theme, store] = useStore((s) => [s.ui.view, s.app.theme, s]);
    useTheme(theme === ThemeMode.Light ? "#ffffff" : "#101010");
    useLog(store, "store");

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
                <FileMenu />
                <Tabs className="root__tabs" value={view} onChange={actions.ui.view}>
                    <Tab value={View.Setup}>Setup</Tab>
                    <Tab value={View.Write}>Write</Tab>
                    <Tab value={View.Engrave}>Engrave</Tab>
                    <Tab value={View.Play}>Play</Tab>
                    <Tab value={View.Print}>Print</Tab>
                </Tabs>
                <Transport />
            </div>

            <div className="root__content">
                <Suspense fallback={<Loading />}>
                    {view === View.Setup && <Setup />}
                    {/* {tab === TabState.write && <Write />}
                    {tab === TabState.engrave && <Engrave />}
                    {tab === TabState.play && <Play />}
                    {tab === TabState.print && <Fallback color={theme.background[500].fg} type="empty" />} */}
                </Suspense>
            </div>
        </div>
    );
};
