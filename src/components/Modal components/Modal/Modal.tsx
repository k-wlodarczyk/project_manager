import { createPortal } from "react-dom";
import styles from "./Modal.module.css";
import { useHotkeys } from "react-hotkeys-hook";
import ModalField from "../ModalField/ModalField";
import ModalBtn from "../ModalBtn/ModalBtn";
import { useState } from "react";
import type { FieldConfig } from "../../../types/modal";
import ModalTestCaseSteps from "../ModalTestCaseSteps/ModalTestCaseSteps";
import { useModalSubmit } from "../../../hooks/useModalSubmit";
import { useTestCaseSteps } from "../../../hooks/useTestCaseSteps";

interface ModalProps {
  type: "projects" | "modules" | "testCases";
  onCancel: () => void;
  onSuccess: (newItem: any) => void;
  fields: FieldConfig[];
  title: string;
  subtitle?: string;
}

export default function Modal({
  type,
  onCancel,
  onSuccess,
  fields,
  title,
  subtitle,
}: ModalProps) {
  useHotkeys("esc", onCancel, { enableOnFormTags: true });

  const { testCaseSteps, newStep, updateSteps } = useTestCaseSteps();
  const { submitProject, submitModules, submitTestCases } = useModalSubmit({
    onSuccess,
    onCancel,
  });

  const [formData, setFormData] = useState<Record<string, string>>(() => {
    return fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {});
  });

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  function handleSubmit() {
    if (type === "projects") return submitProject(formData);
    if (type === "modules") return submitModules(formData);
    if (type === "testCases") return submitTestCases(formData, testCaseSteps);
  }

  return createPortal(
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onCancel}>
          &times;
        </button>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
        <div className={styles.modalFields}>
          {fields.map((field) => {
            return (
              <ModalField
                key={field.name}
                name={field.name}
                label={field.label}
                disabled={field.disabled || false}
                placeholder={field.placeholder}
                type={field.type || "text"}
                value={formData[field.name]}
                defaultValue={field.defaultValue || ""}
                options={field.options}
                onChange={(e: any) => handleChange(field.name, e.target.value)}
              />
            );
          })}

          {type === "testCases" && (
            <ModalTestCaseSteps
              testCaseSteps={testCaseSteps}
              handleNewTestCaseStep={newStep}
              handleUpdateTestCaseSteps={updateSteps}
            />
          )}
        </div>
        <div className={styles.modalBtns}>
          <ModalBtn type="secondary" onClick={onCancel}>
            Cancel
          </ModalBtn>
          <ModalBtn type="cta" onClick={handleSubmit}>
            Submit
          </ModalBtn>
        </div>
      </div>
    </div>,
    document.body,
  );
}
