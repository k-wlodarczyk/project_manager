import ModalBtn from "../ModalBtn/ModalBtn";

interface ModalActionBtnsProps {
  viewMode: "view" | "create" | "edit" | "copy";
  disabled: boolean;
  onCancel: () => void;
  onSubmitNew: () => void;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSubmitEdit: () => void;
  onCopy: () => void;
  onSubmitCopy: () => void;
}

export default function ModalActionBtns({
  viewMode,
  onCancel,
  onSubmitNew,
  onEdit,
  onCancelEdit,
  onSubmitEdit,
  onCopy,
  onSubmitCopy,
}: ModalActionBtnsProps) {
  return (
    <>
      {viewMode === "create" && (
        <>
          <ModalBtn type="secondary" onClick={onCancel}>
            Cancel
          </ModalBtn>
          <ModalBtn type="cta" onClick={onSubmitNew}>
            Submit
          </ModalBtn>
        </>
      )}
      {viewMode === "view" && (
        <>
          <button onClick={onCopy}>Copy</button>
          <ModalBtn type="secondary" onClick={onCancel}>
            Close
          </ModalBtn>
          <ModalBtn type="cta" onClick={onEdit}>
            Edit
          </ModalBtn>
        </>
      )}
      {viewMode === "edit" && (
        <>
          <ModalBtn type="secondary" onClick={onCancelEdit}>
            Discard changes
          </ModalBtn>
          <ModalBtn type="cta" onClick={onSubmitEdit}>
            Save
          </ModalBtn>
        </>
      )}
      {viewMode === "copy" && (
        <>
          <ModalBtn type="secondary" onClick={onCancelEdit}>
            Discard changes
          </ModalBtn>
          <ModalBtn type="cta" onClick={onSubmitCopy}>
            Save
          </ModalBtn>
        </>
      )}
    </>
  );
}
