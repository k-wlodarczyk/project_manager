import SidebarButtonAdd from "../SidebarButtonAdd/SidebarButtonAdd";
import styles from "./SidebarHeader.module.css";

interface SidebarHeaderProps {
  title: string;
  onClick: () => void;
}

export default function SidebarHeader({ title, onClick }: SidebarHeaderProps) {
  return (
    <div className={styles.sidebarHeader}>
      <h2>{title}</h2>
      <SidebarButtonAdd onClick={onClick} />
    </div>
  );
}
