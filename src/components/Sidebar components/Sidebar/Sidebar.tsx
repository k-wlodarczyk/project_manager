import SidebarHeader from "../SidebarHeader/SidebarHeader";
import styles from "./Sidebar.module.css";
import Modal from "../../Modal components/Modal/Modal";
import SidebarItem from "../SidebarItem/SidebarItem";
import { useParams } from "react-router-dom";
import { useFetchItems } from "../../../hooks/useFetchItems";
import { useState } from "react";

interface SidebarProps {
  type: "projects" | "modules";
}

export default function Sidebar({ type }: SidebarProps) {
  const { projectId, moduleId } = useParams();

  const { data, refresh } = useFetchItems(
    type === "projects" ? "projects" : "modules",
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <aside className={styles.sidebar}>
      {isModalOpen && (
        <Modal
          type={type}
          title={type === "projects" ? "New project" : "New module"}
          onSuccess={refresh}
          subtitle={
            type === "projects"
              ? "Create a new project to organize your test cases."
              : "Create a new module to organize test cases."
          }
          onCancel={() => setIsModalOpen(false)}
          fields={type === "projects" ? projectFields : moduleFields}
        />
      )}
      <SidebarHeader
        title={type === "projects" ? "Projects" : "Modules"}
        onClick={() => setIsModalOpen(true)}
      />
      <ul className={styles.elements}>
        {data.map((item) => {
          const isProjectType = type === "projects";

          return (
            <li key={item.id}>
              <SidebarItem
                projectId={isProjectType ? item.id : Number(projectId)}
                moduleId={isProjectType ? undefined : item.id}
                type={type}
                isSelected={
                  item.id.toString() === (isProjectType ? projectId : moduleId)
                }
              >
                {item.title}
              </SidebarItem>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
