import styles from "./TestCasesModulesSection.module.css";
import { useMemo } from "react";
import TestCasesModulesElement from "../TestCasesListHeader/TestCasesModulesElement/TestCasesModulesElement";

interface TestCasesModulesSectionProps {
  modules: any[];
  testCases: any[];
  onClick: (id: number | undefined) => void;
  projectId: string | undefined;
  selectedModuleId?: number;
  onModuleActionSelect: () => void;
}

export default function TestCasesModulesSection({
  modules,
  testCases,
  onClick,
  projectId,
  selectedModuleId,
  onModuleActionSelect,
}: TestCasesModulesSectionProps) {
  if (!projectId) return <></>;

  const testCasesStats = useMemo(() => {
    type StatCounters = {
      total: number;
      passed: number;
      failed: number;
      skipped: number;
      toDo: number;
    };
    const stats: Record<number, StatCounters> = {};

    let totalProjectCases = 0;
    let passedProjectCases = 0;
    let failedProjectCases = 0;
    let skippedProjectCases = 0;
    let toDoProjectCases = 0;

    testCases?.forEach((tc: any) => {
      if (tc.project_id === +projectId) {
        totalProjectCases++;
        if (tc.status === "Passed") passedProjectCases++;
        if (tc.status === "Failed") failedProjectCases++;
        if (tc.status === "Skipped") skippedProjectCases++;
        if (tc.status === "To Do") toDoProjectCases++;

        const mId = tc.module_id;
        if (mId !== undefined && mId !== null) {
          if (!stats[mId]) {
            stats[mId] = {
              total: 0,
              passed: 0,
              failed: 0,
              skipped: 0,
              toDo: 0,
            };
          }

          stats[mId].total++;
          if (tc.status === "Passed") stats[mId].passed++;
          if (tc.status === "Failed") stats[mId].failed++;
          if (tc.status === "Skipped") stats[mId].skipped++;
          if (tc.status === "To Do") stats[mId].toDo++;
        }
      }
    });

    const projectStats = {
      total: totalProjectCases,
      passed: passedProjectCases,
      failed: failedProjectCases,
      skipped: skippedProjectCases,
      toDo: toDoProjectCases,
    };

    return {
      modulesStats: stats,
      projectStats,
    };
  }, [testCases, projectId]);

  return (
    <>
      {projectId && (
        <div className={styles.moduleContainers}>
          <TestCasesModulesElement
            selectedModuleId={selectedModuleId}
            statusCounter={testCasesStats.projectStats}
            onClick={onClick}
            onModuleActionSelect={onModuleActionSelect}
          />

          {modules?.map((module: any) => {
            const moduleStats = testCasesStats.modulesStats[module.id] || {
              total: 0,
              passed: 0,
              failed: 0,
              skipped: 0,
              toDo: 0,
            };

            return (
              <TestCasesModulesElement
                selectedModuleId={selectedModuleId}
                moduleName={module.name}
                moduleId={module.id}
                statusCounter={moduleStats}
                onClick={onClick}
                onModuleActionSelect={onModuleActionSelect}
              />
            );
          })}
        </div>
      )}
    </>
  );
}
