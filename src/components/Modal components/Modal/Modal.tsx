import { createPortal } from "react-dom";
import styles from "./Modal.module.css";
import { useHotkeys } from "react-hotkeys-hook";
import ModalField from "../ModalField/ModalField";
import { useEffect, useState } from "react";
import type { FieldConfig } from "../../../types/modal";
import ModalTestCaseSteps from "../ModalTestCaseSteps/ModalTestCaseSteps";
import { useModalSubmit } from "../../../hooks/useModalSubmit";
import { useTestCaseSteps } from "../../../hooks/useTestCaseSteps";
import { useFetchItems } from "../../../hooks/useFetchItems";
import ModalActionBtns from "../ModalActionBtns/ModalActionBtns";
import { useTestCases } from "../../../hooks/useTestCases";

interface ModalProps {
  type: "projects" | "modules" | "testCases";
  viewMode: "view" | "create" | "edit" | "copy";
  onCancel: () => void;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSuccess: (newItem: any) => void;
  fields: FieldConfig[];
  title: string;
  subtitle?: string;
  objectId?: number;
  onCopy: () => void;
  navigationEnabled?: { previousEnabled: boolean; nextEnabled: boolean };
  onNextTestCase?: () => void;
  onPreviousTestCase?: () => void;
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
  onCopy,
  navigationEnabled,
  onNextTestCase,
  onPreviousTestCase,
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

  const { updateTestCasesStatus } = useTestCases(objectId);

  const { testCaseSteps, newStep, newStepAfterIndex, updateSteps, deleteStep } =
    useTestCaseSteps(fetchedSteps);
  const {
    submitProject,
    updateProject,
    submitModules,
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

  const handleChange = async (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (
      name === "status" &&
      viewMode === "view" &&
      objectId &&
      ["To Do", "Passed", "Failed", "Skipped"].includes(value)
    ) {
      await updateTestCasesStatus(
        value as "Passed" | "Failed" | "To Do" | "Skipped",
      );
      onSuccess(null);
    }
  };

  function handleSubmit() {
    const isNewRecord = viewMode === "create" || viewMode === "copy";

    if (type === "projects") {
      return isNewRecord ? submitProject(formData) : alert("ERROR");
    }
    if (type === "modules") {
      return isNewRecord ? submitModules(formData) : alert("ERROR");
      // : updateModule(formData, objectId!);
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
            if (field.hideInFormRows) return;
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
                wholeLine={true}
              />
            );
          })}

          {type === "testCases" && (
            <ModalTestCaseSteps
              testCaseSteps={testCaseSteps}
              handleNewTestCaseStep={newStep}
              handleNewTestCaseStepAfterIndex={newStepAfterIndex}
              handleUpdateTestCaseSteps={updateSteps}
              handleDeleteTestCaseStep={deleteStep}
              disabled={shouldDisableFields}
            />
          )}
        </div>
        <div className={styles.modalFooter}>
          {type === "testCases" && (
            <div className={styles.modalFooterExecution}>
              <ModalField
                name="name"
                type="select"
                label="Execution"
                value={formData.execution}
                disabled={shouldDisableFields}
                options={[
                  { label: "Manual", value: "Manual" },
                  { label: "Automated", value: "Automated" },
                ]}
                onChange={(e: any) => handleChange("execution", e.target.value)}
              />
              <ModalField
                name="name"
                type="select"
                label="Status"
                value={formData.status}
                disabled={false}
                options={[
                  { label: "To Do", value: "To Do" },
                  { label: "Passed", value: "Passed" },
                  { label: "Failed", value: "Failed" },
                  { label: "Skipped", value: "Skipped" },
                ]}
                onChange={(e: any) => handleChange("status", e.target.value)}
              />
            </div>
          )}
          {type === "testCases" && viewMode === "view" && (
            <div className={styles.nextPreviousSection}>
              <button
                disabled={!navigationEnabled?.previousEnabled}
                onClick={onPreviousTestCase}
              >
                &larr; Previous
              </button>
              <button
                disabled={!navigationEnabled?.nextEnabled}
                onClick={onNextTestCase}
              >
                Next &rarr;
              </button>
            </div>
          )}
          <div className={styles.modalBtns}>
            <ModalActionBtns
              viewMode={viewMode}
              disabled={shouldDisableFields}
              onCancel={onCancel}
              onSubmitNew={handleSubmit}
              onEdit={onEdit}
              onCancelEdit={onCancelEdit}
              onSubmitEdit={handleSubmit}
              onCopy={onCopy}
              onSubmitCopy={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
