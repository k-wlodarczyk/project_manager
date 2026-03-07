import SidebarButtonAdd from "../SidebarButtonAdd/SidebarButtonAdd";
import styles from "./SidebarHeader.module.css";

interface SidebarHeaderProps {
  title: string;
}

export default function SidebarHeader({ title }: SidebarHeaderProps) {
  return (
    <div className={styles.sidebarHeader}>
      <h2>{title}</h2>
      <SidebarButtonAdd />
    </div>
  );
}
