import SidebarHeader from "../SidebarHeader/SidebarHeader";
import styles from "./Sidebar.module.css";
import Modal from "../../Modal components/Modal/Modal";
import SidebarItem from "../SidebarItem/SidebarItem";
import { useParams } from "react-router-dom";
import { useFetchItems } from "../../../hooks/useFetchItems";
import { useEffect, useMemo, useState } from "react";

interface SidebarProps {
  type: "projects" | "modules";
}

export default function Sidebar({ type }: SidebarProps) {
  const { projectId, moduleId } = useParams();

  const { data, refresh } = useFetchItems(
    type === "projects" ? "projects" : "modules",
    "view",
  );

  const { data: fetchedTestCases, refresh: refreshTestCaseCounter } =
    useFetchItems("test_cases", "view", undefined, "all");

  const [testCases, setTestCases] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setTestCases(fetchedTestCases);
  }, [fetchedTestCases]);

  console.log(fetchedTestCases);

  const projectFields = [
    { name: "name", label: "Project Name", placeholder: "Enter project name" },
    {
      name: "description",
      label: "Description",
      placeholder: "Enter project description (optional)",
    },
    {
      name: "link",
      label: "Link",
      placeholder: "https://example.com (optional)",
    },
  ];

  const moduleFields = [
    { name: "name", label: "Module Name", placeholder: "Enter name" },
    { name: "description", label: "Description", placeholder: "Enter desc" },
  ];

  // function countTestCases(id: number, isProject: boolean) {
  //   if (isProject) {
  //     return testCases?.filter((tc: any) => tc.project_id === id).length;
  //   } else {
  //     return testCases?.filter((tc: any) => tc.module_id === id).length;
  //   }
  // }

  const countTestCases = useMemo(() => {
    return (id: number, isProject: boolean) => {
      if (!testCases) return 0;

      if (isProject) {
        return testCases.filter((tc: any) => tc.project_id === id).length;
      } else {
        return testCases.filter((tc: any) => tc.module_id === id).length;
      }
    };
  }, [testCases]);

  return (
    <aside className={styles.sidebar}>
      {isModalOpen && (
        <Modal
          type={type}
          title={type === "projects" ? "New project" : "New module"}
          onSuccess={() => {
            refresh();
            refreshTestCaseCounter();
          }}
          subtitle={
            type === "projects"
              ? "Create a new project to organize your test cases."
              : "Create a new module to organize test cases."
          }
          onCancel={() => setIsModalOpen(false)}
          fields={type === "projects" ? projectFields : moduleFields}
          viewMode="create"
        />
      )}
      <SidebarHeader
        title={type === "projects" ? "Projects" : "Modules"}
        onClick={() => setIsModalOpen(true)}
      />
      <ul className={styles.elements}>
        {data?.map((item: any) => {
          const isProjectType = type === "projects";

          const testCaseCounter = countTestCases(item.id, isProjectType);

          return (
            <li key={item.id}>
              <SidebarItem
                projectId={isProjectType ? item.id : Number(projectId)}
                moduleId={isProjectType ? undefined : item.id}
                type={type}
                isSelected={
                  item.id.toString() === (isProjectType ? projectId : moduleId)
                }
                counter={testCaseCounter}
              >
                {item.name}
              </SidebarItem>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
