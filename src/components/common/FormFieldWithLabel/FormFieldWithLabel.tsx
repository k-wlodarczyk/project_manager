import styles from "./FormFieldWithLabel.module.css";

interface FormFieldWithLabelProps {
  type: "input";
  label: string;
  id: string;
  name: string;
  value?: string;
  onValueChange: (newValue: string) => void;
  placeholder?: string;
}

export default function FormFieldWithLabel({
  type,
  label,
  id,
  name,
  placeholder,
  value,
  onValueChange,
  ...props
}: FormFieldWithLabelProps) {
  return (
    <>
      {type === "input" && (
        <div className={styles.fieldWithLabel}>
          <label htmlFor={id}>{label}</label>
          <input
            type="text"
            id={id}
            name={name}
            placeholder={placeholder}
            className={styles.input}
            value={value}
            onChange={(e) => onValueChange((e.target as HTMLInputElement).value)}
          />
        </div>
      )}
    </>
  );
}
