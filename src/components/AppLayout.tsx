import { ReactNode } from "react";
import TopNav from "./TopNav";

interface AppLayoutProps {
  children: ReactNode;
  hideNav?: boolean;
}

const AppLayout = ({ children, hideNav }: AppLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {!hideNav && <TopNav />}
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
