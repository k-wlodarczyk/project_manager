import styles from "./ProjectItem.module.css";

export default function ProjectItem() {
  return (
    <div className={styles.projectItem}>
      <ion-icon name="folder-open-outline"></ion-icon>
      <div>
        <p className={styles.projectName}>E-commerce platform</p>
        <p className={styles.projectDetails}>2 tests</p>
      </div>
    </div>
  );
}
