import clsx from "clsx";
import styles from "./SidebarButtonAdd.module.css";

interface SidebarButtonAddProps {
  onClick: () => void;
  type: "projects" | "modules" | "testCases";
}

export default function SidebarButtonAdd({
  onClick,
  type,
}: SidebarButtonAddProps) {
  return (
    <button
      className={clsx(
        styles.btnAdd,
        type === "testCases" && styles.btnAddTestCase,
      )}
      onClick={onClick}
    >
      {type === "testCases" ? (
        <>
          <span>+</span>New test case
        </>
      ) : (
        "+"
      )}
    </button>
  );
}
