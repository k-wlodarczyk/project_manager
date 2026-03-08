import styles from "./SidebarButtonAdd.module.css";

interface SidebarButtonAddProps {
  onClick: () => void;
}

export default function SidebarButtonAdd({ onClick }: SidebarButtonAddProps) {
  return (
    <button className={styles.btnAdd} onClick={onClick}>
      +
    </button>
  );
}
