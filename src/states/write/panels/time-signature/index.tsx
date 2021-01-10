import { FC } from "react";
import { PanelHeader } from "../../../../components/panel-header";
import { Text } from "../../../../components/text";

import "./styles.css";

const TIME_SIGNATURES = [
  { id: "2/4", symbols: ["${time-2}", "${time-4}"] },
  { id: "2/2", symbols: ["${time-2}", "${time-2}"] },
  { id: "cutc", symbols: ["${time-cutc}"] },
  { id: "3/2", symbols: ["${time-3}", "${time-2}"] },
  { id: "3/4", symbols: ["${time-3}", "${time-4}"] },
  { id: "3/8", symbols: ["${time-3}", "${time-8}"] },
  { id: "4/4", symbols: ["${time-4}", "${time-4}"] },
  { id: "c", symbols: ["${time-c}"] },
  { id: "5/4", symbols: ["${time-5}", "${time-4}"] },
  { id: "5/8", symbols: ["${time-5}", "${time-8}"] },
  { id: "6/4", symbols: ["${time-6}", "${time-4}"] },
  { id: "2/8", symbols: ["${time-2}", "${time-8}"] },
  { id: "7/8", symbols: ["${time-7}", "${time-8}"] },
  { id: "9/8", symbols: ["${time-9}", "${time-8}"] },
  { id: "12/8", symbols: ["${time-1}${time-2}", "${time-8}"] },
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
            <div key={time.id} className="panel--time-signature__cell">
              {time.symbols.map((sym, i) => (
                <div key={`${time.id}:${i}`} className="panel--time-signature__group">
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
