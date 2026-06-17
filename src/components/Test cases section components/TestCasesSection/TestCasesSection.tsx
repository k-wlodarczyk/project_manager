import { useEffect, useRef, useState, type ChangeEvent } from "react";
import Modal from "../../Modal components/Modal/Modal";
import { useParams } from "react-router-dom";
import { useFetchItems } from "../../../hooks/useFetchItems";
import styles from "./TestCasesSection.module.css";
import { useTestCases } from "../../../hooks/useTestCases";
import { useOnClickOutside } from "usehooks-ts";
import { useNavigate } from "react-router-dom";

import Popup from "../../Popup/Popup";
import { POPUP_CONFIG } from "./TestCasesSection.popupConfig";
import { MODAL_CONFIG } from "./TestCasesSection.modalConfig";
import TestCasesModulesSection from "../TestCasesModulesSection/TestCasesModulesSection";
import { useModalSubmit } from "../../../hooks/useModalSubmit";
import Actionbar from "../Actionbar/Actionbar";
import TestCasesList from "../TestCasesList/TestCasesList";
import { supabase } from "../../../supabaseClient";

export default function TestCasesSection() {
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
    data: fetchedTestCases,
    isLoading,
    refresh,
  } = useFetchItems("test_cases", "view", undefined, "all");
  const { data: fetchedModules, refresh: refreshModules } = useFetchItems(
    "modules",
    "view",
  );

  const [testCases, setTestCases] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);

  useEffect(() => {
    if (fetchedModules) {
      setModules(fetchedModules);
    }

    if (fetchedTestCases) {
      setTestCases(fetchedTestCases);
    }
  }, [fetchedModules, fetchedTestCases]);

  const { deleteTestCases, updateTestCasesStatus, exportTestCasesToXlsx } =
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

  async function handleModuleReorder(updatedModules: any[]) {
    setModules(updatedModules);

    const payload = updatedModules.map((module: any) => ({
      ...module,
      project_id: Number(projectId),
      order: module.order,
    }));

    const { error } = await supabase
      .from("modules")
      .upsert(payload, { onConflict: "id" });

    if (error) console.error("something went wrong");
  }

  async function handleTestCasesReorder(updatedTestCases: any[]) {
    setTestCases([...updatedTestCases]);

    const payload = updatedTestCases.map((tc: any) => ({
      ...tc,
      project_id: Number(projectId),
      module_id: Number(tc.module_id),
      order_in_module: tc.order_in_module,
    }));

    const { error } = await supabase
      .from("test_cases")
      .upsert(payload, { onConflict: "id" });

    if (error) {
      console.error(
        "something went wrong with test cases reorder:",
        error.message,
      );
    }

    refresh();
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
      placeholder: "Select module",
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
      placeholder: "Select execution type",
    },
    {
      name: "status",
      label: "Status",
      hideInFormRows: true,
      badge: true,
      placeholder: "Select status",
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

  async function handleSelectDropdownOption(
    option: "changeTestCaseStatus" | "deleteTestCases" | "exportXlsx",
  ) {
    if (option === "changeTestCaseStatus" || option === "deleteTestCases") {
      setSelectedDropdownOption(option);
      setPopupAction(option);
      setIsPopupOpen(true);
    } else if (option === "exportXlsx") {
      await exportTestCasesToXlsx();
    }
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
        onModulesReorder={handleModuleReorder}
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
        <TestCasesList
          activeModuleId={moduleId}
          activeProjectId={projectId}
          testCases={testCases}
          checkedTestCases={checkedTestCases}
          onCheckboxChange={handleCheckboxClick}
          onGlobalChecked={handleGlobalChecked}
          onModuleChecked={handleModuleChecked}
          modules={modules}
          onTestCasesReorder={handleTestCasesReorder}
        />
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
