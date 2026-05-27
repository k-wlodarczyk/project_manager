import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { useNavigate, useParams } from "react-router-dom";
import { useFetchItems } from "../../hooks/useFetchItems";
import styles from "./Header.module.css";
import { useEffect, useState } from "react";

interface HeaderProps {
  children: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
  const navigate = useNavigate();
  const { data: projects, isLoading } = useFetchItems("projects", "view");
  const { projectId } = useParams();
  const [selectedProjectId, setSelectedProjectId] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    if (projectId) {
      setSelectedProjectId(projectId);
    }
  }, [projectId]);

  const handleProjectChange = (projectId: string) => {
    setSelectedProjectId(projectId);
    if (projectId) {
      navigate(`/project/${projectId}`);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.projectSection}>
        <p>PROJECT: </p>
        <Select.Root
          onValueChange={handleProjectChange}
          value={selectedProjectId || ""}
        >
          <Select.Trigger className={styles.selectTrigger}>
            <Select.Value placeholder="Select project..." />
            <Select.Icon className="SelectIcon">
              <ChevronDownIcon />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content position="popper" sideOffset={4}>
              <Select.ScrollUpButton />
              <Select.Viewport className={styles.selectViewport}>
                {projects?.map((project: any) => (
                  <Select.Item
                    key={project.id}
                    value={project.id.toString()}
                    className={styles.selectItem}
                  >
                    <Select.ItemText>{project.name}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>

      <h1>{children}</h1>
    </header>
  );
}
