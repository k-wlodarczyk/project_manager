import { createPortal } from "react-dom";
import styles from "./Popup.module.css";
import { useEffect, useState } from "react";
import clsx from "clsx";
import FormFieldWithLabel from "../common/FormFieldWithLabel/FormFieldWithLabel";
import * as Dialog from "@radix-ui/react-dialog";
import type { TestCaseStatusSelect } from "../../types/testCase";

interface PopupProps {
  action:
    | "newProject"
    | "newModule"
    | "editModule"
    | "deleteModule"
    | "deleteTestCases"
    | "changeTestCaseStatus"
    | "resetExecutionDate";
  moduleName?: string;
  config: any;
  onCancel: () => void;
  onSubmit: (
    selectedValue: TestCaseStatusSelect,
    formData?: Record<string, string | boolean>,
  ) => void;
  type: "edit" | "create" | "confirm" | "confirmDelete" | "option" | undefined;
  checkedItemsCounter?: number;
  dataTestId?: string;
}

export default function Popup({
  action,
  moduleName,
  config,
  onCancel,
  onSubmit,
  checkedItemsCounter,
  dataTestId,
}: PopupProps) {
  const [selectedValue, setSelectedValue] = useState<
    "Todo" | "Passed" | "Failed" | "Skipped"
  >("Todo");
  const [formData, setFormData] = useState<Record<string, string | boolean>>(
    {},
  );

  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(
    null,
  );

  useEffect(() => {
    if (config.fields && config.fields.length > 0) {
      const initialFormData = config.fields.reduce(
        (acc: Record<string, string | boolean>, field: any) => {
          if (field.type === "checkbox") {
            acc[field.name] = false;
          } else {
            acc[field.name] =
              field.name === "moduleName" ? moduleName || "" : "";
          }
          return acc;
        },
        {},
      );

      setFormData(initialFormData);
    }
  }, [config.fields, moduleName]);

  function renderSubtitle() {
    if (typeof config.subtitle !== "function") return;
    if (action === "deleteModule") {
      return config.subtitle(moduleName);
    } else {
      return config.subtitle(checkedItemsCounter || "undefined");
    }
  }

  function handleSelectChange(
    fieldName: string,
    selectedValue: TestCaseStatusSelect,
  ) {
    setSelectedValue(selectedValue);
    setFormData((prev) => ({
      ...prev,
      [fieldName]: selectedValue,
    }));
  }

  function handleInputChange(fieldName: string, newValue: string) {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: newValue,
    }));
  }

  function handleCheckboxChange(fieldName: string, newValue: boolean) {
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
            data-testid={dataTestId}
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
              {config.fields?.map((field: any) => {
                const rawValue = formData[field.name as string];

                return (
                  <FormFieldWithLabel
                    key={field.id}
                    type={field.type}
                    label={field.label}
                    id={field.id}
                    name={field.name}
                    value={typeof rawValue === "string" ? rawValue : ""}
                    checked={typeof rawValue === "boolean" ? rawValue : false}
                    options={field.options}
                    badge={field.badge}
                    onValueChange={(value) =>
                      handleInputChange(field.name, value)
                    }
                    onSelectChange={(value) =>
                      handleSelectChange(field.name, value)
                    }
                    onCheckboxChange={(checked) =>
                      handleCheckboxChange(field.name, checked)
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
                  config.type !== "confirmDelete" && styles.ctaBtnConfirm,
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
