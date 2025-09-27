import { Suspense } from 'react';
import './layout.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container">
      <header className="header"></header>
      <div className="wrapper">{children}</div>
    </div>
  );
}
