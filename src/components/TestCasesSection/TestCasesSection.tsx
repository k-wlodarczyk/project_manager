import { useEffect, useState, type MouseEvent } from "react";
import SidebarHeader from "../Sidebar components/SidebarHeader/SidebarHeader";
import Modal from "../Modal components/Modal/Modal";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useFetchItems } from "../../hooks/useFetchItems";
import TestCaseItem from "../TestCaseItem/TestCaseItem";
import styles from "./TestCasesSection.module.css";

const MODAL_CONFIG = {
  view: {
    title: "View test case",
    subtitle: "",
  },
  create: {
    title: "New test case",
    subtitle: "Add test case",
  },
  edit: {
    title: "Edit test case",
    subtitle: "",
  },
};

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

export default function TestCaseSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<
    number | undefined
  >(undefined);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { projectId, moduleId } = useParams();

  const { data: testCases, refresh } = useFetchItems("test_cases", "view");
  const { data: modules } = useFetchItems("modules", "view");

  const modalMode = isEditing ? "edit" : selectedTestCaseId ? "view" : "create";

  const { title, subtitle } = MODAL_CONFIG[modalMode];

  function showViewTestCaseModal(id: number) {
    setSelectedTestCaseId(id);
    setIsModalOpen(true);
  }

  function showCreateTestCaseModal() {
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setSelectedTestCaseId(undefined);
    setIsEditing(false);
  }

  function handleCheckboxClick(e: MouseEvent) {
    e.stopPropagation();
  }

  const testCaseFields = [
    {
      name: "module_id",
      label: "Module",
      type: "select",

      options: modules?.map((module: any) => ({
        value: module.id,
        label: module.name,
      })),
      defaultValue: moduleId || "",
    },
    { name: "name", label: "Test Case Name", placeholder: "Enter name" },
    {
      name: "description",
      label: "Test Case Description",
      placeholder: "Enter description",
    },
    {
      name: "execution",
      label: "Execution",
      hideInFormRows: true,
    },
    {
      name: "status",
      label: "Status",
      hideInFormRows: true,
    },
  ];

  console.log(testCases);
  return (
    <div>
      <SidebarHeader title="Test cases" onClick={showCreateTestCaseModal} />

      <div className={styles.listHeader}>
        <label htmlFor="">
          <input type="checkbox" name="" id="" />
        </label>
        <div>Test Case Name</div>
        <div>Last Result</div>
        <div>Execution</div>
        <div>Last Execution Date</div>
      </div>

      <div className={styles.list}>
        {!moduleId &&
          modules?.map((module: any) => (
            <>
              <div className={styles.moduleHeader}>
                <label htmlFor="">
                  <input type="checkbox" name="" id="" />
                </label>
                <div>MODULE: {module.name}</div>
              </div>
              {testCases
                ?.filter((testCase: any) => testCase.module_id === module.id)
                .map((filtered: any) => (
                  <div
                    className={styles.listItem}
                    onClick={() => showViewTestCaseModal(filtered.id)}
                  >
                    <label htmlFor="testCaseCheck">
                      <input
                        type="checkbox"
                        name="testCaseCheck"
                        id="testCaseCheck"
                        onClick={handleCheckboxClick}
                      />
                    </label>

                    <div>{filtered.name}</div>
                    <div
                      className={
                        styles[
                          testCaseStatusCss[
                            filtered.status as keyof typeof testCaseStatusCss
                          ] as any
                        ]
                      }
                    >
                      {filtered.status}
                    </div>
                    <div
                      className={
                        styles[
                          testCaseExecutionCss[
                            filtered.execution as keyof typeof testCaseExecutionCss
                          ] as any
                        ]
                      }
                    >
                      {filtered.execution}
                    </div>
                    <div>2026-04-12</div>
                  </div>
                ))}
            </>
          ))}

        {moduleId && (
          <div className={styles.list}>
            {testCases?.map((testCase: any) => (
              <div
                key={testCase.id}
                className={styles.listItem}
                onClick={() => showViewTestCaseModal(testCase.id)}
              >
                <label
                  htmlFor={`check-${testCase.id}`}
                  onClick={handleCheckboxClick}
                >
                  <input
                    type="checkbox"
                    name="testCaseCheck"
                    id={`check-${testCase.id}`}
                  />
                </label>

                <div>{testCase.name}</div>

                <div
                  className={
                    styles[
                      testCaseStatusCss[
                        testCase.status as keyof typeof testCaseStatusCss
                      ] as any
                    ]
                  }
                >
                  {testCase.status}
                </div>
                <div
                  className={
                    styles[
                      testCaseExecutionCss[
                        testCase.execution as keyof typeof testCaseExecutionCss
                      ] as any
                    ]
                  }
                >
                  {testCase.execution}
                </div>
                <div>2026-04-10</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <Modal
          type="testCases"
          title={title}
          subtitle={subtitle}
          onCancel={handleCloseModal}
          onSuccess={refresh}
          onEdit={() => setIsEditing(true)}
          onCancelEdit={() => setIsEditing(false)}
          fields={testCaseFields}
          objectId={selectedTestCaseId}
          viewMode={modalMode}
        />
      )}
    </div>
  );
}
