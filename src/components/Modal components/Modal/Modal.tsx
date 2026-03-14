import { createPortal } from "react-dom";
import styles from "./Modal.module.css";
import { useHotkeys } from "react-hotkeys-hook";
import ModalField from "../ModalField/ModalField";
import ModalBtn from "../ModalBtn/ModalBtn";
import { useState } from "react";
import { supabase } from "../../../supabaseClient";
import { useParams } from "react-router-dom";

interface FieldConfig {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
}

interface ModalProps {
  type: "projects" | "modules";
  onCancel: () => void;
  onSuccess: (newItem: any) => void;
  fields: FieldConfig[];
  title: string;
  subtitle?: string;
}

export default function Modal({
  type,
  onCancel,
  onSuccess,
  fields,
  title,
  subtitle,
}: ModalProps) {
  useHotkeys("esc", onCancel, { enableOnFormTags: true });

  const { projectId } = useParams();

  const [formData, setFormData] = useState<Record<string, string>>(() => {
    return fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {});
  });

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name) return alert("Project name is required");

    const { data, error } = await supabase.from("projects").insert([
      {
        title: formData.name,
        description: formData.description,
        url: formData.link,
      },
    ]);

    if (error) {
      console.log(error.message);
    } else {
      console.log("Success", data);
      onCancel();
    }
  };

  const handleSubmitModules = async () => {
    const { data, error } = await supabase
      .from("modules")
      .insert([
        {
          title: formData.name,
          description: formData.description,
          project_id: projectId,
        },
      ])
      .select();

    if (error) {
      console.log(error.message);
    } else {
      onSuccess(data[0]);
      onCancel();
    }
  };

  return createPortal(
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onCancel}>
          &times;
        </button>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
        <div className={styles.modalFields}>
          {fields.map((field) => {
            return (
              <ModalField
                key={field.name}
                label={field.label}
                placeholder={field.placeholder}
                type={field.type || "text"}
                value={formData[field.name]}
                onChange={(e: any) => handleChange(field.name, e.target.value)}
              />
            );
          })}
        </div>
        <div className={styles.modalBtns}>
          <ModalBtn type="secondary" onClick={onCancel}>
            Cancel
          </ModalBtn>
          <ModalBtn
            type="cta"
            onClick={type === "projects" ? handleSubmit : handleSubmitModules}
          >
            Submit
          </ModalBtn>
        </div>
      </div>
    </div>,
    document.body,
  );
}
