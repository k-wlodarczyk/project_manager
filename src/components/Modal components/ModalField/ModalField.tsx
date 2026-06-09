import styles from "./ModalField.module.css";
import type { FieldConfig, Option } from "../../../types/modal";
import clsx from "clsx";
import FormFieldWithLabel from "../../common/FormFieldWithLabel/FormFieldWithLabel";

interface ModalFieldProps extends FieldConfig {
  value?: string;
  disabled?: boolean;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onSelectChange: (newValue: string) => void;
  options?: Option[];
  wholeLine?: boolean;
  badge?: boolean;
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
  onSelectChange,
  wholeLine,
  badge,
}: ModalFieldProps) {
  const isSelect = type === "select";

  return (
    <div
      className={clsx(
        styles.modalField,
        wholeLine && styles.modalFieldWholeLine,
      )}
    >
      {isSelect ? (
        <FormFieldWithLabel
          type="select"
          id={name}
          name={name}
          label={label}
          onSelectChange={onSelectChange}
          options={options}
          value={value}
          badge={badge}
          disabled={disabled}
        />
      ) : (
        <>
          <label htmlFor="">{label}</label>
          <input
            name={name}
            type={type === "select" ? "text" : type}
            value={value ?? ""}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className={disabled ? styles.disabledInput : ""}
          />
        </>
      )}
    </div>
  );
}
