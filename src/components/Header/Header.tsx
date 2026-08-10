import { useNavigate, useParams } from "react-router-dom";
import { useFetchItems } from "../../hooks/useFetchItems";
import styles from "./Header.module.css";
import SelectField from "../common/Select/SelectField";

interface HeaderProps {
  children: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
  const navigate = useNavigate();
  const { projectSlug, teamSlug } = useParams();

  const { data: teams } = useFetchItems("teams", "view");
  const { data: projects } = useFetchItems("projects", "view");

  const handleProjectChange = (projectId: string) => {
    const projectSlug = projects?.find(
      (project: any) => project.id === +projectId,
    ).slug;

    navigate(`/team/${teamSlug}/project/${projectSlug}`);
  };

  const handleTeamChange = (teamId: string) => {
    const targetTeam = teams?.find((team: any) => team.id === +teamId);

    if (targetTeam.slug === teamSlug) {
      return;
    }

    navigate(`/team/${targetTeam.slug}`);
  };

  const activeProjectName = projects?.find(
    (project: any) => project.slug === projectSlug,
  )?.name;

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
            value={teamSlug}
            triggerTestId="teams-trigger"
            listTestId="teams-list"
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
            value={activeProjectName}
            triggerTestId="projects-trigger"
            listTestId="projects-list"
          />
        </div>
      </div>

      <h1>{children}</h1>
    </header>
  );
}
