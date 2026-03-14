import styles from "./ModalField.module.css";

interface ModalFieldProps {
  label: string;
  type: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ModalField({
  label,
  type,
  placeholder,
  value,
  onChange,
}: ModalFieldProps) {
  return (
    <div className={styles.modalField}>
      <label htmlFor="">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
