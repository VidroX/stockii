import MaskedInput from "react-text-mask";
import React from "react";

interface TextMaskCustomProps {
    inputRef: (ref: HTMLInputElement | null) => void;
}

export default function PhoneMask(props: TextMaskCustomProps) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={(ref: any) => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={['+', '3', '8', '0', ' ', '(', /[0-9]/, /[0-9]/, ')', ' ', /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/]}
            showMask
        />
    );
}
