import styles from "./Header.module.css";

interface HeaderProps {
  children: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
  return (
    <header>
      <h1 className={styles.header}>{children}</h1>
    </header>
  );
}
