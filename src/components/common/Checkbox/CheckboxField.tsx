import styles from "./CheckboxField.module.scss";
import { CheckIcon } from "@radix-ui/react-icons";
import { Checkbox } from "radix-ui";

interface CheckboxFieldProps {
  id: string;
  label: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export default function CheckboxField({
  id,
  label,
  checked,
  onCheckedChange,
}: CheckboxFieldProps) {
  return (
    <div className={styles.checkboxSection}>
      <Checkbox.Root
        id={id}
        className={styles.root}
        checked={checked}
        onCheckedChange={(value) => {
          onCheckedChange?.(value === true);
        }}
      >
        <Checkbox.Indicator className={styles.indicator}>
          <CheckIcon />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <label htmlFor={id}>{label}</label>
    </div>
  );
}
