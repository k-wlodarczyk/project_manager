import styles from "./Dashboard.module.css";

import TestCaseSection from "../TestCasesSection/TestCasesSection";

import Header from "../Header/Header";

export default function Dashboard() {
  return (
    <>
      <Header>Project Manager</Header>
      <div className={styles.dashboard}>
        {/* <Sidebar type="projects" /> */}
        {/* <Sidebar type="modules" /> */}
        <TestCaseSection />
      </div>
    </>
  );
}
