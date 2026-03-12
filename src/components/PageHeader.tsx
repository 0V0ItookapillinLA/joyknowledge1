import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface PageHeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  subtitle?: string;
  /** Hide back button (e.g. on homepage) */
  hideBack?: boolean;
}

const PageHeader = ({ title, breadcrumbs, actions, subtitle, hideBack }: PageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="mb-5 space-y-2">
      {/* Breadcrumb row */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {!hideBack && (
            <button
              onClick={() => navigate(-1)}
              className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors shrink-0 mr-1"
              title="返回"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}
          <Link to="/" className="hover:text-foreground transition-colors">首页</Link>
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <ChevronRight className="w-3 h-3" />
              {crumb.path ? (
                <Link to={crumb.path} className="hover:text-foreground transition-colors">{crumb.label}</Link>
              ) : (
                <span className="text-foreground">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      {/* Title + actions row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          {/* Back button only if no breadcrumbs but back is needed */}
          {!hideBack && !(breadcrumbs && breadcrumbs.length > 0) && (
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors shrink-0"
              title="返回"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          <div className="flex items-baseline gap-3 min-w-0">
            <h1 className="text-lg font-semibold text-foreground truncate">{title}</h1>
            {subtitle && <span className="text-sm text-muted-foreground shrink-0">{subtitle}</span>}
          </div>
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex items-center gap-2 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
