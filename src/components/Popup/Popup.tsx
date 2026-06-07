import { createPortal } from "react-dom";
import styles from "./Popup.module.css";
import { useEffect, useState } from "react";
import clsx from "clsx";
import FormFieldWithLabel from "../common/FormFieldWithLabel/FormFieldWithLabel";
import * as Dialog from "@radix-ui/react-dialog";

interface PopupProps {
  action:
    | "newProject"
    | "newModule"
    | "editModule"
    | "deleteModule"
    | "deleteTestCases"
    | "changeTestCaseStatus";
  moduleName?: string;
  config: any;
  onCancel: () => void;
  onSubmit: (selectedValue: string, formData?: any) => void;
  type: "edit" | "create" | "confirmDelete" | "option" | undefined;
  checkedItemsCounter?: number;
}

export default function Popup({
  action,
  moduleName,
  config,
  onCancel,
  onSubmit,
  checkedItemsCounter,
}: PopupProps) {
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [formData, setFormData] = useState<Record<string, string>>({});

  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(
    null,
  );

  useEffect(() => {
    if (config.fields && config.fields.length > 0) {
      const initialFormData = config.fields.reduce(
        (acc: Record<string, string>, field: any) => {
          acc[field.name] = field.name === "moduleName" ? moduleName || "" : "";
          return acc;
        },
        {},
      );

      setFormData(initialFormData);
    }
  }, [config.fields, moduleName]);

  function handleSelectChange(fieldName: string, selectedValue: string) {
    setSelectedValue(selectedValue);
    setFormData((prev) => ({
      ...prev,
      [fieldName]: selectedValue,
    }));
  }

  function renderSubtitle() {
    if (typeof config.subtitle === "function" && action === "deleteModule") {
      return config.subtitle(moduleName);
    } else if (
      typeof config.subtitle === "function" &&
      action === "deleteTestCases"
    ) {
      return config.subtitle(checkedItemsCounter || "undefined");
    }
  }

  function handleInputChange(fieldName: string, newValue: string) {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: newValue,
    }));
  }

  return createPortal(
    <Dialog.Root
      open={true}
      onOpenChange={(open) => {
        !open && onCancel();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className={styles.popupOverlay}>
          <Dialog.Content
            ref={(node) => {
              if (node && !portalContainer) {
                setPortalContainer(node);
              }
            }}
            className={styles.popupContent}
            onPointerDownOutside={(event) => {
              const target = event.target as HTMLElement;
              const isSelectPortal =
                target.closest("[data-radix-select-viewport]") ||
                target.closest("[data-radix-popper-content-wrapper]") ||
                target.closest(".selectContent");
              if (isSelectPortal) {
                event.preventDefault();
              }
            }}
            onFocusOutside={(event) => {
              const target = event.target as HTMLElement;
              const isSelectPortal =
                target.closest("[data-radix-select-viewport]") ||
                target.closest("[data-radix-popper-content-wrapper]") ||
                target.closest(".selectContent");
              if (isSelectPortal) {
                event.preventDefault();
              }
            }}
          >
            <Dialog.Title className={styles.title}>{config.title}</Dialog.Title>

            <Dialog.Description
              aria-hidden="true"
              style={{ display: "none" }}
            />

            <div className={styles.popupFields}>
              {(action === "editModule" ||
                action === "newModule" ||
                action === "changeTestCaseStatus" ||
                action === "newProject") &&
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
                      onSelectChange={(value) =>
                        handleSelectChange(field.name, value)
                      }
                      placeholder={field.placeholder}
                      portalContainer={portalContainer}
                    />
                  );
                })}
            </div>

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
                  config.type === "create" && styles.ctaBtnEdit,
                  config.type === "confirmDelete" && styles.ctaBtnConfirmDelete,
                )}
              >
                {config.confirmLabel}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>,
    document.body,
  );
}
