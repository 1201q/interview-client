import SharedHeader from '@/components/new/Header';
import './layout.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container">
      <header className="header">
        <SharedHeader />
      </header>
      <div className="wrapper">{children}</div>
    </div>
  );
}
