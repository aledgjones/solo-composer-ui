import { CSSProperties } from "react";
import { Error } from "../../utils/error";

interface InputBaseProps {
    id?: string;
    className?: string;
    style?: CSSProperties;
    type: string;
    color: string;
    margin?: boolean;
    label: string;
    required?: boolean;
    disabled?: boolean;
    onChange: (value: any) => void;
    onBlur?: () => void;
    onFocus?: () => void;
}

export interface InternalInputBaseProps extends InputBaseProps {
    display: string;
    spellcheck: boolean;
    validate: (value: string) => Error | null;
}

export interface TextInputProps extends InputBaseProps {
    type: "text";
    value: string;
}

export interface PasswordInputProps extends InputBaseProps {
    type: "password";
    value: string;
}

export interface EmailInputProps extends InputBaseProps {
    type: "email";
    value: string;
}

export interface NumberInputProps extends InputBaseProps {
    type: "number";
    value?: number;
    precision: number;
    step: number;
    units?: string;
}

export interface SearchInputProps extends InputBaseProps {
    type: "search";
    value: string;
}

export type InputProps = TextInputProps | PasswordInputProps | EmailInputProps | SearchInputProps | NumberInputProps;
