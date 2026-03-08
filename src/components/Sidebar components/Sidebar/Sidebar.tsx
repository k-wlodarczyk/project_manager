import { useState } from "react";
import { projects, modules } from "../../../data";
import SidebarHeader from "../SidebarHeader/SidebarHeader";
import styles from "./Sidebar.module.css";
import Modal from "../../Modal components/Modal/Modal";

interface SidebarProps {
  type: "projects" | "modules";
}

export default function Sidebar({ type }: SidebarProps) {
  let items;
  let sidebarHeaderName;

  if (type === "projects") {
    items = projects;
    sidebarHeaderName = "Projects";
  } else {
    items = modules;
    sidebarHeaderName = "Modules";
  }

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <aside className={styles.sidebar}>
      {isModalOpen && <Modal onCancel={() => setIsModalOpen(false)} />}
      <SidebarHeader
        title={sidebarHeaderName}
        onClick={() => setIsModalOpen(true)}
      />
      <ul>
        {items.map((item) => {
          return <li key={item.id}>{item.title}</li>;
        })}
      </ul>
    </aside>
  );
}
