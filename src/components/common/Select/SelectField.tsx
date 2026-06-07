import * as Select from "@radix-ui/react-select";
import styles from "./SelectField.module.scss";
import clsx from "clsx";

interface SelectFieldProps {
  value?: string;
  onSelect: (selectedValue: string) => void;
  portalContainer?: HTMLElement | null;
}

const getBadgeClass = (status: string | undefined) => {
  if (status === "Passed") return styles.selectPassed;
  if (status === "Failed") return styles.selectFailed;
  if (status === "Skipped") return styles.selectSkipped;
  if (status === "Todo") return styles.selectTodo;
  return "";
};

const defaultValue = "Todo";

export default function SelectField({
  value,
  onSelect,
  portalContainer,
}: SelectFieldProps) {
  return (
    <Select.Root
      defaultValue="Todo"
      value={value || ""}
      onValueChange={onSelect}
    >
      <Select.Trigger className={styles.selectTrigger}>
        {value ? (
          <span className={clsx(styles.statusBadge, getBadgeClass(value))}>
            {value === "Todo" ? "To Do" : value.toUpperCase()}
          </span>
        ) : (
          <Select.Value placeholder="Select new status..." />
        )}
      </Select.Trigger>
      <Select.Portal container={portalContainer}>
        <Select.Content
          onKeyDown={(e) => {
            console.log("SELECT", e.key);
          }}
          position="popper"
          sideOffset={4}
          className={styles.selectContent}
        >
          <Select.Viewport className={styles.selectViewport}>
            <Select.Item value="Passed" className={clsx(styles.selectItem)}>
              <span className={clsx(styles.statusBadge, styles.selectPassed)}>
                {" "}
                PASSED
              </span>
            </Select.Item>
            <Select.Item value="Failed" className={styles.selectItem}>
              <span className={clsx(styles.statusBadge, styles.selectFailed)}>
                {" "}
                FAILED
              </span>
            </Select.Item>
            <Select.Item value="Skipped" className={styles.selectItem}>
              <span className={clsx(styles.statusBadge, styles.selectSkipped)}>
                {" "}
                SKIPPED
              </span>
            </Select.Item>
            <Select.Item value="Todo" className={styles.selectItem}>
              <span className={clsx(styles.statusBadge, styles.selectTodo)}>
                {" "}
                TO DO
              </span>
            </Select.Item>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
