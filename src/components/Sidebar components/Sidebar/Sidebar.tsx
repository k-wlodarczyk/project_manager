import { useEffect, useState } from "react";
import { projects, modules } from "../../../data";
import SidebarHeader from "../SidebarHeader/SidebarHeader";
import styles from "./Sidebar.module.css";
import Modal from "../../Modal components/Modal/Modal";
import { supabase } from "../../../supabaseClient";
import SidebarItem from "../SidebarItem/SidebarItem";
import clsx from "clsx";
import { Link, useParams } from "react-router-dom";

interface SidebarProps {
  type: "projects" | "modules";
}

export default function Sidebar({ type }: SidebarProps) {
  let items;
  let sidebarHeaderName;

  const { projectId, moduleId } = useParams();

  if (type === "projects") {
    items = projects;
    sidebarHeaderName = "Projects";
  } else {
    items = modules;
    sidebarHeaderName = "Modules";
  }

  const [itemss, setItemss] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const fetchProjects = async () => {
    const { data, error } = await supabase.from("projects").select("id, title");

    if (error) {
      console.error("Error: ", error.message);
    } else {
      setItemss(data || []);
    }
  };

  const fetchModules = async () => {
    const { data, error } = await supabase
      .from("modules")
      .select("id, title")
      .eq("project_id", projectId);

    if (error) {
      console.log("Error modules: ", error.message);
    } else {
      console.log("fetching modules");
      setItemss(data || []);
    }
  };

  useEffect(() => {
    if (type === "projects") {
      fetchProjects();
    } else {
      projectId && fetchModules();
    }
  }, [type, projectId]);

  function handleSelect(id: number) {
    const selectedItem = itemss.find((item) => item.id === id);
    const selectedItemId = selectedItem?.id;
    setSelectedProjectId(selectedItemId);
  }

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
          onSuccess={(newItem) => setItemss((prev) => [newItem, ...prev])}
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
        title={sidebarHeaderName}
        onClick={() => setIsModalOpen(true)}
      />
      <ul className={styles.elements}>
        {itemss.map((item) => {
          const isProjectType = type === "projects";

          return (
            <li key={item.id}>
              <SidebarItem
                projectId={isProjectType ? item.id : Number(projectId)}
                moduleId={isProjectType ? undefined : item.id}
                type={type}
                onClick={() => handleSelect(item.id)}
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
