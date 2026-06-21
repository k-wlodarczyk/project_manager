import styles from "./ModalTestCaseSteps.module.css";
import clsx from "clsx";

interface TestCaseStep {
  id: number;
  action: string;
  input: string;
  expected: string;
}

interface ModalTestCaseStepsProps {
  testCaseSteps: TestCaseStep[];
  handleNewTestCaseStep: () => void;
  handleNewTestCaseStepAfterIndex: (id: number) => void;
  handleUpdateTestCaseSteps: (id: number, field: string, value: string) => void;
  handleDeleteTestCaseStep: (id: number) => void;
  disabled: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

export default function ModalTestCaseSteps({
  testCaseSteps,
  handleNewTestCaseStep,
  handleNewTestCaseStepAfterIndex,
  handleUpdateTestCaseSteps,
  handleDeleteTestCaseStep,
  disabled,
  ref,
}: ModalTestCaseStepsProps) {
  return (
    <div ref={ref} className={styles.testCaseStepsSection}>
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
        <div>Input data</div>
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
                placeholder={disabled ? "" : "Input data"}
                value={step.input}
                disabled={disabled}
                onChange={(e) =>
                  handleUpdateTestCaseSteps(step.id, "input", e.target.value)
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
              onClick={() => handleNewTestCaseStepAfterIndex(index)}
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
