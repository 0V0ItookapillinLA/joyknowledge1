import { useState } from "react";
import { Link } from "react-router-dom";
import { Flame, Users, Sparkles, BookOpen, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import CaseCard from "@/components/CaseCard";
import TagChip from "@/components/TagChip";
import { MOCK_CASES, MOCK_TAGS, MOCK_EXPERTS } from "@/data/mockData";

const Index = () => {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filteredCases = activeTag
    ? MOCK_CASES.filter((c) => c.tags.includes(activeTag))
    : MOCK_CASES;

  return (
    <AppLayout>
      <div className="flex">
        {/* Main content */}
        <div className="flex-1 min-w-0 p-6 space-y-6">
          {/* Topics / Tags */}
          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <h1 className="text-xl font-semibold text-foreground mb-1">发现知识</h1>
            <p className="text-sm text-muted-foreground mb-4">探索来自团队的最新案例与实践</p>
            <div className="flex flex-wrap gap-2">
              <TagChip
                tag={{ label: "全部", emoji: "📋" }}
                isActive={activeTag === null}
                onClick={() => setActiveTag(null)}
              />
              {MOCK_TAGS.map((tag) => (
                <TagChip
                  key={tag.label}
                  tag={tag}
                  isActive={activeTag === tag.label}
                  onClick={() => setActiveTag(tag.label)}
                />
              ))}
            </div>
          </motion.section>

          {/* Nearby Cases */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-base text-foreground">身边案例</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {filteredCases.slice(0, 4).map((c, i) => (
                <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <CaseCard caseItem={c} />
                </motion.div>
              ))}
            </div>
          </section>

          {/* Hot Cases */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-base text-foreground">热门专区</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {[...MOCK_CASES].sort((a, b) => b.views - a.views).slice(0, 4).map((c, i) => (
                <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <CaseCard caseItem={c} />
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Right sidebar */}
        <aside className="w-64 shrink-0 border-l border-border p-5 space-y-6 hidden xl:block sticky top-0 h-screen overflow-y-auto">
          {/* Quick entries */}
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-3">快捷入口</h3>
            <div className="space-y-1.5">
              <Link to="/experts" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent transition-colors">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">专家书房</span>
                <ArrowRight className="w-3.5 h-3.5 ml-auto text-muted-foreground" />
              </Link>
              <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent transition-colors">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">个人专区</span>
                <ArrowRight className="w-3.5 h-3.5 ml-auto text-muted-foreground" />
              </Link>
              <Link to="/extract" className="flex items-center gap-3 px-3 py-2.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">AI 知识萃取</span>
                <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-70" />
              </Link>
            </div>
          </div>

          {/* Trending tags */}
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-3">热门标签</h3>
            <div className="space-y-1">
              {MOCK_TAGS.slice(0, 6).map((tag, i) => (
                <button
                  key={tag.label}
                  onClick={() => setActiveTag(tag.label)}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-md hover:bg-accent transition-colors text-sm"
                >
                  <span className="text-muted-foreground font-medium w-4 text-xs">{i + 1}</span>
                  <span>{tag.emoji}</span>
                  <span className="text-foreground">{tag.label}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{tag.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Top experts */}
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-3">推荐专家</h3>
            <div className="space-y-3">
              {MOCK_EXPERTS.slice(0, 3).map((expert) => (
                <Link key={expert.id} to={`/experts?id=${expert.id}`} className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                    {expert.name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{expert.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{expert.title} · {expert.department}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </AppLayout>
  );
};

export default Index;
