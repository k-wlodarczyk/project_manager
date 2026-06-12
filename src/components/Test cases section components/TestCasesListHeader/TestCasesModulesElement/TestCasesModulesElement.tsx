import clsx from "clsx";
import styles from "./TestCasesModulesElement.module.css";
import { DropdownMenu } from "radix-ui";

interface TestCasesModulesElementProps {
  onClick: (id: number | undefined) => void;
  statusCounter: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    toDo: number;
  };
  selectedModuleId?: number;
  moduleName?: string;
  moduleId?: number;
  onModuleActionSelect: (
    moduleName: string,
    moduleId: number,
    popupAction: "editModule" | "deleteModule",
  ) => void;
}

export default function TestCasesModulesElement({
  selectedModuleId,
  moduleName,
  moduleId,
  statusCounter,
  onClick,
  onModuleActionSelect,
}: TestCasesModulesElementProps) {
  function handleOptionSelect(
    moduleName: string,
    moduleId: number,
    popupAction: "editModule" | "deleteModule",
  ) {
    onModuleActionSelect(moduleName, moduleId, popupAction);
  }

  return (
    <div
      className={clsx(
        !moduleId && styles.projectContainer,
        moduleId && styles.moduleContainer,
        !moduleId && selectedModuleId === undefined && styles.activeModule,
        moduleId && selectedModuleId === moduleId && styles.activeModule,
      )}
      onClick={() => onClick(moduleId)}
    >
      <div className={styles.mainContent}>
        <p className={styles.moduleName}>{moduleName || "All test cases"}</p>
        <p className={styles.testCasesCounter}>
          <strong>{statusCounter.total}</strong>
        </p>
      </div>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <div>
            <button
              className={styles.kebabMenu}
              onClick={(e) => e.stopPropagation()}
            >
              <span>
                <ion-icon name="ellipsis-vertical-outline"></ion-icon>
              </span>
            </button>
          </div>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content className={styles.Content}>
            <DropdownMenu.Item
              className={styles.Item}
              onClick={(e) => e.stopPropagation()}
              onSelect={() =>
                handleOptionSelect(
                  moduleName || "undefined module",
                  moduleId || -1,
                  "editModule",
                )
              }
            >
              <span className={styles.menuIcon}>
                <ion-icon name="pencil-outline"></ion-icon>
              </span>
              Edit
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className={clsx(styles.Item, styles.menuDelete)}
              onClick={(e) => e.stopPropagation()}
              onSelect={() =>
                handleOptionSelect(
                  moduleName || "undefined module",
                  moduleId || -1,
                  "deleteModule",
                )
              }
            >
              <span>
                <ion-icon name="trash-outline"></ion-icon>
              </span>
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <div className={styles.statusCounter}>
        <div className={clsx(styles.statusElement, styles.statusPassed)}>
          <span className={styles.statusIcon}>
            <ion-icon name="checkmark-circle-outline"></ion-icon>
          </span>
          {statusCounter.passed}
        </div>
        <div className={clsx(styles.statusElement, styles.statusFailed)}>
          <span className={styles.statusIcon}>
            <ion-icon name="close-circle-outline"></ion-icon>
          </span>
          {statusCounter.failed}
        </div>
        <div className={clsx(styles.statusElement, styles.statusSkipped)}>
          <span className={styles.statusIcon}>
            <ion-icon name="ban-outline"></ion-icon>
          </span>
          {statusCounter.skipped}
        </div>
        <div className={clsx(styles.statusElement, styles.statusToDo)}>
          <span className={styles.statusIcon}>
            <ion-icon name="clipboard-outline"></ion-icon>
          </span>
          {statusCounter.toDo}
        </div>
      </div>
    </div>
  );
}
