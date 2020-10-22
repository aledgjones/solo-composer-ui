import { store } from "../use-store";

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
    }
};
