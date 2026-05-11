import styles from "./TestCaseItem.module.css";

interface TestCaseItemProps {
  id: number;
  name: string;
  onClick: (id: number) => void;
}

export default function TestCaseItem({ id, name, onClick }: TestCaseItemProps) {
  return (
    <div className={styles.item} onClick={() => onClick(id)}>
      <div>{name}</div>
    </div>
  );
}
