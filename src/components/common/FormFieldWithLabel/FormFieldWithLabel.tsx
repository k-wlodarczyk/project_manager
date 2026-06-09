import styles from "./FormFieldWithLabel.module.css";

import SelectField from "../Select/SelectField";

interface FormFieldWithLabelProps {
  type: "input" | "select";
  label: string;
  id: string;
  name: string;
  value?: string;
  portalContainer?: HTMLElement | null;
  options?: any[];
  onValueChange?: (newValue: string) => void;
  onSelectChange?: (selectedValue: string) => void;
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
  onSelectChange,
  onValueChange,
  portalContainer,
  options,
  badge,
  disabled,
  ...props
}: FormFieldWithLabelProps) {
  return (
    <>
      <div className={styles.fieldWithLabel}>
        <label htmlFor={id}>{label}</label>
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
      </div>
    </>
  );
}
