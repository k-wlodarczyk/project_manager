import { useNavigate, useParams } from "react-router-dom";
import { useFetchItems } from "../../hooks/useFetchItems";
import styles from "./Header.module.css";
import { useEffect, useState } from "react";
import SelectField from "../common/Select/SelectField";

interface HeaderProps {
  children: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
  const navigate = useNavigate();
  const { data: teams } = useFetchItems("teams", "view");
  const { data: projects } = useFetchItems("projects", "view");
  const { projectSlug, teamSlug } = useParams();
  const [selectedTeam, setSelectedTeam] = useState<string | undefined>(
    undefined,
  );
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    setSelectedProjectSlug(projectSlug || undefined);

    if (teamSlug) {
      setSelectedTeam(teamSlug);
    }
  }, [teamSlug, projectSlug]);

  const handleProjectChange = (projectId: string) => {
    const projectSlug = projects.find(
      (project: any) => project.id === +projectId,
    ).slug;
    setSelectedProjectSlug(projectSlug || undefined);

    navigate(`/team/${selectedTeam}/project/${projectSlug}`);
  };

  const handleTeamChange = (teamId: string) => {
    const teamSlug = teams.find((team: any) => team.id === +teamId).slug;

    if (teamSlug === selectedTeam) {
      return;
    }
    setSelectedTeam(teamSlug || undefined);
    setSelectedProjectSlug(undefined);

    navigate(`/team/${teamSlug}`);
  };

  return (
    <header className={styles.header}>
      <div className={styles.projectSection}>
        <div className={styles.teamField}>
          <p>TEAM: </p>
          <SelectField
            placeholder="Select team..."
            options={teams?.map((team: any) => ({
              label: team.name,
              value: team.id,
            }))}
            onSelect={handleTeamChange}
            value={selectedTeam}
          />
        </div>
        <div>|</div>
        <div className={styles.projectField}>
          <p>PROJECT: </p>
          <SelectField
            placeholder="Select project..."
            options={projects?.map((project: any) => ({
              label: project.name,
              value: project.id,
            }))}
            onSelect={handleProjectChange}
            value={
              projects?.find(
                (project: any) => project.slug === selectedProjectSlug,
              )?.name
            }
          />
        </div>
      </div>

      <h1>{children}</h1>
    </header>
  );
}
