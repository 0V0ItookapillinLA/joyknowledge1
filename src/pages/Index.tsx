// Index page
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Flame, Users, Sparkles, MessageSquare, Home as HomeIcon, ChevronDown, ChevronRight, Briefcase, ShoppingCart, Truck, Cpu, Heart, Factory, Building2, Shield, TrendingUp, Code2, CheckCircle2, CreditCard, Lightbulb, BarChart3, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import CaseCard from "@/components/CaseCard";
import { MOCK_CASES, MOCK_EXPERTS } from "@/data/mockData";

import samAvatar from "@/assets/avatars/sam.jpg";
import ericAvatar from "@/assets/avatars/eric.jpg";
import richardAvatar from "@/assets/avatars/richard.jpg";
import sophieAvatar from "@/assets/avatars/sophie.jpg";
import kevinAvatar from "@/assets/avatars/kevin.jpg";
import amyAvatar from "@/assets/avatars/amy.jpg";
import davidAvatar from "@/assets/avatars/david.jpg";
import graceAvatar from "@/assets/avatars/grace.jpg";

const AVATAR_MAP: Record<string, string> = {
  "1": samAvatar, "2": ericAvatar, "3": richardAvatar, "4": sophieAvatar,
  "5": kevinAvatar, "6": amyAvatar, "7": davidAvatar, "8": graceAvatar,
};

const RECOMMENDED_TOPICS_ROW1 = [
  "重塑护城河：AI 时代业务壁垒从\u201C数据孤岛\u201D到\u201C智能模型\u201D的跃迁",
  "从工具到资产：如何通过 AI 深度耦合业务流程，构建不可复制的竞争优势？",
  "算法溢价：AI 如何在存量市场中压榨出新的业务增长点？",
  "下一代生产力入口：AI 浏览器将如何颠覆企业级应用的交互范式？",
  "从\u201C搜寻\u201D到\u201C投喂\u201D：解析 LMM 驱动下人机交互的智能化拐点",
  "消灭 UI：AI 时代下，自然语言如何取代点击成为 B 端产品的新触点？",
];

const RECOMMENDED_TOPICS_ROW2 = [
  "从 0 到 1 的\u201C重型武器\u201D：垂直领域平台级产品的高效落地实操手册",
  "拒绝伪需求：如何在垂直赛道精准定义平台级 AI 的\u201C第一落点\u201D？",
  "组织进化论：企业级 HR 智能体（Agent）从试点到全面应用的技术路径",
  "从降本到增益：HR 智能体如何在高频复杂场景下替代 70% 的重复性决策？",
  "数据主权：企业私有化部署\u201C龙虾\u201D系统的战略意义与合规边界",
  "安全与敏捷：如何在保障数据隐私的前提下，释放企业内部 AI 的原生动力？",
];

const HOT_ZONES = [
  { label: "HR管理", emoji: "👥", navDomain: "HR管理", navFilters: [] },
  { label: "领导力", emoji: "🎯", navDomain: "HR管理", navFilters: ["领导力发展"] },
  { label: "绩效管理", emoji: "📊", navDomain: "HR管理", navFilters: ["绩效管理"] },
  { label: "组织发展", emoji: "🏢", navDomain: "HR管理", navFilters: ["组织发展"] },
  { label: "人才招聘", emoji: "🤝", navDomain: "HR管理", navFilters: ["人才招聘"] },
  { label: "培训赋能", emoji: "📚", navDomain: "HR管理", navFilters: ["培训赋能"] },
  { label: "AI应用", emoji: "🚀", navDomain: "全部领域", navFilters: [] },
];

const NAV_ITEMS = [
  { label: "推荐", icon: HomeIcon, active: true },
  { label: "热门", icon: Flame },
  { label: "关注", icon: Users },
];

interface BGBUItem {
  label: string;
  icon: typeof Briefcase;
  posts: number;
}

interface SidebarSection {
  title: string;
  items: BGBUItem[];
}

const BGBU_SECTION: SidebarSection = {
  title: "BGBU专区",
  items: [
    { label: "京东职能", icon: Briefcase, posts: 1005 },
    { label: "京东零售", icon: ShoppingCart, posts: 5499 },
    { label: "京东物流", icon: Truck, posts: 8688 },
    { label: "京东科技", icon: Cpu, posts: 1411 },
    { label: "京东健康", icon: Heart, posts: 546 },
    { label: "京东工业", icon: Factory, posts: 135 },
    { label: "京东产发", icon: Building2, posts: 337 },
    { label: "京东保险", icon: Shield, posts: 190 },
  ],
};

const DOMAIN_SECTION: SidebarSection = {
  title: "领域专区",
  items: [
    { label: "营销管理", icon: TrendingUp, posts: 2340 },
    { label: "研发管理", icon: Code2, posts: 1890 },
    { label: "质量管理", icon: CheckCircle2, posts: 1256 },
    { label: "采购管理", icon: CreditCard, posts: 987 },
    { label: "产品管理", icon: Lightbulb, posts: 1654 },
    { label: "运营管理", icon: BarChart3, posts: 1123 },
  ],
};

const DEPARTMENTS = [
  { label: "全部部门", bgbu: "" },
  { label: "产品创新部", bgbu: "京东零售" },
  { label: "技术研发部", bgbu: "京东科技" },
  { label: "供应链管理部", bgbu: "京东物流" },
  { label: "市场营销部", bgbu: "京东零售" },
  { label: "人力资源部", bgbu: "京东职能" },
  { label: "数据平台部", bgbu: "京东科技" },
  { label: "健康业务部", bgbu: "京东健康" },
  { label: "基础设施部", bgbu: "京东科技" },
];

const DATE_OPTIONS = ["全部时间", "最近一周", "最近一月", "最近三月"];

// Hover popover section component - matches reference image with icon grid
const SidebarSectionWithPopover = ({ section, sectionType }: { section: SidebarSection; sectionType: "bgbu" | "domain" }) => {
  const [hovered, setHovered] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHovered(true);
  };
  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setHovered(false), 200);
  };

  const navigateToList = (item: BGBUItem) => {
    const type = sectionType === "bgbu" ? "dept" : "tags";
    const value = item.label;
    navigate(`/knowledge?type=${type}&value=${encodeURIComponent(value)}&label=${encodeURIComponent(item.label)}`);
  };

  const totalPosts = section.items.reduce((sum, item) => sum + item.posts, 0);

  return (
    <div
      className="relative mb-1"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button className="flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-semibold text-foreground hover:bg-accent transition-colors">
        {section.title}
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
      </button>

      {/* Show first few items inline */}
      <div className="space-y-0.5 mb-1">
        {section.items.slice(0, 4).map((item) => (
          <button
            key={item.label}
            onClick={() => navigateToList(item)}
            className="flex items-center gap-2 w-full px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            {item.label}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-full top-0 ml-1 w-[420px] bg-card border border-border rounded-lg shadow-lg z-50 p-5"
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
          >
            {/* Header */}
            <div className="flex items-baseline gap-3 mb-4">
              <p className="text-base font-semibold text-foreground">{section.title}</p>
              <span className="text-xs text-muted-foreground">共收录 {totalPosts.toLocaleString()} 条内容</span>
            </div>

            {/* Icon grid */}
            <div className="grid grid-cols-4 gap-4">
              {section.items.map((item) => {
                const IconComp = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => navigateToList(item)}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-accent transition-colors group"
                  >
                    <span className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/15 transition-colors">
                      <IconComp className="w-5 h-5" strokeWidth={1.5} />
                    </span>
                    <span className="text-sm text-foreground font-medium">{item.label}</span>
                    <span className="text-xs text-muted-foreground">帖子 {item.posts}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Index = () => {
  const [activeNav, setActiveNav] = useState("推荐");
  const [dateFilter, setDateFilter] = useState("全部时间");
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [marqueeRow1Paused, setMarqueeRow1Paused] = useState(false);
  const [marqueeRow2Paused, setMarqueeRow2Paused] = useState(false);
  const navigate = useNavigate();

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
        <aside className="w-[200px] shrink-0 border-r border-border p-4 hidden lg:flex flex-col sticky top-14 h-[calc(100vh-56px)] overflow-visible">
          <div className="mb-4">
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

          {/* BGBU & Domain sections with hover popover */}
          <SidebarSectionWithPopover section={BGBU_SECTION} sectionType="bgbu" />
          <SidebarSectionWithPopover section={DOMAIN_SECTION} sectionType="domain" />

          {/* Date filter at bottom */}
          <div className="mt-auto pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-1 px-3">发布时间</p>
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
          {activeNav === "推荐" && (
            <>
              {/* Marquee recommendations */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-8 px-6 overflow-hidden"
              >
                <h1 className="text-2xl font-semibold text-foreground mb-5 text-center">你可能需要</h1>

                {/* Row 1 */}
                <div
                  className="relative mb-3 overflow-hidden"
                  onMouseEnter={() => setMarqueeRow1Paused(true)}
                  onMouseLeave={() => setMarqueeRow1Paused(false)}
                >
                  <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10" />
                  <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10" />
                  <div
                    className="flex gap-3 animate-marquee-left"
                    style={marqueeRow1Paused ? { animationPlayState: "paused" } : undefined}
                  >
                    {[...RECOMMENDED_TOPICS_ROW1, ...RECOMMENDED_TOPICS_ROW1].map((topic, i) => (
                      <Link
                        key={`r1-${i}`}
                        to={`/case/1`}
                        className="inline-flex items-center shrink-0 px-4 py-2.5 rounded-md border border-border bg-card text-sm text-foreground hover:border-primary/40 hover:bg-primary/5 transition-colors whitespace-nowrap"
                      >
                        {topic}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Row 2 */}
                <div
                  className="relative overflow-hidden"
                  onMouseEnter={() => setMarqueeRow2Paused(true)}
                  onMouseLeave={() => setMarqueeRow2Paused(false)}
                >
                  <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10" />
                  <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10" />
                  <div
                    className="flex gap-3 animate-marquee-left-slow"
                    style={marqueeRow2Paused ? { animationPlayState: "paused" } : undefined}
                  >
                    {[...RECOMMENDED_TOPICS_ROW2, ...RECOMMENDED_TOPICS_ROW2].map((topic, i) => (
                      <Link
                        key={`r2-${i}`}
                        to={`/case/1`}
                        className="inline-flex items-center shrink-0 px-4 py-2.5 rounded-md border border-border bg-card text-sm text-foreground hover:border-primary/40 hover:bg-primary/5 transition-colors whitespace-nowrap"
                      >
                        {topic}
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>

              <div className="px-6 pb-4">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-foreground">热门专区</h2>
                  <p className="text-sm text-muted-foreground">来自专业人士的精选观点与洞察</p>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {HOT_ZONES.map((zone) => (
                    <button
                      key={zone.label}
                      onClick={() => {
                        const filters = zone.navFilters.length > 0 ? zone.navFilters.join(",") : "";
                        navigate(`/knowledge?type=domain&value=${encodeURIComponent(zone.navDomain)}&label=${encodeURIComponent(zone.label)}${filters ? `&filters=${encodeURIComponent(filters)}` : ""}`);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-border bg-card text-sm text-foreground hover:border-primary/40 hover:bg-primary/5 transition-colors"
                    >
                      <span>{zone.emoji}</span>
                      {zone.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="px-6 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MOCK_CASES.slice(0, 4).map((c, i) => (
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

                {MOCK_CASES.length > 4 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {MOCK_CASES.slice(4, 8).map((c, i) => (
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
            </>
          )}

          {activeNav === "热门" && (
            <div className="p-6">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-xl font-semibold text-foreground mb-1">热门内容</h2>
                <p className="text-sm text-muted-foreground mb-6">过去7天最受关注的知识内容</p>

                <div className="space-y-0">
                  {[...MOCK_CASES].sort((a, b) => b.views - a.views).map((c, i) => (
                    <Link
                      key={c.id}
                      to={`/case/${c.id}`}
                      className="flex items-start gap-4 py-5 border-b border-border hover:bg-accent/30 transition-colors -mx-2 px-2 rounded"
                    >
                      <span className={`text-2xl font-bold shrink-0 w-8 text-right ${
                        i < 3 ? "text-primary" : "text-muted-foreground/40"
                      }`}>
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">{c.category}</span>
                          {i < 3 && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-destructive/10 text-destructive">HOT</span>}
                        </div>
                        <h3 className="text-base font-semibold text-foreground mb-1.5 line-clamp-1">{c.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{c.summary}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{c.author} · {c.department}</span>
                          <span>{c.views >= 1000 ? (c.views / 1000).toFixed(1) + "k" : c.views} 阅读</span>
                          <span>{c.likes} 点赞</span>
                          <span>{c.comments} 评论</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>
          )}

          {activeNav === "关注" && (
            <div className="p-6">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-xl font-semibold text-foreground mb-1">关注动态</h2>
                <p className="text-sm text-muted-foreground mb-6">你关注的专家和话题的最新动态</p>

                {/* Following experts */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-foreground mb-3">已关注的专家</h3>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {MOCK_EXPERTS.slice(0, 5).map((expert) => (
                      <Link
                        key={expert.id}
                        to={`/experts?id=${expert.id}`}
                        className="flex flex-col items-center gap-2 shrink-0 group"
                      >
                        <img
                          src={AVATAR_MAP[expert.id]}
                          alt={expert.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-primary/20 group-hover:border-primary transition-colors"
                        />
                        <span className="text-xs text-foreground">{expert.name.split(" ")[0]}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Feed from followed */}
                <h3 className="text-sm font-semibold text-foreground mb-3">最新动态</h3>
                <div className="space-y-0">
                  {MOCK_CASES.slice(0, 6).map((c, i) => {
                    const expert = MOCK_EXPERTS[i % MOCK_EXPERTS.length];
                    return (
                      <motion.div
                        key={c.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <Link
                          to={`/case/${c.id}`}
                          className="block py-4 border-b border-border hover:bg-accent/30 transition-colors -mx-2 px-2 rounded"
                        >
                          <div className="flex items-center gap-2.5 mb-2.5">
                            <img
                              src={AVATAR_MAP[expert.id]}
                              alt={expert.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                              <span className="text-sm font-medium text-foreground">{expert.name}</span>
                              <span className="text-xs text-muted-foreground ml-2">发布了新内容</span>
                            </div>
                            <span className="text-xs text-muted-foreground ml-auto">{c.createdAt}</span>
                          </div>
                          <h3 className="text-base font-semibold text-foreground mb-1.5 line-clamp-1 ml-[42px]">{c.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 ml-[42px]">{c.summary}</p>
                          <div className="flex items-center gap-3 mt-2 ml-[42px] text-xs text-muted-foreground">
                            {c.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="text-primary/70">#{tag}</span>
                            ))}
                            <span>{c.views} 阅读</span>
                            <span>{c.likes} 点赞</span>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <aside className="w-[280px] shrink-0 p-5 space-y-5 hidden lg:block sticky top-14 h-[calc(100vh-56px)] overflow-y-auto border-l border-border">
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
