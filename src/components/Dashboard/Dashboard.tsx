import styles from "./Dashboard.module.css";
import ModulesSidebar from "../ModulesSidebar/ModulesSidebar";
import ProjectsSidebar from "../ProjectsSidebar/ProjectsSidebar";
import TestCaseSection from "../TestCasesSection/TestCasesSection";

export default function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <ProjectsSidebar />
      <ModulesSidebar />
      <TestCaseSection />
    </div>
  );
}
