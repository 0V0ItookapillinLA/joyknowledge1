import { Link, useLocation } from "react-router-dom";
import { Search, Sparkles, Bell, Home, Users, User, MessageSquare } from "lucide-react";

const TopNav = () => {
  const location = useLocation();

  const navItems = [
    { label: "首页", path: "/", icon: Home },
    { label: "专家书房", path: "/experts", icon: Users },
    { label: "社区", path: "/community", icon: MessageSquare },
    { label: "个人专区", path: "/profile", icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="flex items-center h-14 px-6 gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">J</span>
          </div>
          <span className="font-semibold text-base text-foreground">JoyKnowledge</span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-accent/50 w-56">
          <Search className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">搜索...</span>
        </div>

        {/* AI Extract button */}
        <Link
          to="/extract"
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          AI 萃取
        </Link>

        {/* Notifications */}
        <button className="p-2 rounded-md hover:bg-accent text-muted-foreground transition-colors relative">
          <Bell className="w-4 h-4" />
        </button>

        {/* Avatar */}
        <Link to="/profile" className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm shrink-0">
          我
        </Link>
      </div>
    </header>
  );
};

export default TopNav;
