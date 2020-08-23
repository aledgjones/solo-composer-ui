import React, { useState, useEffect } from "react";
import { Dialog, Content, Subheader, Progress } from "../../../ui";
import { actions } from "../../store/actions";

import "./styles.css";

interface Props {
    onClose: () => void;
}

export const Importer = Dialog<Props>(({ onClose }) => {
    const [total, setTotal] = useState(1);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const run = async () => {
            await actions.score.import((total, progress) => {
                setTotal(total);
                setProgress(progress);
            });
            onClose();
        };
        run();
    }, []);

    return (
        <div className="importer">
            <Content>
                <Subheader>Importing...</Subheader>
                <Progress color="#cccccc" percent={(progress / total) * 100} />
                <p className="importer__text">
                    {((progress / total) * 100).toFixed(0)}%
                </p>
            </Content>
        </div>
    );
});
