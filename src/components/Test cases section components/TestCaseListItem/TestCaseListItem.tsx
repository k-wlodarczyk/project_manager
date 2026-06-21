import { Link } from "react-router-dom";
import styles from "./TestCaseListItem.module.scss";
import clsx from "clsx";
import { useMemo, type ChangeEvent } from "react";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";

interface TestCaseListItemProps {
  testCase: any;
  activeTeamSlug?: string;
  activeModuleSlug?: string;
  activeProjectSlug?: string;
  checkedTestCases: number[];
  ref?: any;
  dragHandleProps?: any;
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
  activeTeamSlug,
  activeModuleSlug,
  activeProjectSlug,
  checkedTestCases,
  onCheckboxChange,
  ref,
  dragHandleProps,
  ...draggableProps
}: TestCaseListItemProps) {
  const linkPath = useMemo(() => {
    return activeModuleSlug
      ? `/team/${activeTeamSlug}/project/${activeProjectSlug}/module/${activeModuleSlug}/testCase/${testCase.id}`
      : `/team/${activeTeamSlug}/project/${activeProjectSlug}/testCase/${testCase.id}`;
  }, [activeModuleSlug, activeProjectSlug, testCase.id]);

  return (
    <div ref={ref} {...draggableProps}>
      <div className={styles.listItem}>
        <div className={styles.btnDrag} {...dragHandleProps}>
          <DragHandleDots2Icon />
        </div>
        <div className={styles.labelSection}>
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
        </div>

        <Link to={linkPath} className={styles.testCaseLink}>
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
          <div>-</div>
        </Link>
      </div>
    </div>
  );
}
