import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useState } from "react";

const AIBar = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link
        to="/extract"
        className="flex items-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Sparkles className="w-5 h-5" />
        {isHovered && <span className="animate-fade-in text-sm">AI 知识萃取</span>}
      </Link>
    </div>
  );
};

export default AIBar;
