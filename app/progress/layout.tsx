import './layout.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container">
      <header className="header">1</header>
      <div className="wrapper">{children}</div>
    </div>
  );
}
