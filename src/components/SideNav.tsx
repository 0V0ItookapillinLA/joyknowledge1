import { Link, useLocation } from "react-router-dom";
import { Home, Users, User, Sparkles, Search, BookOpen } from "lucide-react";
import { NAV_ITEMS } from "@/data/mockData";

const iconMap: Record<string, React.ReactNode> = {
  Home: <Home className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  User: <User className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
};

const SideNav = () => {
  const location = useLocation();

  return (
    <aside className="w-56 shrink-0 bg-sidebar border-r border-sidebar-border h-screen sticky top-0 flex flex-col">
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary" />
          <span className="font-display font-bold text-lg text-foreground">知识平台</span>
        </div>
      </div>

      <div className="p-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-muted-foreground text-sm">
          <Search className="w-4 h-4" />
          <span>搜索知识案例...</span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
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
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium ai-gradient-bg text-primary-foreground justify-center"
        >
          <Sparkles className="w-4 h-4" />
          AI 知识萃取
        </Link>
      </div>
    </aside>
  );
};

export default SideNav;
