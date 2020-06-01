import React, { FC } from "react";
import { unstable_createRoot as createRoot } from "react-dom";
import { Title } from "./title";
import { Composer } from "./composer";

const Root: FC = () => {
    return (
        <>
            <Composer />
            <Title />
        </>
    );
};

const root = document.getElementById("root") as HTMLElement;
createRoot(root).render(<Root />);
