import React, { FC, Suspense } from "react";
import { mdiUndo, mdiRedo } from "@mdi/js";
import { Tabs, Tab, Icon } from "../../ui";
import { TransportComponent } from "./transport";
import { Loading } from "../components/loading";
import { useStore } from "../store/use-store";
import { actions } from "../store/actions";
import { View } from "../store/ui/defs";
import { File } from "./file";
import { Console } from "../components/console";

import "./styles.css";

const Setup = React.lazy(() => import("../setup"));
const Write = React.lazy(() => import("../write"));
// const Engrave = React.lazy(() => import("../../routes/engrave"));
const Play = React.lazy(() => import("../play"));

export const Root: FC = () => {
  const [view] = useStore((s) => [s.ui.view]);

  return (
    <>
      <div className="root">
        <div className="root__title-bar">
          <File />
          <Tabs className="root__tabs" value={view} onChange={actions.ui.view}>
            <Tab value={View.Setup}>Setup</Tab>
            <Tab value={View.Write}>Write</Tab>
            <Tab value={View.Engrave}>Engrave</Tab>
            <Tab value={View.Play}>Sequence</Tab>
            <Tab value={View.Print}>Publish</Tab>
          </Tabs>
          <TransportComponent />
          <div className="root__spacer" />
          <div className="root__history">
            <Icon
              disabled
              onClick={() => false}
              className="root__history-icon"
              size={24}
              path={mdiUndo}
            />
            <Icon disabled onClick={() => false} size={24} path={mdiRedo} />
          </div>
        </div>

        <div className="root__content">
          <Suspense fallback={<Loading />}>
            {view === View.Setup && <Setup />}
            {view === View.Write && <Write />}
            {/* {tab === TabState.engrave && <Engrave />} */}
            {view === View.Play && <Play />}
            {/* {tab === TabState.print && <Fallback color={theme.background[500].fg} type="empty" />} */}
          </Suspense>
        </div>
      </div>

      <Console />

      {/* <Log /> */}
    </>
  );
};
