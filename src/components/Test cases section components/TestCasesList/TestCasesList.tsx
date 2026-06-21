import TestCasesModuleHeader from "../TestCasesListModuleHeader/TestCasesListModuleHeader";
import { type ChangeEvent } from "react";
import TestCaseListItem from "../TestCaseListItem/TestCaseListItem";
import TestCasesListHeader from "../TestCasesListHeader/TestCasesListHeader";
import styles from "./TestCasesList.module.scss";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

interface TestCasesListProps {
  activeTeamSlug?: string;
  activeModuleSlug?: string;
  activeProjectSlug?: string;
  testCases: any[];
  checkedTestCases: number[];
  modules: any[];
  onTestCasesReorder: (updatedTestCases: any[]) => void;
  onModuleChecked: (moduleId: number) => void;
  onGlobalChecked: () => void;
  onCheckboxChange: (
    e: ChangeEvent<HTMLInputElement, HTMLInputElement>,
    id: number,
  ) => void;
}

export default function TestCasesList({
  activeTeamSlug,
  activeModuleSlug,
  activeProjectSlug,
  testCases = [],
  checkedTestCases,
  modules,
  onTestCasesReorder,
  onCheckboxChange,
  onGlobalChecked,
  onModuleChecked,
}: TestCasesListProps) {
  const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  function onDragEnd(result: any, moduleTestCases: any[]) {
    if (!result.destination) return;
    if (
      result.destination.droppableId === result.source.droppableId &&
      result.destination.index === result.source.index
    ) {
      return;
    }

    const reorderedTestCases = reorder(
      moduleTestCases,
      result.source.index,
      result.destination.index,
    );

    const updatedModuleTestCases = reorderedTestCases.map((testCase, idx) => ({
      ...testCase,
      order_in_module: idx,
    }));

    const otherModulesTestCases = testCases.filter(
      (globalTc: any) =>
        globalTc.module_id !== Number(result.source.droppableId),
    );

    const finalAllTestCases = [
      ...otherModulesTestCases,
      ...updatedModuleTestCases,
    ];

    onTestCasesReorder(finalAllTestCases);
  }

  const activeModuleTestCases =
    testCases?.filter(
      (testCase: any) => testCase.modules.slug === activeModuleSlug,
    ) || [];

  return (
    <>
      <TestCasesListHeader
        onGlobalChecked={onGlobalChecked}
        testCases={testCases}
        activeModuleId={activeModuleSlug}
        checkedTestCases={checkedTestCases}
      />
      {!activeModuleSlug ? (
        <div className={styles.listContent}>
          {modules?.map((module: any) => {
            const moduleTestCases =
              testCases?.filter((tc: any) => tc.module_id === module.id) || [];

            if (moduleTestCases.length === 0) return null;

            return (
              <DragDropContext
                onDragEnd={(result) => onDragEnd(result, moduleTestCases)}
                key={`ctx-${module.id}`}
              >
                <TestCasesModuleHeader
                  moduleId={module.id}
                  moduleName={module.name}
                  onModuleChecked={onModuleChecked}
                  checkedTestCases={checkedTestCases}
                  moduleTestCases={moduleTestCases}
                />
                <Droppable droppableId={module.id.toString()}>
                  {(provided) => (
                    <div
                      key={module.id}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {moduleTestCases.map((tc: any, index: number) => (
                        <Draggable
                          key={tc.id.toString()}
                          draggableId={tc.id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <TestCaseListItem
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              dragHandleProps={provided.dragHandleProps}
                              key={tc.id}
                              testCase={tc}
                              activeTeamSlug={activeTeamSlug}
                              activeModuleSlug={activeModuleSlug}
                              activeProjectSlug={activeProjectSlug}
                              checkedTestCases={checkedTestCases}
                              onCheckboxChange={onCheckboxChange}
                            />
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            );
          })}
        </div>
      ) : (
        <div className={styles.listContent}>
          <DragDropContext
            onDragEnd={(result) => onDragEnd(result, activeModuleTestCases)}
          >
            <Droppable droppableId={activeModuleSlug}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {activeModuleTestCases.map((moduleTc: any, index: number) => (
                    <Draggable
                      key={moduleTc.id.toString()}
                      draggableId={moduleTc.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <TestCaseListItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          dragHandleProps={provided.dragHandleProps}
                          key={moduleTc.id}
                          testCase={moduleTc}
                          activeTeamSlug={activeTeamSlug}
                          activeModuleSlug={activeModuleSlug}
                          activeProjectSlug={activeProjectSlug}
                          checkedTestCases={checkedTestCases}
                          onCheckboxChange={onCheckboxChange}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}
    </>
  );
}
