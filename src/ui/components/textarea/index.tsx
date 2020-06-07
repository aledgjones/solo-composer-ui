import React, { CSSProperties, FC, useState, useMemo, useCallback } from 'react';

import { merge } from '../../utils/merge';

import '../input-base/styles.css';
import './styles.css';

interface Props {
    id?: string;
    className?: string;
    style?: CSSProperties;
    color: string;

    value: any;
    label?: string;
    required?: boolean;
    disabled?: boolean;
    spellcheck?: boolean

    onChange: (value: any) => void;
}

/**
 * Auto expanding textarea component.
 */
export const Textarea: FC<Props> = ({ id, className, style, value, label, required, color, disabled, spellcheck, onChange }) => {

    const validate = useCallback((value: string) => {
        if (required && value === '') {
            return 'Required';
        } else {
            return null;
        }
    }, [required]);

    const [focus, setFocus] = useState<boolean>(false);
    const [touched, setTouched] = useState(false);
    const error = touched ? validate(value) : null;
    const hasValue = value !== undefined && value !== null && value !== '';

    const highlight = useMemo(() => {
        if (error) {
            return '#ff6347'
        };
        if (focus) {
            return color;
        }
        return undefined;
    }, [error, focus, color])

    return <div
        id={id}
        className={merge('ui-textarea', 'ui-input', { 'ui-input--disabled': disabled }, className)}
    >
        {label && <p style={{ color: highlight }} className={merge("ui-input__label", { 'ui-input__label--float': focus || hasValue })}>{label}{required && '*'}</p>}
        <div
            className="ui-input__container ui-textarea__container"
            style={{ border: highlight ? `1px solid ${highlight}` : undefined, ...style }}
        >
            <textarea
                className="ui-input__display ui-textarea__display"
                value={value}
                spellCheck={spellcheck}
                onChange={e => onChange(e.target.value)}
                onFocus={() => setFocus(true)}
                onBlur={() => {
                    setFocus(false);
                    setTouched(true);
                }}
            />
            <div className="ui-input__display ui-textarea__slave">{value}{'\n'}</div>
        </div>
        {error && <p className="ui-input__error-text">{error}</p>}
    </div>;
}