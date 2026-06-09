import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import Modal from "../Modal components/Modal/Modal";
import { useParams } from "react-router-dom";
import { useFetchItems } from "../../hooks/useFetchItems";
import styles from "./TestCasesSection.module.css";
import { useTestCases } from "../../hooks/useTestCases";
import { useOnClickOutside } from "usehooks-ts";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import Popup from "../Popup/Popup";
import TestCasesModulesSection from "../TestCasesModulesSection/TestCasesModulesSection";
import { useModalSubmit } from "../../hooks/useModalSubmit";
import Actionbar from "../Actionbar/Actionbar";

type PopupAction =
  | "newModule"
  | "editModule"
  | "deleteModule"
  | "deleteTestCases"
  | "changeTestCaseStatus";

type PopupField = {
  name: string;
  label: string;
  id?: string;
  type: "input" | "select";
  placeholder?: string;
  options?: any[];
  badge?: boolean;
  styleTarget?: "container" | "text";
};

interface PopupSetting {
  title: string;
  subtitle: string | ((param: string | number) => ReactNode);
  confirmLabel: string;
  cancelLabel: string;
  type: "edit" | "confirmDelete";
  fields?: PopupField[];
}

const POPUP_CONFIG: Record<PopupAction, PopupSetting> = {
  newModule: {
    title: "New Module",
    subtitle: "",
    confirmLabel: "Create",
    cancelLabel: "Cancel",
    type: "edit",
    fields: [
      {
        label: "Module Name",
        type: "input",
        name: "moduleName",
        id: "moduleName",
        placeholder: "Insert new module name...",
      },
    ],
  },

  editModule: {
    title: "Edit Module",
    subtitle: "",
    confirmLabel: "Save",
    cancelLabel: "Cancel",
    type: "edit",
    fields: [
      {
        label: "Module Name",
        type: "input",
        name: "moduleName",
        id: "moduleName",
        placeholder: "Insert new module name...",
      },
    ],
  },
  deleteModule: {
    title: "Delete module",
    subtitle: (moduleName: string | number) => (
      <>
        Are you sure you want to delete module <strong>{moduleName}</strong>?
        This action cannot be undone.
      </>
    ),
    confirmLabel: "Yes, delete",
    cancelLabel: "Cancel",
    type: "confirmDelete",
  },
  deleteTestCases: {
    title: "Delete test cases",
    subtitle: (checkedTestCasesCounter: string | number) => (
      <>
        Are you sure you want to delete{" "}
        <strong>{checkedTestCasesCounter}</strong> test cases? This action
        cannot be undone.
      </>
    ),
    confirmLabel: "Yes, delete",
    cancelLabel: "Cancel",
    type: "confirmDelete",
  },
  changeTestCaseStatus: {
    title: "Edit Test cases status",
    subtitle: "",
    confirmLabel: "Save",
    cancelLabel: "Cancel",
    type: "edit",
    fields: [
      {
        label: "Status",
        type: "select",
        name: "status",
        id: "status",
        options: [
          { label: "To Do", value: "Todo" },
          { label: "Passed", value: "Passed" },
          { label: "Failed", value: "Failed" },
          { label: "Skipped", value: "Skipped" },
        ],
        badge: true,
        placeholder: "Select new status...",
        styleTarget: "container",
      },
    ],
  },
};

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
  const [_isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<
    number | undefined
  >(undefined);
  const [selectedModuleId, setSelectedModuleId] = useState<number | undefined>(
    undefined,
  );
  const [popupModuleName, setPopupModuleName] = useState<string | undefined>(
    undefined,
  );
  const [popupModuleId, setPopupModuleId] = useState<number>(-1);
  const [popupAction, setPopupAction] = useState<
    | "newModule"
    | "deleteModule"
    | "deleteTestCases"
    | "editModule"
    | "changeTestCaseStatus"
  >("deleteModule");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isCopy, setIsCopy] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"testCases" | "modules">(
    "testCases",
  );
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [selectedDropdownOption, setSelectedDropdownOption] = useState<
    undefined | "changeTestCaseStatus" | "changeModule" | "deleteTestCases"
  >(undefined);
  const [checkedTestCases, setCheckedTestCases] = useState<number[]>([]);

  const navigate = useNavigate();
  const { projectId, moduleId, testcaseId } = useParams();

  const ref = useRef<any>(null);

  useEffect(() => {
    setCheckedTestCases([]);
  }, [projectId, moduleId]);

  useEffect(() => {
    if (testcaseId) {
      setSelectedTestCaseId(+testcaseId);
      setIsModalOpen(true);
    }
  }, [testcaseId]);

  useEffect(() => {
    if (moduleId) {
      setSelectedModuleId(+moduleId);
    } else {
      setSelectedModuleId(undefined);
    }
  }, [moduleId, projectId]);

  const {
    data: testCases,
    isLoading,
    refresh,
  } = useFetchItems("test_cases", "view", undefined, "all");
  const { data: modules, refresh: refreshModules } = useFetchItems(
    "modules",
    "view",
  );

  const { deleteTestCases, updateTestCasesStatus } =
    useTestCases(checkedTestCases);

  const { submitModules, updateModule, deleteModule } = useModalSubmit({
    onSuccess: refreshModules,
    onCancel: handleClosePopup,
    onCancelEdit: handleClosePopup,
  });

  const modalMode = isEditing
    ? isCopy
      ? "copy"
      : "edit"
    : selectedTestCaseId
      ? "view"
      : "create";

  const { title, subtitle } = MODAL_CONFIG[modalMode];

  useEffect(() => {
    refresh();
  }, [moduleId, refresh]);

  function showViewTestCaseModal(id: number) {
    setSelectedTestCaseId(id);
    setIsModalOpen(true);
  }

  function showCreateTestCaseModal() {
    setModalType("testCases");
    setIsModalOpen(true);
  }

  function showCreateModuleModal() {
    setModalType("modules");
    setPopupAction("newModule");
    setIsPopupOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setSelectedTestCaseId(undefined);
    setIsEditing(false);
    setIsCopy(false);
    setModalType("testCases");
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

  function handleSelectModule(id: number | undefined) {
    setSelectedModuleId(id);

    if (id !== undefined) {
      navigate(`/project/${projectId}/module/${id}`);
    } else {
      navigate(`/project/${projectId}`);
    }
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

  const orderedTestCases: any[] = [];

  const shouldRenderList = !moduleId && !isLoading && modules && testCases;

  if (moduleId && testCases) {
    const moduleTestCases = testCases.filter(
      (tc: any) => +tc.module_id === +moduleId,
    );
    orderedTestCases.push(...moduleTestCases);
  }

  if (shouldRenderList) {
    modules.forEach((module: any) => {
      const moduleTestCases = testCases.filter(
        (tc: any) => tc.module_id === module.id,
      );

      if (moduleTestCases.length > 0) {
        orderedTestCases.push(...moduleTestCases);
      }
    });
  }

  function handleGlobalChecked() {
    const testCaseIds = orderedTestCases.map((tc: any) => tc.id);

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
      asideForm: true,
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
      badge: true,
    },
    {
      name: "status",
      label: "Status",
      hideInFormRows: true,
      badge: true,
    },
  ];

  function handleCopy() {
    setIsCopy(true);
    setIsEditing(true);
  }

  function handleModuleAction(
    moduleName?: string,
    moduleId?: number,
    popupAction?: "editModule" | "deleteModule",
  ) {
    setIsPopupOpen(true);
    setPopupModuleName(moduleName || "undefined module name");
    setPopupModuleId(moduleId || -1);
    if (popupAction) {
      setPopupAction(popupAction);
    }
  }

  function handleClickOutside() {
    setIsDropdownOpen(false);
  }

  function handleSelectDropdownOption(
    option: "changeTestCaseStatus" | "deleteTestCases",
  ) {
    setSelectedDropdownOption(option);
    setPopupAction(option);
    setIsPopupOpen(true);
  }

  async function handleSubmitPopup(selectedOption?: any, formData?: any) {
    if (selectedDropdownOption === "changeTestCaseStatus") {
      if (selectedOption === "Todo") {
        selectedOption = "To Do";
      }
      await updateTestCasesStatus(selectedOption);
      refresh();
    } else if (selectedDropdownOption === "deleteTestCases") {
      await deleteTestCases();
      refresh();
    } else if (popupAction === "deleteModule") {
      await deleteModule(popupModuleId);
    } else if (popupAction === "editModule") {
      await updateModule(formData, popupModuleId);
    } else if (popupAction === "newModule") {
      await submitModules(formData);
    }

    setPopupModuleName(undefined);
    setSelectedDropdownOption(undefined);
    setIsPopupOpen(false);
    setCheckedTestCases([]);
    setModalType("testCases");
  }

  function handleClosePopup() {
    setSelectedDropdownOption(undefined);
    setIsPopupOpen(false);
    setPopupModuleName(undefined);
    setModalType("testCases");
  }

  function showNextPreviousTestCase() {
    const getIndexOfArray = orderedTestCases?.findIndex(
      (tc: any) => tc.id == selectedTestCaseId,
    );

    const previousEnabled = getIndexOfArray > 0;
    const nextEnabled = getIndexOfArray < orderedTestCases?.length - 1;

    return { previousEnabled, nextEnabled };
  }

  function handleNextTestCase() {
    const getIndexOfArray = orderedTestCases?.findIndex(
      (tc: any) => tc.id == selectedTestCaseId,
    );

    if (
      getIndexOfArray === -1 ||
      getIndexOfArray >= orderedTestCases.length - 1
    ) {
      return;
    }

    const nextTestCaseIndex = getIndexOfArray + 1;
    const testCaseId = orderedTestCases[nextTestCaseIndex].id;
    setSelectedTestCaseId(testCaseId);
    if (moduleId) {
      navigate(
        `/project/${projectId}/module/${moduleId}/testCase/${testCaseId}`,
      );
    } else {
      navigate(`/project/${projectId}/testCase/${testCaseId}`);
    }
  }

  function handlePreviousTestCase() {
    const getIndexOfArray = orderedTestCases?.findIndex(
      (tc: any) => tc.id == selectedTestCaseId,
    );
    if (getIndexOfArray <= 0) return;

    const previousTestCaseIndex = getIndexOfArray - 1;
    const testCaseId = orderedTestCases[previousTestCaseIndex].id;
    setSelectedTestCaseId(testCaseId);
    if (moduleId) {
      navigate(
        `/project/${projectId}/module/${moduleId}/testCase/${testCaseId}`,
      );
    } else {
      navigate(`/project/${projectId}/testCase/${testCaseId}`);
    }
  }

  useOnClickOutside(ref, handleClickOutside);

  return (
    <div className={styles.testCasesSection}>
      <TestCasesModulesSection
        modules={modules}
        testCases={testCases}
        onClick={handleSelectModule}
        projectId={projectId}
        selectedModuleId={selectedModuleId}
        onModuleActionSelect={handleModuleAction}
      />
      {
        <Actionbar
          onNewTestClick={showCreateTestCaseModal}
          onNewModuleClick={showCreateModuleModal}
          onDropdownOption={handleSelectDropdownOption}
          checkedTestCasesCounter={checkedTestCases.length}
        />
      }

      <div className={styles.list}>
        <div className={styles.listHeader}>
          <label htmlFor="">
            <input
              type="checkbox"
              name=""
              id=""
              checked={
                testCases && orderedTestCases.length > 0
                  ? orderedTestCases.every((tc: any) =>
                      checkedTestCases.includes(tc.id),
                    )
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
                    <div className={styles.moduleName}>
                      MODULE: {module.name}
                    </div>
                  </div>
                  {testCases
                    ?.filter(
                      (testCase: any) => testCase.module_id === module.id,
                    )
                    .map((filtered: any) => (
                      <Link
                        to={`/project/${projectId}/testCase/${filtered.id}`}
                        className={clsx(styles.testCaseLink)}
                      >
                        <div
                          className={clsx(
                            styles.listItem,
                            isModalOpen &&
                              selectedTestCaseId === filtered.id &&
                              styles.selectedItem,
                          )}
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

                          <div className={styles.testCaseName}>
                            {filtered.name}
                          </div>
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
          <div>
            {testCases
              ?.filter((testCase: any) => {
                const matchProject = projectId
                  ? testCase.project_id === +projectId
                  : true;

                const matchModule = testCase.module_id === +moduleId;

                return matchProject && matchModule;
              })
              .map((testCase: any) => (
                <Link
                  key={testCase.id}
                  to={`/project/${projectId}/module/${moduleId}/testCase/${testCase.id}`}
                  className={clsx(
                    styles.testCaseLink,
                    isModalOpen &&
                      selectedTestCaseId === testCase.id &&
                      styles.selectedItem,
                  )}
                >
                  <div
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
                    <div>2026-04-10</div>
                  </div>
                </Link>
              ))}
          </div>
        )}
      </div>

      {isModalOpen && modalType === "testCases" && (
        <Modal
          type={modalType}
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
          navigationEnabled={showNextPreviousTestCase()}
          onNextTestCase={handleNextTestCase}
          onPreviousTestCase={handlePreviousTestCase}
        />
      )}

      {isModalOpen && isPopupOpen && modalType === "modules" && (
        <Popup
          action={"editModule"}
          config={POPUP_CONFIG["newModule"]}
          onCancel={handleClosePopup}
          onSubmit={handleSubmitPopup}
          type={POPUP_CONFIG[popupAction].type}
        />
      )}

      {isPopupOpen && (
        <Popup
          moduleName={popupModuleName}
          action={popupAction}
          config={POPUP_CONFIG[popupAction]}
          onCancel={handleClosePopup}
          onSubmit={handleSubmitPopup}
          type={POPUP_CONFIG[popupAction].type}
          checkedItemsCounter={checkedTestCases.length}
        />
      )}
    </div>
  );
}
