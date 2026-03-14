import styles from "./ModalBtn.module.css";

interface ModalBtnProps {
  type: "cta" | "secondary";
  onClick: () => void;
  children: React.ReactNode;
}

export default function ModalBtn({ type, onClick, children }: ModalBtnProps) {
  return (
    <button className={styles[type]} onClick={onClick}>
      {children}
    </button>
  );
}
