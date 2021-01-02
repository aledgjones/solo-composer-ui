import { Button, Dialog } from "../../../ui";

interface Props {
  onCancel: () => void;
}

export const Library = Dialog<Props>(({ onCancel }) => {
  return (
    <div className="library generic-settings">
      <div className="generic-settings__content"></div>
      <div className="instrument-picker__buttons">
        <div className="instrument-picker__spacer" />
        <Button compact outline style={{ marginRight: 8 }} onClick={onCancel}>
          Cancel
        </Button>
        <Button compact>Open</Button>
      </div>
    </div>
  );
});
