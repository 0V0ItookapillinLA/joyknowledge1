import { Link } from "react-router-dom";
import { Eye, Heart, MessageCircle } from "lucide-react";
import type { CaseItem } from "@/data/mockData";

interface CaseCardProps {
  caseItem: CaseItem;
}

const formatNumber = (n: number) => {
  if (n >= 10000) return (n / 10000).toFixed(1) + "万";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n.toString();
};

const CaseCard = ({ caseItem }: CaseCardProps) => {
  return (
    <Link to={`/case/${caseItem.id}`} className="block card-base p-4 group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground">{caseItem.category}</span>
        <span className="text-xs text-muted-foreground">{caseItem.createdAt}</span>
      </div>
      <h3 className="font-medium text-sm text-card-foreground mb-1.5 group-hover:text-primary transition-colors line-clamp-2">
        {caseItem.title}
      </h3>
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{caseItem.summary}</p>
      <div className="flex flex-wrap gap-1 mb-3">
        {caseItem.tags.map((tag) => (
          <span key={tag} className="px-2 py-0.5 rounded bg-accent text-secondary-foreground text-xs">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <span className="font-medium text-card-foreground">{caseItem.author}</span>
          <span>· {caseItem.department}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{formatNumber(caseItem.views)}</span>
          <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" />{formatNumber(caseItem.likes)}</span>
          <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" />{caseItem.comments}</span>
        </div>
      </div>
    </Link>
  );
};

export default CaseCard;
