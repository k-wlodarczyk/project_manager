import SidebarItem from "../SidebarItem/SidebarItem";
import styles from "./SidebarItems.module.css";

interface SidebarItemsProps {
  type: string;
}

export default function SidebarItems({ type }: SidebarItemsProps) {
  return (
    <div className={styles.elements}>
      <SidebarItem />
    </div>
  );
}
