import React, { FC, useState } from "react";

import { useTitle } from "../../ui";
import { RenderRegion } from "../components/render-region";
import { Renderer } from "../components/renderer";
// import { EngraveSettings } from "../../dialogs/engrave-settings";

import "./styles.css";

const Write: FC = () => {
    useTitle("Solo Composer | Write");
    const [settings, setSettings] = useState(false);

    return (
        <>
            <div className="write">
                <RenderRegion className="write__renderer">
                    <Renderer />
                </RenderRegion>
            </div>

            {/* <EngraveSettings
                open={settings}
                width={900}
                onClose={() => setSettings(false)}
            /> */}
        </>
    );
};

export default Write;
