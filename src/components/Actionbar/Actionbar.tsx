import clsx from "clsx";
import styles from "./Actionbar.module.scss";

interface Actionbar {
  onNewTestClick: () => void;
  onNewModuleClick: () => void;
  onDropdownOption: (
    selectedOption: "changeTestCaseStatus" | "deleteTestCases",
  ) => void;
  checkedTestCasesCounter: number;
}

export default function Actionbar({
  onNewTestClick,
  onNewModuleClick,
  onDropdownOption,
  checkedTestCasesCounter,
}: Actionbar) {
  return (
    <div className={styles.actionbar}>
      <div className={styles.selectedItemsCounter}>
        <span className={styles.spanIcon}>
          <ion-icon name="checkmark-circle-outline"></ion-icon>
        </span>
        {checkedTestCasesCounter > 0 ? `${checkedTestCasesCounter}` : `No`}{" "}
        items selected
      </div>
      {checkedTestCasesCounter > 0 && (
        <div className={styles.selectedItemsActionBtns}>
          <button
            className={styles.selectedItemsActionBtn}
            onClick={() => onDropdownOption("changeTestCaseStatus")}
          >
            <span className={styles.spanIcon}>
              <ion-icon name="list-outline"></ion-icon>
            </span>
            Change status
          </button>
          <button className={styles.selectedItemsActionBtn}>
            <span className={styles.spanIcon}>
              <ion-icon name="folder-outline"></ion-icon>
            </span>
            change module
          </button>
          <button className={styles.selectedItemsActionBtn}>
            <span className={styles.spanIcon}>
              <ion-icon name="ellipsis-horizontal-outline"></ion-icon>
            </span>
            more
          </button>
          <button
            className={clsx(
              styles.selectedItemsActionBtn,
              styles.selectedItemsActionBtnDelete,
            )}
            onClick={() => onDropdownOption("deleteTestCases")}
          >
            <span className={styles.spanIcon}>
              <ion-icon name="trash-outline"></ion-icon>
            </span>
            delete
          </button>
        </div>
      )}

      <div className={styles.newItemBtns}>
        <button
          className={clsx(styles.newItemBtn, styles.newTestCaseBtn)}
          onClick={onNewTestClick}
        >
          <span className={styles.spanIcon}>
            <ion-icon name="add-outline"></ion-icon>
          </span>{" "}
          new test case
        </button>
        <button
          className={clsx(styles.newItemBtn, styles.newModuleBtn)}
          onClick={onNewModuleClick}
        >
          <span className={styles.spanIcon}>
            <ion-icon name="add-outline"></ion-icon>
          </span>{" "}
          new module
        </button>
      </div>
    </div>
  );
}
