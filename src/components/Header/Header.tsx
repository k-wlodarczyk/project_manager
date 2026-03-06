interface HeaderProps {
  children: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
  return (
    <header>
      <h1>{children}</h1>
    </header>
  );
}
