import { store } from "../use-store";
import { ThemeMode } from "./defs";

export const appActions = {
    audition: {
        toggle: () => {
            store.update((s) => {
                localStorage.setItem(
                    "sc:audition/v1",
                    JSON.stringify(!s.app.audition)
                );
                s.app.audition = !s.app.audition;
            });
        },
    },
    theme: (value: ThemeMode) => {
        store.update((s) => {
            localStorage.setItem("sc:theme-mode/v1", JSON.stringify(value));
            s.app.theme = value;
        });
    },
};
