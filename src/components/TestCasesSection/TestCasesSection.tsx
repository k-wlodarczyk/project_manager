import { useEffect, useState } from "react";
import SidebarHeader from "../Sidebar components/SidebarHeader/SidebarHeader";
import Modal from "../Modal components/Modal/Modal";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";

export default function TestCaseSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modules, setModules] = useState<{ id: number; title: string }[]>([]);

  const { projectId, moduleId } = useParams();

  useEffect(() => {
    async function fetchModules() {
      if (!projectId) return;

      const { data } = await supabase
        .from("modules")
        .select("id, title")
        .eq("project_id", projectId);

      if (data) {
        setModules(data);
      }
    }
    fetchModules();
  }, [projectId]);

  const foundModule = modules.find((m) => String(m.id) === String(moduleId));

  const title = foundModule ? foundModule.title : "Nie znaleziono modułu";

  const testCaseFields = [
    {
      name: "moduleId",
      label: "Module",
      type: "select",

      options: modules.map((module) => ({
        value: module.id,
        label: module.title,
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
      <SidebarHeader title="Test cases" onClick={() => setIsModalOpen(true)} />

      {isModalOpen && (
        <Modal
          type="testCases"
          title="New test case"
          subtitle="Add test case"
          onCancel={() => setIsModalOpen(false)}
          onSuccess={() => setIsModalOpen(false)}
          fields={testCaseFields}
        />
      )}
    </div>
  );
}
