import TestCasesModuleHeader from "../TestCasesListModuleHeader/TestCasesListModuleHeader";
import type { ChangeEvent } from "react";
import TestCaseListItem from "../TestCaseListItem/TestCaseListItem";
import TestCasesListHeader from "../TestCasesListHeader/TestCasesListHeader";

interface TestCasesListProps {
  activeModuleId?: string;
  activeProjectId?: string;
  testCases: any;
  checkedTestCases: number[];
  modules: any;
  onModuleChecked: (moduleId: number) => void;
  onGlobalChecked: () => void;
  onCheckboxChange: (
    e: ChangeEvent<HTMLInputElement, HTMLInputElement>,
    id: number,
  ) => void;
}

export default function TestCasesList({
  activeModuleId,
  activeProjectId,
  testCases,
  checkedTestCases,
  modules,
  onCheckboxChange,
  onGlobalChecked,
  onModuleChecked,
}: TestCasesListProps) {
  return (
    <>
      <TestCasesListHeader
        onGlobalChecked={onGlobalChecked}
        testCases={testCases}
        activeModuleId={activeModuleId}
        checkedTestCases={checkedTestCases}
      />
      {!activeModuleId ? (
        <>
          {modules?.map((module: any) => {
            const moduleTestCases =
              testCases?.filter((tc: any) => tc.module_id === module.id) || [];

            if (moduleTestCases.length === 0) return null;

            return (
              <div key={module.id}>
                <TestCasesModuleHeader
                  moduleId={module.id}
                  moduleName={module.name}
                  onModuleChecked={onModuleChecked}
                  checkedTestCases={checkedTestCases}
                  moduleTestCases={moduleTestCases}
                />

                {moduleTestCases.map((tc: any) => (
                  <TestCaseListItem
                    key={tc.id}
                    testCase={tc}
                    activeModuleId={activeModuleId}
                    activeProjectId={activeProjectId}
                    checkedTestCases={checkedTestCases}
                    onCheckboxChange={onCheckboxChange}
                  />
                ))}
              </div>
            );
          })}
        </>
      ) : (
        <>
          {testCases
            ?.filter((testCase: any) => testCase.module_id === +activeModuleId)
            .map((moduleTc: any) => (
              <TestCaseListItem
                key={moduleTc.id}
                testCase={moduleTc}
                activeModuleId={activeModuleId}
                activeProjectId={activeProjectId}
                checkedTestCases={checkedTestCases}
                onCheckboxChange={onCheckboxChange}
              />
            ))}
        </>
      )}
    </>
  );
}
