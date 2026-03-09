import { Link, useLocation } from "react-router-dom";
import { Home, Users, User, Sparkles, Search, BookOpen } from "lucide-react";
import { NAV_ITEMS } from "@/data/mockData";

const iconMap: Record<string, React.ReactNode> = {
  Home: <Home className="w-[18px] h-[18px]" />,
  Users: <Users className="w-[18px] h-[18px]" />,
  User: <User className="w-[18px] h-[18px]" />,
  Sparkles: <Sparkles className="w-[18px] h-[18px]" />,
};

const SideNav = () => {
  const location = useLocation();

  return (
    <aside className="w-52 shrink-0 bg-sidebar border-r border-sidebar-border h-screen sticky top-0 flex flex-col">
      <div className="px-5 py-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <span className="font-semibold text-base text-foreground">知识平台</span>
        </div>
      </div>

      <div className="p-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-accent text-muted-foreground text-sm cursor-pointer hover:bg-accent/80 transition-colors">
          <Search className="w-4 h-4" />
          <span>搜索...</span>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              {iconMap[item.icon]}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <Link
          to="/extract"
          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground justify-center hover:bg-primary/90 transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          AI 知识萃取
        </Link>
      </div>
    </aside>
  );
};

export default SideNav;
