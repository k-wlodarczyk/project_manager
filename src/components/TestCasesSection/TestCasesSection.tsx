import { useEffect, useState } from "react";
import SidebarHeader from "../Sidebar components/SidebarHeader/SidebarHeader";
import Modal from "../Modal components/Modal/Modal";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useFetchItems } from "../../hooks/useFetchItems";
import TestCaseItem from "../TestCaseItem/TestCaseItem";
import styles from "./TestCasesSection.module.css";

export default function TestCaseSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<
    number | undefined
  >(undefined);

  const { projectId, moduleId } = useParams();

  const { data: testCases, refresh } = useFetchItems("test_cases", "view");
  const { data: modules } = useFetchItems("modules", "view");

  const modalMode = selectedTestCaseId ? "view" : "create";

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
  ];

  return (
    <div>
      <SidebarHeader title="Test cases" onClick={showCreateTestCaseModal} />

      <ul>
        {testCases?.map((testCase: any) => (
          <li key={testCase.id}>
            <TestCaseItem
              id={testCase.id}
              name={testCase.name}
              onClick={showViewTestCaseModal}
            />
          </li>
        ))}
      </ul>

      {isModalOpen && (
        <Modal
          type="testCases"
          title="New test case"
          subtitle="Add test case"
          onCancel={handleCloseModal}
          onSuccess={refresh}
          fields={testCaseFields}
          objectId={selectedTestCaseId}
          viewMode={modalMode}
        />
      )}
    </div>
  );
}
