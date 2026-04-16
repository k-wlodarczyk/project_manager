import styles from "./ModalField.module.css";
import type { FieldConfig, Option } from "../../../types/modal";
import clsx from "clsx";

interface ModalFieldProps extends FieldConfig {
  value?: string;
  disabled?: boolean;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  options?: Option[];
  wholeLine?: boolean;
}

export default function ModalField({
  label,
  name,
  type,
  placeholder,
  value,
  disabled,
  options,
  onChange,
  wholeLine,
}: ModalFieldProps) {
  const isSelect = type === "select" && !disabled;

  return (
    <div
      className={clsx(
        styles.modalField,
        wholeLine && styles.modalFieldWholeLine,
      )}
    >
      <label htmlFor="">{label}</label>

      {isSelect ? (
        <select
          name={name}
          onChange={onChange}
          disabled={disabled}
          value={value}
        >
          <option value="" disabled>
            Select an option
          </option>
          {options &&
            options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
        </select>
      ) : (
        <input
          name={name}
          type={type === "select" ? "text" : type}
          value={value ?? ""}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={disabled ? styles.disabledInput : ""}
        />
      )}
    </div>
  );
}
