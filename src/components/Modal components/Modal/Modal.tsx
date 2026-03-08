import { createPortal } from "react-dom";
import styles from "./Modal.module.css";
import { useHotkeys } from "react-hotkeys-hook";
import ModalField from "./ModalField/ModalField";
import ModalBtn from "./ModalBtn/ModalBtn";

interface ModalProps {
  onCancel: () => void;
}

export default function Modal({ onCancel }: ModalProps) {
  useHotkeys("esc", onCancel, { enableOnFormTags: true });

  return createPortal(
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onCancel}>
          &times;
        </button>
        <h2 className={styles.title}>Modal title</h2>
        <p className={styles.subtitle}>Modal subtitle</p>
        <div className={styles.modalFields}>
          <ModalField
            label="Project name"
            type="text"
            placeholder="Enter project name"
          />
          <ModalField
            label="Project description"
            type="text"
            placeholder="Enter project description (optional)"
          />
          <ModalField
            label="Project link"
            type="text"
            placeholder="https://example.com (optional)"
          />
        </div>
        <div className={styles.modalBtns}>
          <ModalBtn type="secondary" onClick={onCancel}>
            Cancel
          </ModalBtn>
          <ModalBtn type="cta" onClick={onCancel}>
            Submit
          </ModalBtn>
        </div>
      </div>
    </div>,
    document.body,
  );
}
