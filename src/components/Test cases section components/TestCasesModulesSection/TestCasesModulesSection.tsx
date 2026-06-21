import styles from "./TestCasesModulesSection.module.css";
import { useEffect, useMemo, useState } from "react";
import TestCasesModulesElement from "../TestCasesListHeader/TestCasesModulesElement/TestCasesModulesElement";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface TestCasesModulesSectionProps {
  modules: any[];
  testCases: any[];
  onClick: (id: number | undefined) => void;
  projectSlug: string | undefined;
  selectedModuleId?: number;
  onModuleActionSelect: () => void;
  onModulesReorder: (updatedModules: any[]) => void;
}

export default function TestCasesModulesSection({
  modules,
  testCases,
  onClick,
  projectSlug,
  selectedModuleId,
  onModuleActionSelect,
  onModulesReorder,
}: TestCasesModulesSectionProps) {
  if (!projectSlug) return <></>;

  const [fetchedModules, setFetchedModules] = useState(modules || []);

  useEffect(() => {
    if (modules) {
      setFetchedModules(modules);
    }
  }, [modules]);

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
      if (tc.projects.slug === projectSlug) {
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
  }, [testCases, projectSlug]);

  const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  function onDragEnd(result: any) {
    if (!result.destination) return;
    if (
      result.destination.droppableId === result.source.droppableId &&
      result.destination.index === result.source.index
    ) {
      return;
    }

    const reorderedModules = reorder(
      fetchedModules,
      result.source.index,
      result.destination.index,
    );

    const updatedModulesOrder = reorderedModules.map((module, idx) => ({
      ...module,
      order: idx,
    }));

    setFetchedModules(updatedModulesOrder);

    onModulesReorder(updatedModulesOrder);
  }

  return (
    <>
      {projectSlug && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={styles.moduleContainers}
              >
                <TestCasesModulesElement
                  selectedModuleId={selectedModuleId}
                  statusCounter={testCasesStats.projectStats}
                  onClick={onClick}
                  onModuleActionSelect={onModuleActionSelect}
                />
                {fetchedModules.map((module: any, index: number) => {
                  const moduleStats = testCasesStats.modulesStats[
                    module.id
                  ] || {
                    total: 0,
                    passed: 0,
                    failed: 0,
                    skipped: 0,
                    toDo: 0,
                  };
                  return (
                    <Draggable
                      key={module.id.toString()}
                      draggableId={module.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <TestCasesModulesElement
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          dragHandleProps={provided.dragHandleProps}
                          selectedModuleId={selectedModuleId}
                          moduleName={module.name}
                          moduleId={module.id}
                          statusCounter={moduleStats}
                          onClick={onClick}
                          onModuleActionSelect={onModuleActionSelect}
                        />
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </>
  );
}
