import { Link } from "react-router-dom";
import styles from "./TestCaseListItem.module.scss";
import clsx from "clsx";
import { useMemo, type ChangeEvent } from "react";

interface TestCaseListItemProps {
  testCase: any;
  activeModuleId?: string;
  activeProjectId?: string;
  checkedTestCases: number[];
  onCheckboxChange: (
    e: ChangeEvent<HTMLInputElement, HTMLInputElement>,
    id: number,
  ) => void;
}

const testCaseStatusCss = {
  "To Do": "todo",
  Passed: "passed",
  Failed: "failed",
  Skipped: "skipped",
};

const testCaseExecutionCss = {
  Manual: "manual",
  Automated: "automated",
};

export default function TestCaseListItem({
  testCase,
  activeModuleId,
  activeProjectId,
  checkedTestCases,
  onCheckboxChange,
}: TestCaseListItemProps) {
  const linkPath = useMemo(() => {
    return activeModuleId
      ? `/project/${activeProjectId}/module/${activeModuleId}/testCase/${testCase.id}`
      : `/project/${activeProjectId}/testCase/${testCase.id}`;
  }, [activeModuleId, activeProjectId, testCase.id]);

  return (
    <div>
      <Link to={linkPath} className={styles.testCaseLink}>
        <div className={styles.listItem}>
          <label
            htmlFor={`check-${testCase.id}`}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              name="testCaseCheck"
              id={`check-${testCase.id}`}
              checked={checkedTestCases.includes(testCase.id)}
              onChange={(e) => onCheckboxChange(e, testCase.id)}
            />
          </label>
          <div className={styles.testCaseName}>{testCase.name}</div>
          <div
            className={clsx(
              styles.status,
              styles[
                testCaseStatusCss[
                  testCase.status as keyof typeof testCaseStatusCss
                ] as any
              ],
            )}
          >
            {testCase.status}
          </div>
          <div
            className={clsx(
              styles.execution,
              styles[
                testCaseExecutionCss[
                  testCase.execution as keyof typeof testCaseExecutionCss
                ] as any
              ],
            )}
          >
            {testCase.execution}
          </div>
          <div>2026-04-12</div>
        </div>
      </Link>
    </div>
  );
}
