import { useState } from "react";
import styles from "./ModalTestCaseSteps.module.css";
import clsx from "clsx";

interface TestCaseStep {
  id: number;
  action: string;
  expected: string;
}

interface ModalTestCaseStepsProps {
  testCaseSteps: TestCaseStep[];
  handleNewTestCaseStep: () => void;
  handleUpdateTestCaseSteps: (id: number, field: string, value: string) => void;
  handleDeleteTestCaseStep: (id: number) => void;
  disabled: boolean;
}

export default function ModalTestCaseSteps({
  testCaseSteps,
  handleNewTestCaseStep,
  handleUpdateTestCaseSteps,
  handleDeleteTestCaseStep,
  disabled,
}: ModalTestCaseStepsProps) {
  const [addTestCaseMode, setAddTestCaseMode] = useState(false);

  return (
    <div className={styles.testCaseStepsSection}>
      <div
        className={clsx(
          styles.testCasesHeader,
          disabled && styles.testCaseStepsHeaderView,
          !disabled && styles.testCaseStepsHeaderEdit,
        )}
      >
        {!disabled && <div></div>}
        <div>No.</div>
        <div>Actions</div>
        <div>Expected results</div>
      </div>

      {testCaseSteps.map((step, index) => (
        <div key={step.id} className={styles.rowWrapper}>
          <div
            className={clsx(
              styles.testCaseStepsItem,
              disabled && styles.testCaseStepsItemView,
              !disabled && styles.testCaseStepsItemEdit,
            )}
          >
            {!disabled && <div className={styles.dragHandle}>:::</div>}

            <div className={styles.stepNumber}>{index + 1}</div>

            <div className={styles.textareaWithLabel}>
              <textarea
                placeholder={disabled ? "" : "Action"}
                value={step.action}
                disabled={disabled}
                onChange={(e) =>
                  handleUpdateTestCaseSteps(step.id, "action", e.target.value)
                }
                spellCheck="false"
              />
            </div>

            <div className={styles.textareaWithLabel}>
              <textarea
                placeholder={disabled ? "" : "Expected result"}
                value={step.expected}
                disabled={disabled}
                onChange={(e) =>
                  handleUpdateTestCaseSteps(step.id, "expected", e.target.value)
                }
                spellCheck="false"
              />
            </div>
            {!disabled && (
              <button onClick={() => handleDeleteTestCaseStep(step.id)}>
                <ion-icon name="trash-outline"></ion-icon>
              </button>
            )}
          </div>
          {!disabled && (
            <button
              type="button"
              className={styles.insertButton}
              onClick={handleNewTestCaseStep}
            >
              <span>+</span>
            </button>
          )}
        </div>
      ))}

      {!disabled && <button onClick={handleNewTestCaseStep}>+</button>}
    </div>
  );
}
