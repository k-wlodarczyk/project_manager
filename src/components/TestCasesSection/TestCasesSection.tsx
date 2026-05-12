import { useEffect, useRef, useState, type ChangeEvent } from "react";
import SidebarHeader from "../Sidebar components/SidebarHeader/SidebarHeader";
import Modal from "../Modal components/Modal/Modal";
import { useParams } from "react-router-dom";
import { useFetchItems } from "../../hooks/useFetchItems";
import styles from "./TestCasesSection.module.css";
import { useTestCases } from "../../hooks/useTestCases";
import { useOnClickOutside } from "usehooks-ts";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";

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
  copy: {
    title: "Copy test case",
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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<
    number | undefined
  >(undefined);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isCopy, setIsCopy] = useState<boolean>(false);
  const [checkedTestCases, setCheckedTestCases] = useState<number[]>([]);

  const navigate = useNavigate();
  const { projectId, moduleId, testcaseId } = useParams();

  const ref = useRef<any>(null);

  useEffect(() => {
    setCheckedTestCases([]);
  }, [projectId]);

  useEffect(() => {
    if (testcaseId) {
      setSelectedTestCaseId(+testcaseId);
      setIsModalOpen(true);
    }
  }, [testcaseId]);

  const {
    data: testCases,
    isLoading,
    refresh,
  } = useFetchItems("test_cases", "view");
  const { data: modules } = useFetchItems("modules", "view");

  const { deleteTestCases } = useTestCases(checkedTestCases);

  const modalMode = isEditing
    ? isCopy
      ? "copy"
      : "edit"
    : selectedTestCaseId
      ? "view"
      : "create";

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
    setIsCopy(false);
    if (moduleId) {
      navigate(`/project/${projectId}/module/${moduleId}`);
    } else {
      navigate(`/project/${projectId}`);
    }
  }

  function handleCheckboxClick(e: ChangeEvent, id: number) {
    e.stopPropagation();
    setCheckedTestCases((prev) => {
      const arr = [...prev];
      let nextState;

      if (arr.includes(id)) {
        nextState = arr.filter((element) => element !== id);
      } else {
        nextState = [...arr, id];
      }

      return nextState;
    });
  }

  function handleModuleChecked(moduleId: number) {
    const testCasesFromModule = testCases
      .filter((testCase: any) => testCase.module_id === moduleId)
      .map((tc: any) => tc.id);

    const areAllTestCasesFromModuleChecked = testCasesFromModule.every(
      (tc: number) => checkedTestCases.includes(tc),
    );

    setCheckedTestCases((prev) => {
      if (areAllTestCasesFromModuleChecked) {
        return prev.filter((tcId) => !testCasesFromModule.includes(tcId));
      }
      const combinedArr = [...prev, ...testCasesFromModule];
      const uniqueArr = new Set(combinedArr);

      return Array.from(uniqueArr);
    });
  }

  function handleGlobalChecked() {
    const testCaseIds = testCases.map((tc: any) => tc.id);

    const areAllTestCasesChecked = testCaseIds.every((tcId: number) =>
      checkedTestCases.includes(tcId),
    );

    const checkedTestCasesBeyondVisible = checkedTestCases.filter(
      (tc) => !testCaseIds.includes(tc),
    );

    setCheckedTestCases((prev) => {
      if (areAllTestCasesChecked) {
        return checkedTestCasesBeyondVisible;
      }

      const combinedArr = [...prev, ...testCaseIds];
      const uniqueArr = new Set(combinedArr);

      return Array.from(uniqueArr);
    });
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

  function handleCopy() {
    setIsCopy(true);
    setIsEditing(true);
  }

  function handleToggleDropdown() {
    setIsDropdownOpen((prev) => !prev);
  }

  function handleClickOutside() {
    setIsDropdownOpen(false);
  }

  useOnClickOutside(ref, handleClickOutside);

  return (
    <div>
      <SidebarHeader
        title="Test cases"
        type="testCases"
        onClick={showCreateTestCaseModal}
        ref={ref}
        onToggleDropdown={handleToggleDropdown}
        isActiveDropdown={isDropdownOpen}
        checkedElements={checkedTestCases}
        dropdownOptions={[
          {
            label: "Delete",
            onClick: async () => {
              try {
                await deleteTestCases();
                refresh();
                setCheckedTestCases([]);
                setIsDropdownOpen(false);
              } catch (error) {
                console.error(error);
              }
            },
          },
          {
            label: "Change module",
            onClick: () => console.log("change module"),
          },
        ]}
      />

      <div className={styles.listHeader}>
        <label htmlFor="">
          <input
            type="checkbox"
            name=""
            id=""
            checked={
              testCases && testCases.length > 0
                ? testCases.every((tc: any) => checkedTestCases.includes(tc.id))
                : false
            }
            onChange={handleGlobalChecked}
          />
        </label>
        <div>Test Case Name</div>
        <div>Last Result</div>
        <div>Execution</div>
        <div>Last Execution Date</div>
      </div>

      <div className={styles.list}>
        {!moduleId &&
          !isLoading &&
          modules?.map((module: any) => {
            const hasModuleTestCases = testCases.some(
              (tc: any) => tc.module_id === module.id,
            );

            return (
              hasModuleTestCases && (
                <div key={module.id}>
                  <div className={styles.moduleHeader}>
                    <label htmlFor={`check-${module.id}`}>
                      <input
                        type="checkbox"
                        name=""
                        id={`check-${module.id}`}
                        checked={
                          isLoading
                            ? false
                            : testCases && testCases.length > 0
                              ? testCases
                                  .filter(
                                    (tc: any) => tc.module_id === module.id,
                                  )
                                  .every((tc: any) =>
                                    checkedTestCases.includes(tc.id),
                                  )
                              : false
                        }
                        onChange={() => handleModuleChecked(module.id)}
                      />
                    </label>
                    <div>MODULE: {module.name}</div>
                  </div>
                  {testCases
                    ?.filter(
                      (testCase: any) => testCase.module_id === module.id,
                    )
                    .map((filtered: any) => (
                      <Link
                        to={`/project/${projectId}/testCase/${filtered.id}`}
                        className={styles.testCaseLink}
                      >
                        <div
                          className={styles.listItem}
                          onClick={() => showViewTestCaseModal(filtered.id)}
                        >
                          <label
                            htmlFor="testCaseCheck"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              name="testCaseCheck"
                              id={`check-${filtered.id}`}
                              checked={checkedTestCases.includes(filtered.id)}
                              onChange={(e) =>
                                handleCheckboxClick(e, filtered.id)
                              }
                            />
                          </label>

                          <div>{filtered.name}</div>
                          <div
                            className={clsx(
                              styles.status,
                              styles[
                                testCaseStatusCss[
                                  filtered.status as keyof typeof testCaseStatusCss
                                ] as any
                              ],
                            )}
                          >
                            {filtered.status}
                          </div>
                          <div
                            className={clsx(
                              styles.execution,
                              styles[
                                testCaseExecutionCss[
                                  filtered.execution as keyof typeof testCaseExecutionCss
                                ] as any
                              ],
                            )}
                          >
                            {filtered.execution}
                          </div>
                          <div>2026-04-12</div>
                        </div>
                      </Link>
                    ))}
                </div>
              )
            );
          })}

        {moduleId && (
          <div className={styles.list}>
            {testCases?.map((testCase: any) => (
              <Link
                to={`/project/${projectId}/module/${moduleId}/testCase/${testCase.id}`}
                className={styles.testCaseLink}
              >
                <div
                  key={testCase.id}
                  className={styles.listItem}
                  onClick={() => showViewTestCaseModal(testCase.id)}
                >
                  <label
                    htmlFor={`check-${testCase.id}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      name="testCaseCheck"
                      checked={checkedTestCases.includes(testCase.id)}
                      id={`check-${testCase.id}`}
                      onChange={(e) => handleCheckboxClick(e, testCase.id)}
                    />
                  </label>

                  <div>{testCase.name}</div>

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
                  <div>2026-04-10</div>
                </div>
              </Link>
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
          onCopy={handleCopy}
        />
      )}
    </div>
  );
}
