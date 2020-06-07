import React, { FC, useState, useMemo, useCallback, ChangeEvent } from 'react';

import { merge } from '../../utils/merge';
import { InternalInputBaseProps } from './defs';

import './styles.css';

export const InputBase: FC<InternalInputBaseProps> = ({ id, className, style, type, display, label, margin, required, color, disabled, spellcheck, validate, onChange, onBlur, onFocus, children }) => {

    const [focus, setFocus] = useState<boolean>(false);
    const [touched, setTouched] = useState(false);

    const error = touched ? validate(display) : null;
    const hasValue = display !== undefined && display !== null && display !== '';

    const _onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value), [onChange]);

    const _onFocus = useCallback(() => {
        if (onFocus) {
            onFocus();
        }
        setFocus(true);
    }, [onFocus]);

    const _onBlur = useCallback(() => {
        if (onBlur) {
            onBlur();
        }
        setFocus(false);
        setTouched(true);
    }, [onBlur]);

    const highlight = useMemo(() => {
        if (disabled) {
            return undefined;
        }
        if (error) {
            return '#ff6347';
        };
        if (focus) {
            return color;
        }
        return undefined;
    }, [disabled, error, focus, color]);

    return <div
        id={id}
        className={merge('ui-input', { 'ui-input--disabled': disabled, 'ui-input--margin': margin }, className)}
    >
        {label && <p style={{ color: highlight }} className={merge("ui-input__label", { 'ui-input__label--float': focus || hasValue })}>{label}{required && '*'}</p>}
        <div
            className="ui-input__container"
            style={{ border: highlight ? `1px solid ${highlight}` : undefined, ...style }}
        >
            <input
                className="ui-input__display"
                type={type === 'password' ? 'password' : 'text'}
                value={display}
                spellCheck={spellcheck}
                onChange={_onChange}
                onFocus={_onFocus}
                onBlur={_onBlur}
            />
            {children}
        </div>
        {error && !disabled && <p className="ui-input__error-text">{error.message}</p>}
    </div>;
}