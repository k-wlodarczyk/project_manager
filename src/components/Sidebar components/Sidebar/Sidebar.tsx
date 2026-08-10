import { useState, type ReactNode } from "react";
import styles from "./Sidebar.module.scss";
import Popup from "../../Popup/Popup";
import { useModalSubmit } from "../../../hooks/useModalSubmit";
import { useNavigate, useParams } from "react-router-dom";

type PopupAction = "newProject";

type PopupField = {
  name: string;
  label: string;
  id?: string;
  type: "input" | "select";
  placeholder?: string;
  options?: any[];
};

const POPUP_CONFIG: Record<PopupAction, PopupSetting> = {
  newProject: {
    title: "New Project",
    subtitle: "",
    confirmLabel: "Create",
    cancelLabel: "Cancel",
    type: "create",
    fields: [
      {
        label: "Project Name",
        type: "input",
        name: "projectName",
        id: "projectName",
        placeholder: "Insert new project name...",
      },
    ],
  },
};

interface PopupSetting {
  title: string;
  subtitle: string | ((param: string | number) => ReactNode);
  confirmLabel: string;
  cancelLabel: string;
  type: "edit" | "confirmDelete" | "create";
  fields?: PopupField[];
}

export default function Sidebar() {
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  const { teamSlug } = useParams();
  const navigate = useNavigate();

  const { submitProject } = useModalSubmit({
    onSuccess: (newProjectData: any) => {
      handleClosePopup();

      if (teamSlug && newProjectData?.slug) {
        navigate(`/team/${teamSlug}/project/${newProjectData.slug}`);
      }
    },
    onCancel: handleClosePopup,
    onCancelEdit: handleClosePopup,
  });

  function handleSubmitPopup(_: any, formData: any) {
    submitProject(formData);
  }

  function handleClosePopup() {
    setIsPopupOpen(false);
  }

  return (
    <div className={styles.sidebar}>
      <button
        className={styles.newProjectBtn}
        onClick={() => setIsPopupOpen(true)}
      >
        <span className={styles.spanIcon}>
          <ion-icon name="add-outline"></ion-icon>
        </span>
        new project
      </button>
      {isPopupOpen && (
        <Popup
          action="newProject"
          config={POPUP_CONFIG["newProject"]}
          onSubmit={handleSubmitPopup}
          onCancel={handleClosePopup}
          type={POPUP_CONFIG["newProject"].type}
          dataTestId="project-modal"
        />
      )}
    </div>
  );
}
