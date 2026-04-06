import ModalBtn from "../ModalBtn/ModalBtn";
import styles from "./ModalActionBtns.module.css";

interface ModalActionBtnsProps {
  viewMode: "view" | "create" | "edit";
  disabled: boolean;
  onCancel: () => void;
  onSubmitNew: () => void;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSubmitEdit: () => void;
}

export default function ModalActionBtns({
  viewMode,
  disabled,
  onCancel,
  onSubmitNew,
  onEdit,
  onCancelEdit,
  onSubmitEdit,
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
          <ModalBtn type="secondary" onClick={onCancel}>
            Cancel
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
    </>
  );
}
