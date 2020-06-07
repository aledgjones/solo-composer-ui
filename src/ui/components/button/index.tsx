import React, { MouseEvent, CSSProperties, FC, useMemo } from "react";

import { merge } from "../../utils/merge";
import { useForeground } from "../../hooks/use-foreground";
import { Spinner } from "../spinner";

import "./styles.css";

interface Props {
    id?: string;
    className?: string;
    style?: CSSProperties;

    compact?: boolean;
    outline?: boolean;
    disabled?: boolean;
    working?: boolean;

    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Button component with optional outline-only styling.
 */
export const Button: FC<Props> = ({ id, className, style, children, compact, outline, disabled, working, onClick }) => {
    return (
        <button
            id={id}
            className={merge(
                "ui-button",
                {
                    "ui-button--compact": compact,
                    "ui-button--disabled": disabled || working,
                    "ui-button--outline": outline
                },
                className
            )}
            style={style}
            onClick={onClick}
        >
            {working && <Spinner className="ui-spinner--button" size={16} color="rgb(84,84,84)" />}
            {children}
        </button>
    );
};
