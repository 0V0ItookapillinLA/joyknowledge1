import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, ArrowLeft, Search, Eye, ThumbsUp } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { MOCK_CASES } from "@/data/mockData";

const DATE_OPTIONS = ["全部时间", "最近一周", "最近一月", "最近三月"];
const CONTENT_TYPES = ["案例", "文档", "视频", "问答"];

const BGBU_TREE = [
  {
    label: "京东职能体系",
    children: ["人力资源", "财务管理", "法务合规", "行政后勤"],
  },
  {
    label: "京东零售",
    children: ["平台业务", "自营业务", "全渠道", "市场营销"],
  },
  {
    label: "京东物流",
    children: ["仓储管理", "配送网络", "供应链", "冷链物流"],
  },
  {
    label: "京东科技",
    children: ["AI中台", "数据平台", "云计算", "区块链"],
  },
];

const DOMAIN_TREE = [
  {
    label: "营销管理",
    children: ["品牌营销", "数字营销", "内容运营", "渠道管理"],
  },
  {
    label: "研发管理",
    children: ["技术架构", "研发效能", "代码质量", "DevOps"],
  },
  {
    label: "质量管理",
    children: ["流程优化", "质量体系", "测试管理", "标准认证"],
  },
  {
    label: "产品管理",
    children: ["产品设计", "用户研究", "需求管理", "产品运营"],
  },
];

const SORT_OPTIONS = ["综合排序", "最新发布", "最多浏览", "最多点赞"];

const KnowledgeList = () => {
  const [searchParams] = useSearchParams();
  const filterType = searchParams.get("type") || "";
  const filterValue = searchParams.get("value") || "";
  const filterLabel = searchParams.get("label") || filterValue;

  const [viewTab, setViewTab] = useState<"domain" | "bgbu">(filterType === "dept" ? "bgbu" : "domain");
  const [expandedGroups, setExpandedGroups] = useState<string[]>([filterLabel]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([filterLabel]);
  const [dateFilter, setDateFilter] = useState("全部时间");
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("综合排序");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const tree = viewTab === "bgbu" ? BGBU_TREE : DOMAIN_TREE;

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label]
    );
  };

  const toggleFilter = (label: string) => {
    setSelectedFilters((prev) =>
      prev.includes(label) ? prev.filter((f) => f !== label) : [...prev, label]
    );
  };

  const toggleContentType = (t: string) => {
    setSelectedContentTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  };

  // Simple filter: show all cases (mock data doesn't map perfectly to tree)
  const filteredCases = MOCK_CASES;

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto flex">
        {/* Left sidebar */}
        <aside className="w-[260px] shrink-0 border-r border-border p-5 hidden lg:flex flex-col sticky top-14 h-[calc(100vh-56px)] overflow-y-auto">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> 返回首页
          </Link>

          {/* View tabs */}
          <div className="flex rounded-lg border border-border mb-5 overflow-hidden">
            <button
              onClick={() => setViewTab("domain")}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                viewTab === "domain"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              领域视图
            </button>
            <button
              onClick={() => setViewTab("bgbu")}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                viewTab === "bgbu"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              BGBU视图
            </button>
          </div>

          {/* Org tree */}
          <div className="mb-5">
            <p className="text-xs text-muted-foreground mb-2">
              {viewTab === "bgbu" ? "组织架构" : "领域分类"}
            </p>
            <div className="space-y-1">
              {tree.map((group) => {
                const isExpanded = expandedGroups.includes(group.label);
                const isGroupSelected = selectedFilters.includes(group.label);
                return (
                  <div key={group.label}>
                    <button
                      onClick={() => toggleGroup(group.label)}
                      className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-sm transition-colors ${
                        isGroupSelected
                          ? "text-primary font-medium"
                          : "text-foreground hover:bg-accent"
                      }`}
                    >
                      {group.label}
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="ml-4 space-y-0.5 mt-0.5">
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

          {/* Filters at bottom */}
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
                          ? "bg-foreground text-card font-medium"
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
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold text-foreground">{filterLabel}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                正在浏览 {filterLabel} 相关内容
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Search */}
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
              {/* Sort */}
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

          {/* Selected filters */}
          {selectedFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {selectedFilters.map((f) => (
                <span
                  key={f}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium"
                >
                  {f}
                  <button
                    onClick={() => toggleFilter(f)}
                    className="hover:text-primary/70 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
              <button
                onClick={() => setSelectedFilters([])}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                清除全部
              </button>
            </div>
          )}

          {/* Article list */}
          <div className="space-y-0">
            {filteredCases.map((c, i) => (
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
                      {/* Category + time */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                          {c.category}
                        </span>
                        <span className="text-xs text-muted-foreground">{c.createdAt}</span>
                        <span className="text-xs text-muted-foreground">· {c.department}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-semibold text-foreground mb-2 line-clamp-1">
                        {c.title}
                      </h3>

                      {/* Summary */}
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {c.summary}
                      </p>

                      {/* Author + stats + tags */}
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

                    {/* Thumbnail for some items */}
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

          {filteredCases.length === 0 && (
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
