import React, { FC, useState } from "react";
import { PanelHeader } from "../../../components/panel-header";
import { Text } from "../../../components/text";

import "./styles.css";

const TIME_SIGNATURES = [
    { symbols: ["${time-2}", "${time-4}"] },
    { symbols: ["${time-2}", "${time-2}"] },
    { symbols: ["${time-cutc}"] },
    { symbols: ["${time-3}", "${time-2}"] },
    { symbols: ["${time-3}", "${time-4}"] },
    { symbols: ["${time-3}", "${time-8}"] },
    { symbols: ["${time-4}", "${time-4}"] },
    { symbols: ["${time-c}"] },
    { symbols: ["${time-5}", "${time-4}"] },
    { symbols: ["${time-5}", "${time-8}"] },
    { symbols: ["${time-6}", "${time-4}"] },
    { symbols: ["${time-2}", "${time-8}"] },
    { symbols: ["${time-7}", "${time-8}"] },
    { symbols: ["${time-9}", "${time-8}"] },
    { symbols: ["${time-1}${time-2}", "${time-8}"] },
];

export const TimeSignaturePanel: FC = () => {
    return (
        <div className="panel--time-signature">
            <PanelHeader>
                <span>Common</span>
            </PanelHeader>
            <div className="panel--time-signature__grid">
                {TIME_SIGNATURES.map((time) => {
                    return (
                        <div className="panel--time-signature__cell">
                            {time.symbols.map((sym) => (
                                <div className="panel--time-signature__group">
                                    <Text content={sym} />
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
            <PanelHeader>
                <span>Create Time Signature</span>
            </PanelHeader>
        </div>
    );
};
