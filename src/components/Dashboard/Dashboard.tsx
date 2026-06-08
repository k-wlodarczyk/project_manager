import styles from "./Dashboard.module.css";

import TestCaseSection from "../TestCasesSection/TestCasesSection";
import Sidebar from "../Sidebar components/Sidebar/Sidebar";

import Header from "../Header/Header";

export default function Dashboard() {
  return (
    <div className={styles.appContent}>
      <Header>Project Manager</Header>
      <div className={styles.dashboard}>
        <Sidebar />
        <TestCaseSection />
      </div>
    </div>
  );
}
