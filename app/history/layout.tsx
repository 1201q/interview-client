import './layout.css';

export default async function Layout({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <div className="container">
      <div className="wrapper">
        <aside className="sidebar">{sidebar}</aside>
        <main className="main">{children}</main>
      </div>
    </div>
  );
}
