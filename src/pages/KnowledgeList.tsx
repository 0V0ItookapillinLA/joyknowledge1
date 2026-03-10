import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, ArrowLeft, Search, Eye, ThumbsUp, Layers, Building2, TrendingUp, Code2, CheckCircle2, CreditCard, Lightbulb, BarChart3, Users, X } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { MOCK_CASES } from "@/data/mockData";

const DATE_OPTIONS = ["全部时间", "最近一周", "最近一月", "最近三月"];
const CONTENT_TYPES = ["案例", "文档", "视频", "问答"];

interface DomainItem {
  label: string;
  icon: typeof Layers;
  children?: string[];
}

const DOMAIN_ITEMS: DomainItem[] = [
  { label: "全部领域", icon: Layers },
  { label: "营销管理", icon: TrendingUp },
  { label: "研发管理", icon: Code2 },
  { label: "质量管理", icon: CheckCircle2 },
  { label: "采购管理", icon: CreditCard },
  { label: "产品管理", icon: Lightbulb },
  { label: "运营管理", icon: BarChart3 },
  {
    label: "HR管理",
    icon: Users,
    children: ["领导力发展", "绩效管理", "组织发展", "人才招聘", "培训赋能", "薪酬福利"],
  },
];

const ORG_TREE = [
  {
    label: "京东职能体系",
    children: ["京东职能", "京东零售", "京东物流", "京东科技", "京东健康", "京东工业", "京东产发", "京东保险"],
  },
];

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

const SORT_OPTIONS = ["综合排序", "最新发布", "最多浏览", "最多点赞"];

const KnowledgeList = () => {
  const [searchParams] = useSearchParams();
  const filterType = searchParams.get("type") || "";
  const filterValue = searchParams.get("value") || "";
  const filterLabel = searchParams.get("label") || filterValue;
  const initialFilters = searchParams.get("filters")?.split(",").filter(Boolean) || [];

  const [expandedGroups, setExpandedGroups] = useState<string[]>(["京东职能体系"]);
  const [expandedDomains, setExpandedDomains] = useState<string[]>(
    filterType === "domain" && filterValue === "HR管理" ? ["HR管理"] : []
  );
  const [selectedFilters, setSelectedFilters] = useState<string[]>(
    initialFilters.length > 0 ? initialFilters : (filterLabel && filterLabel !== filterValue ? [filterLabel] : [])
  );
  const [selectedDomain, setSelectedDomain] = useState(
    filterType === "domain" ? filterValue : "全部领域"
  );
  const [dateFilter, setDateFilter] = useState("全部时间");
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("综合排序");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("全部部门");
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label]
    );
  };

  const toggleDomain = (label: string) => {
    setExpandedDomains((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label]
    );
  };

  const toggleFilter = (label: string) => {
    setSelectedFilters((prev) =>
      prev.includes(label) ? prev.filter((f) => f !== label) : [...prev, label]
    );
  };

  const removeFilter = (label: string) => {
    setSelectedFilters((prev) => prev.filter((f) => f !== label));
  };

  const toggleContentType = (t: string) => {
    setSelectedContentTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  };

  // Filter logic
  let filteredCases = MOCK_CASES;

  if (selectedFilters.length > 0) {
    const filtered = filteredCases.filter((c) =>
      selectedFilters.some((f) =>
        c.department.includes(f) ||
        c.tags.some(t => t.includes(f)) ||
        c.category.includes(f) ||
        f.includes(c.department)
      )
    );
    if (filtered.length > 0) filteredCases = filtered;
  }

  if (selectedDomain !== "全部领域") {
    const filtered = filteredCases.filter((c) =>
      c.tags.some(t => t.includes(selectedDomain)) || c.category.includes(selectedDomain)
    );
    if (filtered.length > 0) filteredCases = filtered;
  }

  if (selectedContentTypes.length > 0) {
    filteredCases = filteredCases.filter((c) =>
      selectedContentTypes.some((t) => c.category.includes(t))
    );
  }

  const searchFiltered = searchQuery
    ? filteredCases.filter((c) =>
        c.title.includes(searchQuery) || c.summary.includes(searchQuery)
      )
    : filteredCases;

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto flex">
        {/* Left sidebar */}
        <aside className="w-[260px] shrink-0 border-r border-border p-5 hidden lg:flex flex-col sticky top-14 h-[calc(100vh-56px)] overflow-y-auto">
          {/* Selected filters at top */}
          {selectedFilters.length > 0 && (
            <div className="mb-5 p-3 rounded-lg bg-accent/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-foreground">已选条件</span>
                <button
                  onClick={() => setSelectedFilters([])}
                  className="text-xs text-primary hover:text-primary/80"
                >
                  清空
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedFilters.map((f) => (
                  <span
                    key={f}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-primary/20 bg-primary/5 text-primary text-xs font-medium"
                  >
                    {f}
                    <button onClick={() => removeFilter(f)} className="hover:text-primary/70">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Domain section */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">知识领域</span>
            </div>
            <div className="space-y-0.5">
              {DOMAIN_ITEMS.map((item) => {
                const IconComp = item.icon;
                const isActive = selectedDomain === item.label;
                const hasChildren = item.children && item.children.length > 0;
                const isExpanded = expandedDomains.includes(item.label);
                return (
                  <div key={item.label}>
                    <button
                      onClick={() => {
                        setSelectedDomain(item.label);
                        if (hasChildren) toggleDomain(item.label);
                      }}
                      className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-sm transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <IconComp className="w-4 h-4" strokeWidth={1.5} />
                        {item.label}
                      </span>
                      {hasChildren && (
                        isExpanded
                          ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
                          : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </button>
                    {hasChildren && isExpanded && (
                      <div className="ml-5 space-y-0.5 mt-0.5 border-l-2 border-border pl-3">
                        {item.children!.map((child) => {
                          const isSelected = selectedFilters.includes(child);
                          return (
                            <button
                              key={child}
                              onClick={() => toggleFilter(child)}
                              className={`block w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                                isSelected
                                  ? "text-primary font-medium bg-primary/5"
                                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
                              }`}
                            >
                              {child}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Org tree */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">组织架构</span>
            </div>
            <div className="space-y-0.5">
              {ORG_TREE.map((group) => {
                const isExpanded = expandedGroups.includes(group.label);
                return (
                  <div key={group.label}>
                    <button
                      onClick={() => toggleGroup(group.label)}
                      className="flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-accent transition-colors"
                    >
                      {group.label}
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="ml-3 space-y-0.5 mt-0.5 border-l-2 border-border pl-3">
                        {group.children.map((child) => {
                          const isSelected = selectedFilters.includes(child);
                          return (
                            <button
                              key={child}
                              onClick={() => toggleFilter(child)}
                              className={`block w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                                isSelected
                                  ? "text-primary font-medium bg-primary/5"
                                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
                              }`}
                            >
                              {child}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Date & content type filters */}
          <div className="mt-auto pt-4 border-t border-border space-y-4">
            <p className="text-sm font-semibold text-foreground">筛选条件</p>

            <div>
              <p className="text-xs text-muted-foreground mb-1">发布时间</p>
              <div className="relative">
                <button
                  onClick={() => setShowDateDropdown(!showDateDropdown)}
                  className="flex items-center justify-between w-full px-3 py-2 rounded-md border border-border text-sm text-foreground hover:border-primary/40 transition-colors"
                >
                  {dateFilter}
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showDateDropdown ? "rotate-180" : ""}`} />
                </button>
                {showDateDropdown && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-card border border-border rounded-md shadow-md z-10">
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

            <div>
              <p className="text-xs text-muted-foreground mb-2">内容类型</p>
              <div className="flex flex-wrap gap-2">
                {CONTENT_TYPES.map((t) => {
                  const isActive = selectedContentTypes.includes(t);
                  return (
                    <button
                      key={t}
                      onClick={() => toggleContentType(t)}
                      className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground font-medium"
                          : "bg-accent text-foreground hover:bg-accent/80"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0 p-6">
          {/* Header bar */}
          <div className="flex items-center justify-between mb-4">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> 返回首页
            </Link>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="在结果中搜索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-md border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground w-[200px] focus:outline-none focus:border-primary/40"
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {sortBy}
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showSortDropdown && (
                  <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-md shadow-md z-10 min-w-[120px]">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => { setSortBy(opt); setShowSortDropdown(false); }}
                        className={`block w-full text-left px-3 py-2 text-sm transition-colors ${
                          sortBy === opt ? "text-primary bg-primary/5" : "text-foreground hover:bg-accent"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Active filter tags in content area */}
          {selectedFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-5 pb-4 border-b border-border">
              <span className="text-xs text-muted-foreground mr-1">筛选:</span>
              {selectedFilters.map((f) => (
                <span
                  key={f}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                >
                  {f}
                  <button onClick={() => removeFilter(f)} className="hover:text-primary/70">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button
                onClick={() => setSelectedFilters([])}
                className="text-xs text-muted-foreground hover:text-foreground ml-1"
              >
                清除全部
              </button>
            </div>
          )}

          {/* Results count */}
          <p className="text-xs text-muted-foreground mb-4">
            共 {searchFiltered.length} 条结果
          </p>

          {/* Article list */}
          <div className="space-y-0">
            {searchFiltered.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link
                  to={`/case/${c.id}`}
                  className="block py-5 border-b border-border hover:bg-accent/30 transition-colors -mx-2 px-2 rounded"
                >
                  <div className="flex gap-5">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                          {c.category}
                        </span>
                        <span className="text-xs text-muted-foreground">{c.createdAt}</span>
                        <span className="text-xs text-muted-foreground">· {c.department}</span>
                      </div>
                      <h3 className="text-base font-semibold text-foreground mb-2 line-clamp-1">
                        {c.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {c.summary}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">
                            {c.author[0]}
                          </span>
                          {c.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" /> {c.views >= 1000 ? (c.views / 1000).toFixed(1) + "k" : c.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-3.5 h-3.5" /> {c.likes}
                        </span>
                        {c.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-primary/70">#{tag}</span>
                        ))}
                      </div>
                    </div>
                    {i % 3 === 0 && (
                      <div className="w-[160px] h-[100px] rounded-lg bg-accent shrink-0 overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-primary/5 to-primary/15 flex items-center justify-center text-primary/30 text-xs">
                          封面图
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {searchFiltered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">暂无相关知识内容</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default KnowledgeList;
