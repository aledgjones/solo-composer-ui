import { useState, useEffect, FC } from "react";
import { createPortal } from "react-dom";
import { ObjectInspector } from "react-inspector";
import { useStore } from "../../../src/store/use-store";

/**
 * Hook: Logs state to a seperate window, auto updating with the most current values.
 */
export const Log: FC = () => {
  const data = useStore((s) => s);
  const [root, setRoot] = useState<HTMLElement>(null);

  // init
  useEffect(() => {
    const view = window.open("", "ui-debug", "menubar=no,toolbar=no,location=no,titlebar=no,status=no");
    if (view) {
      view.document.body.innerHTML = "";
      const element = view.document.createElement("div");
      element.id = "ui-debug--root";
      view.document.body.append(element);
      setRoot(element);
    }
  }, []);

  if (root) {
    return createPortal(<ObjectInspector data={data} name="store" expandLevel={1} />, root);
  } else {
    return null;
  }
};
