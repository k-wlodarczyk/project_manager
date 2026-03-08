import styles from "./SidebarItem.module.css";
export default function SidebarItem() {
  return (
    <div className={styles.element}>
      <ion-icon name="folder-open-outline"></ion-icon>
      <div>
        <p className={styles.projectName}>Tic tac toe - react </p>
        <p className={styles.projectDetails}>2 tests</p>
      </div>
    </div>
  );
}
