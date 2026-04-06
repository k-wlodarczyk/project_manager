import { createPortal } from "react-dom";
import styles from "./Modal.module.css";
import { useHotkeys } from "react-hotkeys-hook";
import ModalField from "../ModalField/ModalField";
import ModalBtn from "../ModalBtn/ModalBtn";
import { useEffect, useState } from "react";
import type { FieldConfig } from "../../../types/modal";
import ModalTestCaseSteps from "../ModalTestCaseSteps/ModalTestCaseSteps";
import { useModalSubmit } from "../../../hooks/useModalSubmit";
import { useTestCaseSteps } from "../../../hooks/useTestCaseSteps";
import { useFetchItems } from "../../../hooks/useFetchItems";
import ModalActionBtns from "../ModalActionBtns/ModalActionBtns";

interface ModalProps {
  type: "projects" | "modules" | "testCases";
  viewMode: "view" | "create" | "edit";
  onCancel: () => void;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSuccess: (newItem: any) => void;
  fields: FieldConfig[];
  title: string;
  subtitle?: string;
  objectId?: number;
}

const DB_TYPE = {
  projects: "projects",
  modules: "modules",
  testCases: "test_cases",
};

export default function Modal({
  type,
  viewMode,
  onCancel,
  onEdit,
  onCancelEdit,
  onSuccess,
  fields,
  title,
  subtitle,
  objectId,
}: ModalProps) {
  useHotkeys("esc", onCancel, { enableOnFormTags: true });

  const dbType = DB_TYPE[type];
  const shouldDisableFields = viewMode === "view";

  const { data: fetchedItem } = useFetchItems(
    dbType as "projects" | "modules" | "test_cases",
    viewMode,
    objectId,
  );

  const { data: fetchedSteps } = useFetchItems(
    "test_case_steps",
    viewMode,
    objectId,
  );

  const { testCaseSteps, newStep, updateSteps } =
    useTestCaseSteps(fetchedSteps);
  const {
    submitProject,
    updateProject,
    submitModules,
    updateModule,
    submitTestCases,
    updateTestCase,
  } = useModalSubmit({
    onSuccess,
    onCancel,
    onCancelEdit,
  });

  const [formData, setFormData] = useState<Record<string, string>>(() => {
    return fields.reduce(
      (acc, field) => ({ ...acc, [field.name]: field.defaultValue || "" }),
      {},
    );
  });

  useEffect(() => {
    if (
      viewMode === "view" &&
      objectId &&
      fetchedItem &&
      !Array.isArray(fetchedItem)
    ) {
      setFormData((prev) => {
        const updated = { ...prev };

        fields.forEach((field) => {
          const item = fetchedItem as any;

          if (item[field.name] !== undefined) {
            updated[field.name] = String(item[field.name] || "");
          }
        });

        return updated;
      });
    }
  }, [fetchedItem, viewMode, fields, objectId]);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  function handleSubmit() {
    const isNewRecord = viewMode === "create";

    if (type === "projects") {
      return isNewRecord ? submitProject(formData) : updateProject(formData);
    }
    if (type === "modules") {
      return isNewRecord
        ? submitModules(formData)
        : updateModule(formData, objectId!);
    }
    if (type === "testCases") {
      return isNewRecord
        ? submitTestCases(formData, testCaseSteps)
        : updateTestCase(formData, testCaseSteps, objectId!);
    }
  }

  function handleOverlayClick() {
    if (viewMode === "view") {
      onCancel();
    }
  }

  return createPortal(
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
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
                disabled={shouldDisableFields}
                placeholder={shouldDisableFields ? "" : field.placeholder}
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
              disabled={shouldDisableFields}
            />
          )}
        </div>
        <div className={styles.modalBtns}>
          <ModalActionBtns
            viewMode={viewMode}
            disabled={shouldDisableFields}
            onCancel={onCancel}
            onSubmitNew={handleSubmit}
            onEdit={onEdit}
            onCancelEdit={onCancelEdit}
            onSubmitEdit={handleSubmit}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
