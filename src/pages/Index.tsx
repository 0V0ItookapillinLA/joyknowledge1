import { useState } from "react";
import { Link } from "react-router-dom";
import { Flame, Users, Sparkles, ArrowRight, MessageSquare, Home as HomeIcon, TrendingUp, Search, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import CaseCard from "@/components/CaseCard";

import { MOCK_CASES, MOCK_TAGS } from "@/data/mockData";

const RECOMMENDED_TOPICS = [
  "人资团队管理的最佳实践指南",
  "2025年企业人力资源平台建设路线总图",
  "如何利用 AI 工具优化 HR 招聘流程",
  "Q3季度研发效能提升专项行动总结",
  "企业级混合云架构落地实践指南",
  "敏捷开发在大型项目中的应用案例",
];

const HOT_ZONES = [
  { label: "AI应用", emoji: "🚀", matchTags: ["AI应用"] },
  { label: "降本增效", emoji: "📊", matchTags: ["流程优化", "数据分析"] },
  { label: "客户案例", emoji: "🤝", matchTags: ["客户案例"] },
  { label: "项目复盘", emoji: "📋", matchTags: ["项目复盘"] },
  { label: "创新实践", emoji: "💡", matchTags: ["最佳实践", "产品设计"] },
  { label: "技术架构", emoji: "🏗️", matchTags: ["技术架构"] },
  { label: "团队管理", emoji: "⚡", matchTags: ["团队管理"] },
];

const NAV_ITEMS = [
  { label: "推荐", icon: HomeIcon, active: true },
  { label: "热门", icon: Flame },
  { label: "关注", icon: Users },
];

const BGBU_SECTIONS = [
  {
    title: "BGBU专区",
    items: [
      { label: "AI中台", matchDept: "AI中台" },
      { label: "数据平台", matchDept: "数据平台" },
      { label: "研发效能", matchDept: "研发效能" },
      { label: "项目管理", matchDept: "项目管理部" },
      { label: "UX设计", matchDept: "UX设计" },
      { label: "基础设施", matchDept: "基础设施" },
    ],
  },
  {
    title: "领域专区",
    items: [
      { label: "营销管理", matchTags: ["客户案例"] },
      { label: "研发管理", matchTags: ["技术架构"] },
      { label: "质量管理", matchTags: ["流程优化"] },
      { label: "采购管理", matchTags: ["数据分析"] },
      { label: "产品管理", matchTags: ["产品设计"] },
      { label: "运营管理", matchTags: ["最佳实践"] },
    ],
  },
];

const DATE_OPTIONS = ["全部时间", "最近一周", "最近一月", "最近三月"];

const Index = () => {
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState("推荐");

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState("全部时间");
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  const activeZoneObj = HOT_ZONES.find(z => z.label === activeZone);

  const allSectionItems = BGBU_SECTIONS.flatMap(s => s.items);
  const activeItem = allSectionItems.find(i => i.label === activeSection) as any;

  let filteredCases = MOCK_CASES;
  if (activeZoneObj) {
    filteredCases = filteredCases.filter((c) => c.tags.some(t => activeZoneObj.matchTags.includes(t)));
  }
  if (activeItem) {
    if ('matchDept' in activeItem) {
      filteredCases = filteredCases.filter((c) => c.department === activeItem.matchDept);
    } else if ('matchTags' in activeItem) {
      filteredCases = filteredCases.filter((c) => c.tags.some(t => (activeItem as any).matchTags.includes(t)));
    }
  }

  const trendingItems = [
    { title: "如何利用 AI 工具优化供应链效率", views: "1.2k" },
    { title: "远程团队管理的最佳实践指南", views: "1.2k" },
    { title: "2024年企业数字化转型路线图", views: "1.2k" },
    { title: "敏捷开发在大型项目中的应用", views: "980" },
  ];

  return (
    <AppLayout>
      <div className="flex max-w-[1400px] mx-auto">
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
            <p className="text-xs text-muted-foreground mb-2 px-3">BGBU专区</p>
            <div className="space-y-0.5">
              {BGBU_ITEMS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => { setActiveBGBU(activeBGBU === item.label ? null : item.label); setActiveDomain(null); }}
                  className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-md text-sm transition-colors ${
                    activeBGBU === item.label
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2 px-3">领域专区</p>
            <div className="space-y-0.5">
              {DOMAIN_ITEMS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => { setActiveDomain(activeDomain === item.label ? null : item.label); setActiveBGBU(null); }}
                  className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-md text-sm transition-colors ${
                    activeDomain === item.label
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date filter */}
          <div className="mt-auto pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2 px-3">筛选条件</p>
            <p className="text-xs text-muted-foreground px-3 mb-1">发布时间</p>
            <div className="relative px-3">
              <button
                onClick={() => setShowDateDropdown(!showDateDropdown)}
                className="flex items-center justify-between w-full px-3 py-2 rounded-md border border-border text-sm text-foreground hover:border-primary/40 transition-colors"
              >
                {dateFilter}
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showDateDropdown ? "rotate-180" : ""}`} />
              </button>
              {showDateDropdown && (
                <div className="absolute left-3 right-3 top-full mt-1 bg-card border border-border rounded-md shadow-md z-10">
                  {DATE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setDateFilter(opt); setShowDateDropdown(false); }}
                      className={`block w-full text-left px-3 py-2 text-sm transition-colors ${
                        dateFilter === opt ? "text-primary bg-primary/5" : "text-foreground hover:bg-accent"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Personalized recommendation topics */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8 px-6"
          >
            <h1 className="text-2xl font-semibold text-foreground mb-5">为你推荐</h1>
            <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
              {RECOMMENDED_TOPICS.map((topic) => (
                <Link
                  key={topic}
                  to={`/case/1`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-border bg-card text-sm text-foreground hover:border-primary/40 hover:bg-primary/5 transition-colors"
                >
                  {topic}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Hot zones */}
          <div className="px-6 pb-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground">热门专区</h2>
              <p className="text-sm text-muted-foreground">来自专业人士的精选观点与洞察</p>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {HOT_ZONES.map((zone) => (
                <button
                  key={zone.label}
                  onClick={() => setActiveZone(activeZone === zone.label ? null : zone.label)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-md border text-sm transition-colors ${
                    activeZone === zone.label
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border bg-card text-foreground hover:border-primary/40"
                  }`}
                >
                  <span>{zone.emoji}</span>
                  {zone.label}
                </button>
              ))}
            </div>
          </div>

          {/* Recommended knowledge cards */}
          <div className="px-6 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <aside className="w-[280px] shrink-0 p-5 space-y-5 hidden lg:block sticky top-14 h-[calc(100vh-56px)] overflow-y-auto border-l border-border">
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
