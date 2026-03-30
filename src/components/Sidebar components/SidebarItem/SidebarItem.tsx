import styles from "./SidebarItem.module.css";
import clsx from "clsx";
import { Link } from "react-router-dom";

interface SidebarItemProps {
  type: "projects" | "modules";
  projectId: number;
  moduleId?: number;
  description?: string;
  projectUrl?: string;
  isSelected: boolean;
  children: React.ReactNode;
}

export default function SidebarItem({
  type,
  projectId,
  moduleId,
  children,
  isSelected,
}: SidebarItemProps) {
  const config = {
    projects: {
      path: `/project/${projectId}`,
      icon: "folder-open-outline",
    },
    modules: {
      path: `/project/${projectId}/module/${moduleId}`,
      icon: "book-outline",
    },
  };

  const currentConfig = config[type];

  const linkPath = currentConfig.path;

  return (
    <Link to={linkPath} className={styles.sidebarLink}>
      <div
        className={clsx(styles.element, {
          [styles.selected]: isSelected,
        })}
      >
        <ion-icon name={currentConfig.icon}></ion-icon>
        <div>
          <p className={styles.projectName}>{children}</p>
          <p className={styles.projectDetails}>2 tests</p>
        </div>
      </div>
    </Link>
  );
}
