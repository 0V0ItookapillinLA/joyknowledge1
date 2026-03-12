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
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3 min-w-0">
        {/* Back button */}
        {!hideBack && (
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors shrink-0"
            title="返回"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Breadcrumb + title */}
        <div className="min-w-0">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
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
          <div className="flex items-baseline gap-3">
            <h1 className="text-lg font-semibold text-foreground truncate">{title}</h1>
            {subtitle && <span className="text-sm text-muted-foreground shrink-0">{subtitle}</span>}
          </div>
        </div>
      </div>

      {/* Actions */}
      {actions && (
        <div className="flex items-center gap-2 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
