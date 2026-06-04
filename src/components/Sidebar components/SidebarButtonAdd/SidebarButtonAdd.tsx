import clsx from "clsx";
import styles from "./SidebarButtonAdd.module.css";
import { DropdownMenu } from "radix-ui";

interface SidebarButtonAddProps {
  onClick: (itemType: "testCases" | "modules") => void;
  type: "projects" | "modules" | "testCases";
}

export default function SidebarButtonAdd({
  onClick,
  type,
}: SidebarButtonAddProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={clsx(
            styles.btnAdd,
            type === "testCases" && styles.btnAddTestCase,
          )}
        >
          {type === "testCases" ? (
            <>
              New{" "}
              <span>
                <ion-icon name="chevron-down-outline"></ion-icon>
              </span>
            </>
          ) : (
            "+"
          )}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className={styles.Content} sideOffset={5}>
          <DropdownMenu.Item
            className={styles.Item}
            onSelect={() => onClick("testCases")}
          >
            Test case
          </DropdownMenu.Item>
          <DropdownMenu.Separator className={styles.Separator} />
          <DropdownMenu.Item
            className={styles.Item}
            onSelect={() => onClick("modules")}
          >
            Module
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
