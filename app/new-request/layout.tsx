import './layout.css';

import { Suspense } from 'react';

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
        <aside className="sidebar">
          <Suspense fallback={<div>111111111111111111111</div>}>
            {sidebar}
          </Suspense>
        </aside>
        <main className="main">{children}</main>
      </div>
    </div>
  );
}
