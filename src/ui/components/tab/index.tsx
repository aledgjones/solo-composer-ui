import React, { FC, useRef, useCallback, useEffect } from "react";

import { merge } from "../../utils/merge";

import "./styles.css";

interface Props {
    value: any;
}

/**
 * Tab component to be used inside the Tabs component;
 */
export const Tab: FC<Props> = ({ children }) => {
    return <>{children}</>;
};

interface PropsExtended extends Props {
    selected: boolean;
    onChange: (value: any) => void;
    setBar: (value: { left: number; width: number }) => void;
}

/**
 * Tab component to be used inside the Tabs component;
 */
export const TabExtended: FC<PropsExtended> = ({ children, value, selected, onChange, setBar }) => {
    const ref = useRef<HTMLButtonElement>(null);

    const onClick = useCallback(() => {
        if (onChange) {
            onChange(value);
        }
    }, [value, onChange]);

    useEffect(() => {
        if (setBar && selected && ref.current) {
            setBar({ left: ref.current.offsetLeft, width: ref.current.offsetWidth });
        }
    }, [selected, setBar, ref]);

    return (
        <button ref={ref} className={merge("ui-tab", { "ui-tab--selected": selected })} onClick={onClick}>
            {children}
        </button>
    );
};
