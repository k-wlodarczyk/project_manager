import styles from "./FormFieldWithLabel.module.css";

import SelectField from "../Select/SelectField";
import type { TestCaseStatusSelect } from "../../../types/testCase";
import CheckboxField from "../Checkbox/CheckboxField";

interface FormFieldWithLabelProps {
  type: "input" | "select" | "checkbox";
  label: string;
  id: string;
  name: string;
  value?: string;
  checked?: boolean;
  portalContainer?: HTMLElement | null;
  options?: any[];
  onValueChange?: (newValue: string) => void;
  onSelectChange?: (selectedValue: TestCaseStatusSelect) => void;
  onCheckboxChange?: (checked: boolean) => void;
  badge?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export default function FormFieldWithLabel({
  type,
  label,
  id,
  name,
  placeholder,
  value,
  checked,
  onSelectChange,
  onValueChange,
  onCheckboxChange,
  portalContainer,
  options,
  badge,
  disabled,
  ...props
}: FormFieldWithLabelProps) {
  return (
    <>
      <div className={styles.fieldWithLabel}>
        {type !== "checkbox" && <label htmlFor={id}>{label}</label>}

        {type === "input" && (
          <input
            type="text"
            id={id}
            name={name}
            placeholder={placeholder}
            className={styles.input}
            value={value}
            onChange={(e) =>
              onValueChange?.((e.target as HTMLInputElement).value)
            }
            {...props}
          />
        )}
        {type === "select" && (
          <SelectField
            value={value}
            onSelect={onSelectChange}
            portalContainer={portalContainer}
            placeholder={placeholder}
            options={options}
            badge={badge}
            disabled={disabled}
            {...props}
          />
        )}
        {type === "checkbox" && <CheckboxField id={id} label={label} checked={checked} onCheckedChange={onCheckboxChange} />}
      </div>
    </>
  );
}
