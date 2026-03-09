import type { TagItem } from "@/data/mockData";

interface TagChipProps {
  tag: TagItem;
  isActive?: boolean;
  onClick?: () => void;
}

const TagChip = ({ tag, isActive, onClick }: TagChipProps) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-sm border transition-colors ${
        isActive
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-card text-card-foreground border-border hover:border-primary/40 hover:text-primary"
      }`}
    >
      {tag.emoji && <span>{tag.emoji}</span>}
      <span>{tag.label}</span>
    </button>
  );
};

export default TagChip;
