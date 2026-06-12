import styles from "./TestCasesListModuleHeader.module.scss";

interface TestCasesListModuleHeaderProps {
  moduleId: string;
  moduleName: string;
  onModuleChecked: (moduleId: number) => void;
  moduleTestCases: any;
  checkedTestCases: number[];
}

export default function TestCasesModuleHeader({
  moduleId,
  moduleName,
  onModuleChecked,
  moduleTestCases,
  checkedTestCases,
}: TestCasesListModuleHeaderProps) {
  const shouldBeChecked = () => {
    return moduleTestCases.every((tc: any) => checkedTestCases.includes(tc.id));
  };

  return (
    <div key={moduleId} className={styles.moduleHeader}>
      <label htmlFor={`check-${moduleId}`}>
        <input
          type="checkbox"
          name="check-${moduleId}"
          id={`check-${moduleId}`}
          checked={shouldBeChecked()}
          onChange={() => onModuleChecked(+moduleId)}
        />
      </label>
      <div className={styles.moduleName}>MODULE: {moduleName}</div>
    </div>
  );
}
