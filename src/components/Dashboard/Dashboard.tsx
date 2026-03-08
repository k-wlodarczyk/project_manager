import styles from "./Dashboard.module.css";

import TestCaseSection from "../TestCasesSection/TestCasesSection";
import Sidebar from "../Sidebar components/Sidebar/Sidebar";

export default function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <Sidebar type="projects" />
      <Sidebar type="modules" />
      <TestCaseSection />
    </div>
  );
}
