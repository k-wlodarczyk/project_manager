import { createPortal } from "react-dom";
import styles from "./Popup.module.css";
import { useState, type ChangeEvent } from "react";

interface PopupProps {
  onCancel: () => void;
  onSubmit: (selectedValue: string) => void;
  type: "option" | "confirmation" | undefined;
  options?: string[];
}

export default function Popup({
  onCancel,
  onSubmit,
  type,
  options,
}: PopupProps) {
  const [selectedValue, setSelectedValue] = useState<string>("");

  function handleSelectChange(e: ChangeEvent<HTMLSelectElement>) {
    setSelectedValue(e.target.value);
  }

  return createPortal(
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        {type === "option" && (
          <select value={selectedValue} onChange={handleSelectChange}>
            <option value="" disabled>
              Choose new status
            </option>
            {options?.map((option) => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
          </select>
        )}
        <button onClick={onCancel}>No</button>
        <button onClick={() => onSubmit(selectedValue)}>Yes</button>
      </div>
    </div>,
    document.body,
  );
}
