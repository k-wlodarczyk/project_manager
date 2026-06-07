import styles from "./FormFieldWithLabel.module.css";

import SelectField from "../Select/SelectField";

interface FormFieldWithLabelProps {
  type: "input" | "select";
  label: string;
  id: string;
  name: string;
  value?: string;
  portalContainer?: HTMLElement | null;
  onValueChange: (newValue: string) => void;
  onSelectChange: (selectedValue: string) => void;

  placeholder?: string;
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
              onValueChange((e.target as HTMLInputElement).value)
            }
            {...props}
          />
        )}
        {type === "select" && (
          <SelectField
            value={value}
            onSelect={onSelectChange}
            {...props}
            portalContainer={portalContainer}
          />
        )}
      </div>
    </>
  );
}
