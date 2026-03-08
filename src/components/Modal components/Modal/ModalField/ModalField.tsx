import styles from "./ModalField.module.css";

interface ModalFieldProps {
  label: string;
  type: "text";
  placeholder?: string;
}

export default function ModalField({
  label,
  type,
  placeholder,
}: ModalFieldProps) {
  return (
    <div className={styles.modalField}>
      <label htmlFor="">{label}</label>
      <input type={type} placeholder={placeholder} />
    </div>
  );
}
