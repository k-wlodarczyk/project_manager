import type { ReactNode } from "react";

export type PopupAction =
  | "newModule"
  | "editModule"
  | "deleteModule"
  | "deleteTestCases"
  | "changeTestCaseStatus";

export type PopupField = {
  name: string;
  label: string;
  id?: string;
  type: "input" | "select";
  placeholder?: string;
  options?: any[];
  badge?: boolean;
  styleTarget?: "container" | "text";
};

export interface PopupSetting {
  title: string;
  subtitle: string | ((param: string | number) => ReactNode);
  confirmLabel: string;
  cancelLabel: string;
  type: "edit" | "confirmDelete";
  fields?: PopupField[];
}

export const POPUP_CONFIG: Record<PopupAction, PopupSetting> = {
  newModule: {
    title: "New Module",
    subtitle: "",
    confirmLabel: "Create",
    cancelLabel: "Cancel",
    type: "edit",
    fields: [
      {
        label: "Module Name",
        type: "input",
        name: "moduleName",
        id: "moduleName",
        placeholder: "Insert new module name...",
      },
    ],
  },

  editModule: {
    title: "Edit Module",
    subtitle: "",
    confirmLabel: "Save",
    cancelLabel: "Cancel",
    type: "edit",
    fields: [
      {
        label: "Module Name",
        type: "input",
        name: "moduleName",
        id: "moduleName",
        placeholder: "Insert new module name...",
      },
    ],
  },
  deleteModule: {
    title: "Delete module",
    subtitle: (moduleName: string | number) => (
      <>
        Are you sure you want to delete module <strong>{moduleName}</strong>?
        This action cannot be undone.
      </>
    ),
    confirmLabel: "Yes, delete",
    cancelLabel: "Cancel",
    type: "confirmDelete",
  },
  deleteTestCases: {
    title: "Delete test cases",
    subtitle: (checkedTestCasesCounter: string | number) => (
      <>
        Are you sure you want to delete{" "}
        <strong>{checkedTestCasesCounter}</strong> test cases? This action
        cannot be undone.
      </>
    ),
    confirmLabel: "Yes, delete",
    cancelLabel: "Cancel",
    type: "confirmDelete",
  },
  changeTestCaseStatus: {
    title: "Edit Test cases status",
    subtitle: "",
    confirmLabel: "Save",
    cancelLabel: "Cancel",
    type: "edit",
    fields: [
      {
        label: "Status",
        type: "select",
        name: "status",
        id: "status",
        options: [
          { label: "To Do", value: "Todo" },
          { label: "Passed", value: "Passed" },
          { label: "Failed", value: "Failed" },
          { label: "Skipped", value: "Skipped" },
        ],
        badge: true,
        placeholder: "Select new status...",
        styleTarget: "container",
      },
    ],
  },
};
