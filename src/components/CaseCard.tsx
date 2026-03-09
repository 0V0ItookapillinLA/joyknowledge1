import { Link } from "react-router-dom";
import { Eye, Heart, MessageCircle, Bookmark } from "lucide-react";
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
    <Link to={`/case/${caseItem.id}`} className="block card-base p-5 group">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-muted-foreground">{caseItem.department}</span>
        <Bookmark className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <h3 className="font-semibold text-sm text-card-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-relaxed">
        {caseItem.title}
      </h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{caseItem.summary}</p>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">{formatNumber(caseItem.likes)} 赞</span>
        <span>·</span>
        <span className="flex items-center gap-1">{formatNumber(caseItem.views)} 阅读</span>
      </div>
    </Link>
  );
};

export default CaseCard;
