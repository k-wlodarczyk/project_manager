import { useState } from "react";
import styles from "./ModalTestCaseSteps.module.css";

interface TestCaseStep {
  id: number;
  action: string;
  expected: string;
}

interface ModalTestCaseStepsProps {
  testCaseSteps: TestCaseStep[];
  handleNewTestCaseStep: () => void;
  handleUpdateTestCaseSteps: (id: number, field: string, value: string) => void;
  disabled: boolean;
}

export default function ModalTestCaseSteps({
  testCaseSteps,
  handleNewTestCaseStep,
  handleUpdateTestCaseSteps,
  disabled,
}: ModalTestCaseStepsProps) {
  const [addTestCaseMode, setAddTestCaseMode] = useState(false);

  return (
    <div className={styles.testCaseStepsSection}>
      <div className={styles.testCasesHeader}>
        <div>No.</div>
        <div>Actions</div>
        <div>Expected results</div>
      </div>

      {testCaseSteps.map((step, index) => (
        <div key={step.id} className={styles.rowWrapper}>
          <div className={styles.testCaseStepsItem}>
            <div className={styles.dragHandle}>:::</div>
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
