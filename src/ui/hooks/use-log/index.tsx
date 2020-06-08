import React, { useState, useEffect } from "react";
import { unstable_createRoot as createRoot, Root } from "react-dom";
import { ObjectInspector } from "react-inspector";

/**
 * Hook: Logs state to a seperate window, auto updating with the most current values.
 */
export function useLog(data: any, rootName: string) {
    const [root, setRoot] = useState<Root | null>(null);

    // init
    useEffect(() => {
        const view = window.open(
            "",
            "ui-debug",
            "menubar=no,toolbar=no,location=no,titlebar=no,status=no"
        );
        if (view) {
            const element = view.document.getElementById("ui-debug--root");
            if (!element) {
                const element = view.document.createElement("div");
                element.id = "ui-debug--root";
                view.document.body.append(element);
                setRoot(createRoot(element));
            } else {
                setRoot(createRoot(element));
            }
        }
    }, []);

    // render updates
    useEffect(() => {
        if (root) {
            root.render(<ObjectInspector data={data} name={rootName} expandLevel={1} />);
        }
    }, [root, data, rootName]);
}
