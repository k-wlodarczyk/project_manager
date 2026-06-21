import * as Select from "@radix-ui/react-select";
import styles from "./SelectField.module.scss";
import clsx from "clsx";

interface SelectFieldProps {
  value?: string;
  onSelect?: (selectedValue: string) => void;
  placeholder?: string;
  options?: any[];
  portalContainer?: HTMLElement | null;
  badge?: boolean;
  disabled?: boolean;
}

const getBadgeClass = (status: string | undefined) => {
  return styles[`select${status}`];
};

export default function SelectField({
  value,
  onSelect,
  placeholder,
  options,
  portalContainer,
  badge,
  disabled,
}: SelectFieldProps) {
  return (
    <Select.Root
      defaultValue="Todo"
      value={value || ""}
      onValueChange={onSelect}
    >
      <Select.Trigger className={styles.selectTrigger} disabled={disabled}>
        {value ? (
          <span
            className={clsx(
              badge && styles.badge,
              badge && getBadgeClass(value),
            )}
          >
            {value === "Todo"
              ? "To Do"
              : typeof value === "string"
                ? value.toUpperCase()
                : value}
          </span>
        ) : (
          <Select.Value placeholder={placeholder} />
        )}
      </Select.Trigger>
      <Select.Portal container={portalContainer || document.body}>
        <Select.Content
          position="popper"
          sideOffset={4}
          className={styles.selectContent}
        >
          <Select.Viewport className={styles.selectViewport}>
            {options?.map((option) => (
              <Select.Item
                key={option.value}
                value={option.value}
                className={clsx(styles.selectItem)}
              >
                <Select.ItemText>
                  {badge ? (
                    <span
                      className={clsx(
                        styles.badge,
                        getBadgeClass(option.value),
                      )}
                    >
                      {option.label.toUpperCase()}
                    </span>
                  ) : (
                    option.label
                  )}
                </Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
