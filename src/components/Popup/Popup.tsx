import { createPortal } from "react-dom";
import styles from "./Popup.module.css";
import { useEffect, useState, type ChangeEvent } from "react";
import clsx from "clsx";
import FormFieldWithLabel from "../common/FormFieldWithLabel/FormFieldWithLabel";

interface PopupProps {
  action: "editModule" | "deleteModule" | "changeTestCaseStatus";
  moduleName?: string;
  config: any;
  onCancel: () => void;
  onSubmit: (selectedValue: string, formData?: any) => void;
  type: "edit" | "confirmDelete" | "option" | undefined;
}

export default function Popup({
  action,
  moduleName,
  config,
  onCancel,
  onSubmit,
  type,
}: PopupProps) {
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (config.fields && config.fields.length > 0) {
      const initialFormData = config.fields.reduce(
        (acc: Record<string, string>, field: any) => {
          field.name === "moduleName";
          acc[field.name] = field.name === "moduleName" ? moduleName || "" : "";
          return acc;
        },
        {},
      );

      setFormData(initialFormData);
    }
  }, [config.fields]);

  function handleSelectChange(e: ChangeEvent<HTMLSelectElement>) {
    setSelectedValue(e.target.value);
  }

  function renderSubtitle() {
    if (typeof config.subtitle === "function") {
      return config.subtitle(moduleName);
    }

    return config.subtitle;
  }

  function handleInputChange(fieldName: string, newValue: string) {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: newValue,
    }));
  }

  return createPortal(
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <div className={styles.title}>{config.title}</div>

        <div className={styles.popupFields}>
          {action === "editModule" &&
            config.fields?.map((field: any) => {
              return (
                <FormFieldWithLabel
                  key={field.id}
                  type={field.type}
                  label={field.label}
                  id={field.id}
                  name={field.name}
                  value={formData[field.name as string] || ""}
                  onValueChange={(value) =>
                    handleInputChange(field.name, value)
                  }
                  placeholder={field.placeholder}
                />
              );
            })}
        </div>

        {type === "select" && (
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
        <div className={styles.subtitle}>{renderSubtitle()}</div>
        <div className={styles.btnsSection}>
          <button
            onClick={onCancel}
            className={clsx(styles.button, styles.secondaryBtn)}
          >
            {config.cancelLabel}
          </button>
          <button
            onClick={() => onSubmit(selectedValue, formData)}
            className={clsx(
              config.type === "edit" && styles.ctaBtnEdit,
              config.type === "confirmDelete" && styles.ctaBtnConfirmDelete,
            )}
          >
            {config.confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
