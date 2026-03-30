import styles from "./TestCaseItem.module.css";

interface TestCaseItemProps {
  name: string;
}

export default function TestCaseItem({ name }: TestCaseItemProps) {
  return (
    <div className={styles.item}>
      <div>{name}</div>
    </div>
  );
}
