import React from "react";
import { unstable_createRoot as createRoot } from "react-dom";
import { Root } from "./root";

const root = document.getElementById("root") as HTMLElement;
createRoot(root).render(<Root />);
