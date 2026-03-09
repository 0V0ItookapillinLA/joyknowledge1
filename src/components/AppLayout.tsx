import { ReactNode } from "react";
import SideNav from "./SideNav";
import AIBar from "./AIBar";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="flex min-h-screen">
      <SideNav />
      <main className="flex-1 min-w-0">
        {children}
      </main>
      <AIBar />
    </div>
  );
};

export default AppLayout;
