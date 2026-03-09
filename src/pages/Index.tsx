import { useState } from "react";
import { Link } from "react-router-dom";
import { Flame, Users, Sparkles, BookOpen, ArrowRight, Bookmark, Eye, Heart, MessageSquare, Home as HomeIcon, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import CaseCard from "@/components/CaseCard";
import TagChip from "@/components/TagChip";
import { MOCK_CASES, MOCK_TAGS, MOCK_EXPERTS } from "@/data/mockData";

const TOPIC_TAGS = [
  { label: "数字化转型", emoji: "🚀" },
  { label: "降本增效", emoji: "📊" },
  { label: "客户案例", emoji: "🤝" },
  { label: "项目复盘", emoji: "📋" },
  { label: "创新实践", emoji: "💡" },
  { label: "供应链优化", emoji: "🏗️" },
  { label: "敏捷开发", emoji: "⚡" },
];

const NAV_ITEMS = [
  { label: "推荐", icon: HomeIcon, active: true },
  { label: "热门", icon: Flame },
  { label: "关注", icon: Users },
];

const CATEGORY_ITEMS = [
  { label: "营销管理", icon: "📣" },
  { label: "研发管理", icon: "💻" },
  { label: "质量管理", icon: "✅" },
  { label: "采购管理", icon: "🛒" },
  { label: "产品管理", icon: "📦" },
  { label: "运营管理", icon: "📈" },
];

const Index = () => {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState("推荐");

  const filteredCases = activeTag
    ? MOCK_CASES.filter((c) => c.tags.some(t => t.includes(activeTag)))
    : MOCK_CASES;

  const trendingItems = [
    { title: "如何利用 AI 工具优化供应链效率", views: "1.2k" },
    { title: "远程团队管理的最佳实践指南", views: "1.2k" },
    { title: "2024年企业数字化转型路线图", views: "1.2k" },
    { title: "敏捷开发在大型项目中的应用", views: "980" },
  ];

  return (
    <AppLayout>
      <div className="flex">
        {/* Left sidebar */}
        <aside className="w-[200px] shrink-0 border-r border-border p-4 hidden lg:block sticky top-14 h-[calc(100vh-56px)] overflow-y-auto">
          <div className="mb-6">
            <p className="text-xs text-muted-foreground mb-2 px-3">发现</p>
            <div className="space-y-0.5">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => setActiveNav(item.label)}
                  className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-md text-sm transition-colors ${
                    activeNav === item.label
                      ? "text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2 px-3">专题</p>
            <div className="space-y-0.5">
              {CATEGORY_ITEMS.map((item) => (
                <button
                  key={item.label}
                  className="flex items-center gap-2.5 w-full px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  <span>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Hero search */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-10 px-6"
          >
            <h1 className="text-2xl font-semibold text-foreground mb-6">您想探索什么主题？</h1>
            <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
              {TOPIC_TAGS.map((tag) => (
                <button
                  key={tag.label}
                  onClick={() => setActiveTag(tag.label)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-md border text-sm transition-colors ${
                    activeTag === tag.label
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border bg-card text-foreground hover:border-primary/40"
                  }`}
                >
                  <span>{tag.emoji}</span>
                  {tag.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Content */}
          <div className="px-6 pb-8">
            <div className="mb-2">
              <h2 className="text-lg font-semibold text-foreground">精选推荐</h2>
              <p className="text-sm text-muted-foreground">来自专业人士的精选观点与洞察</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {filteredCases.slice(0, 4).map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <CaseCard caseItem={c} />
                </motion.div>
              ))}
            </div>

            {filteredCases.length > 4 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {filteredCases.slice(4, 8).map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <CaseCard caseItem={c} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <aside className="w-[280px] shrink-0 p-5 space-y-5 hidden xl:block sticky top-14 h-[calc(100vh-56px)] overflow-y-auto">
          {/* AI CTA Card */}
          <div className="rounded-xl bg-primary p-5 text-primary-foreground">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <p className="font-semibold text-base mb-1">分享您的知识</p>
            <p className="text-sm opacity-90 mb-4">使用 AI 在几分钟内将您的经验转化为结构化案例。</p>
            <Link
              to="/extract"
              className="block text-center py-2 rounded-lg bg-card text-primary font-medium text-sm hover:bg-card/90 transition-colors"
            >
              开始创作
            </Link>
          </div>

          {/* Quick entries */}
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-3">快捷入口</h3>
            <div className="space-y-1">
              <Link to="/experts" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent transition-colors">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">专家库</span>
              </Link>
              <Link to="/community" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent transition-colors">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">问答社区</span>
              </Link>
            </div>
          </div>

          {/* Trending */}
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-3">实时趋势</h3>
            <div className="space-y-3">
              {trendingItems.map((item, i) => (
                <div key={item.title} className="flex gap-3">
                  <span className={`text-lg font-bold shrink-0 w-6 ${
                    i < 3 ? "text-primary" : "text-muted-foreground"
                  }`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm text-foreground line-clamp-2 leading-snug">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.views} 阅读</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </AppLayout>
  );
};

export default Index;
