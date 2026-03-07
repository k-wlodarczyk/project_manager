import styles from "./SidebarItems.module.css";

export default function SidebarItems() {
  return (
    <div className={styles.elements}>
      <div className={styles.element}>
        <ion-icon name="folder-open-outline"></ion-icon>
        <div>
          <p className={styles.projectName}>E-commerce platform</p>
          <p className={styles.projectDetails}>2 tests</p>
        </div>
      </div>
    </div>
  );
}
