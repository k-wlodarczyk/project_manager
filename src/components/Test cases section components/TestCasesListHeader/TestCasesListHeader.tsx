import styles from "./TestCasesListHeader.module.scss";

interface TestCasesListHeaderProps {
  testCases: any;
  checkedTestCases: number[];
  activeModuleId?: string;
  onGlobalChecked: () => void;
}

export default function TestCasesListHeader({
  testCases,
  checkedTestCases,
  activeModuleId,
  onGlobalChecked,
}: TestCasesListHeaderProps) {
  const shouldBeChecked = () => {
    testCases = activeModuleId
      ? testCases.filter((tc: any) => tc.id === +activeModuleId)
      : testCases;

    return (
      testCases &&
      checkedTestCases.length > 0 &&
      testCases.every((tc: any) => checkedTestCases.includes(tc.id))
    );
  };

  return (
    <div className={styles.listHeader}>
      <label htmlFor="">
        <input
          type="checkbox"
          name=""
          id=""
          checked={shouldBeChecked()}
          onChange={onGlobalChecked}
        />
      </label>
      <div>Test Case Name</div>
      <div>Last Result</div>
      <div>Execution</div>
      <div>Last Execution Date</div>
    </div>
  );
}
