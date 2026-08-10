import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import styles from "./ModalTestCaseSteps.module.css";
import clsx from "clsx";
import type { TestCaseStep } from "../../../types/testCaseStep";

interface ModalTestCaseStepsProps {
  testCaseSteps: TestCaseStep[];
  handleNewTestCaseStep: () => void;
  handleNewTestCaseStepAfterIndex: (id: number) => void;
  handleUpdateTestCaseSteps: (id: number, field: string, value: string) => void;
  handleDeleteTestCaseStep: (id: number) => void;
  handleReorderTestCaseSteps: (reorderSteps: TestCaseStep[]) => void;
  disabled: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

export default function ModalTestCaseSteps({
  testCaseSteps,
  handleNewTestCaseStep,
  handleNewTestCaseStepAfterIndex,
  handleUpdateTestCaseSteps,
  handleDeleteTestCaseStep,
  handleReorderTestCaseSteps,
  disabled,
  ref,
}: ModalTestCaseStepsProps) {
  const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const setNewOrderForSteps = (
    reorderedSteps: TestCaseStep[],
  ): TestCaseStep[] => {
    return reorderedSteps.map((step, index) => ({
      ...step,
      order: index,
    }));
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (destination.index === source.index) return;

    const reorderedSteps = reorder(
      testCaseSteps,
      source.index,
      destination.index,
    );
    const reorderedStepsWithNewOrder = setNewOrderForSteps(reorderedSteps);

    handleReorderTestCaseSteps(reorderedStepsWithNewOrder);
  };

  return (
    <DragDropContext
      onDragEnd={(result) => {
        onDragEnd(result);
      }}
    >
      <Droppable droppableId="droppable" isDropDisabled={disabled}>
        {(provided) => (
          <div
            className={clsx(styles.testCaseStepsSection)}
            ref={(node) => {
              provided.innerRef(node);
              if (typeof ref === "function") {
                ref(node);
              } else if (ref) {
                (ref as React.MutableRefObject<HTMLDivElement | null>).current =
                  node;
              }
            }}
            {...provided.droppableProps}
          >
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
              <Draggable
                key={step.id}
                draggableId={step?.id?.toString()}
                index={index}
                isDragDisabled={disabled}
              >
                {(dragProvided, dragSnapshot) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    className={clsx(
                      styles.rowWrapper,
                      dragSnapshot.isDragging && styles.rowWrapperDragging,
                    )}
                  >
                    <div
                      className={clsx(
                        styles.testCaseStepsItem,
                        disabled && styles.testCaseStepsItemView,
                        !disabled && styles.testCaseStepsItemEdit,
                      )}
                    >
                      {!disabled && (
                        <div
                          className={styles.dragHandle}
                          {...dragProvided.dragHandleProps}
                        >
                          :::
                        </div>
                      )}

                      <div className={styles.stepNumber}>{index + 1}</div>

                      <div className={styles.textareaWithLabel}>
                        <textarea
                          placeholder={disabled ? "" : "Action"}
                          value={step.action}
                          disabled={disabled}
                          onChange={(e) =>
                            handleUpdateTestCaseSteps(
                              step.id,
                              "action",
                              e.target.value,
                            )
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
                            handleUpdateTestCaseSteps(
                              step.id,
                              "input",
                              e.target.value,
                            )
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
                            handleUpdateTestCaseSteps(
                              step.id,
                              "expected",
                              e.target.value,
                            )
                          }
                          spellCheck="false"
                        />
                      </div>
                      {!disabled && (
                        <button
                          onClick={() => handleDeleteTestCaseStep(step.id)}
                        >
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
                )}
              </Draggable>
            ))}
            {provided.placeholder}

            {!disabled && <button onClick={handleNewTestCaseStep}>+</button>}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
