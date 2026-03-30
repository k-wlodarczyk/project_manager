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
}

export default function ModalTestCaseSteps({
  testCaseSteps,
  handleNewTestCaseStep,
  handleUpdateTestCaseSteps,
}: ModalTestCaseStepsProps) {
  const [addTestCaseMode, setAddTestCaseMode] = useState(false);

  return (
    <>
      <button onClick={() => setAddTestCaseMode(true)}>Add steps</button>
      <div className={styles.testCasesHeader}>
        <div>No.</div>
        <div>Actions</div>
        <div>Expected results</div>
      </div>

      {testCaseSteps.map((step, index) => (
        <div key={step.id} className={styles.rowWrapper}>
          <div className={styles.testCaseStepsSection}>
            <div className={styles.dragHandle}>:::</div>
            <div className={styles.stepNumber}>{index + 1}</div>

            <div className={styles.textareaWithLabel}>
              <textarea
                placeholder="Action"
                value={step.action}
                onChange={(e) =>
                  handleUpdateTestCaseSteps(step.id, "action", e.target.value)
                }
              />
            </div>

            <div className={styles.textareaWithLabel}>
              <textarea
                placeholder="Expected result"
                value={step.expected}
                onChange={(e) =>
                  handleUpdateTestCaseSteps(step.id, "expected", e.target.value)
                }
              />
            </div>
          </div>
          <button
            type="button"
            className={styles.insertButton}
            onClick={handleNewTestCaseStep}
          >
            <span>+</span>
          </button>
        </div>
      ))}

      <button onClick={handleNewTestCaseStep}>+</button>
    </>
  );
}
