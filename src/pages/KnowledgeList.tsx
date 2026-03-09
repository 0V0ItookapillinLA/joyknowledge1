import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown, ArrowLeft } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import CaseCard from "@/components/CaseCard";
import { MOCK_CASES } from "@/data/mockData";

const DATE_OPTIONS = ["全部时间", "最近一周", "最近一月", "最近三月"];
const CONTENT_TYPES = ["全部", "案例", "文档", "视频", "问答"];

const KnowledgeList = () => {
  const [searchParams] = useSearchParams();
  const filterType = searchParams.get("type") || "";
  const filterValue = searchParams.get("value") || "";
  const filterLabel = searchParams.get("label") || filterValue;

  const [dateFilter, setDateFilter] = useState("全部时间");
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [contentType, setContentType] = useState("全部");

  // Filter cases based on params
  let filteredCases = MOCK_CASES;
  if (filterType === "dept") {
    filteredCases = filteredCases.filter((c) => c.department === filterValue);
  } else if (filterType === "tags") {
    const tags = filterValue.split(",");
    filteredCases = filteredCases.filter((c) => c.tags.some((t) => tags.includes(t)));
  } else if (filterType === "zone") {
    const tags = filterValue.split(",");
    filteredCases = filteredCases.filter((c) => c.tags.some((t) => tags.includes(t)));
  }

  return (
    <AppLayout>
      <div className="max-w-[1400px] mx-auto flex">
        {/* Left: Filter sidebar */}
        <aside className="w-[240px] shrink-0 border-r border-border p-5 hidden lg:block sticky top-14 h-[calc(100vh-56px)] overflow-y-auto">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> 返回首页
          </Link>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">筛选条件</h3>

            {/* Date filter */}
            <p className="text-xs text-muted-foreground mb-1">发布时间</p>
            <div className="relative mb-5">
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

            {/* Content type */}
            <p className="text-xs text-muted-foreground mb-2">内容类型</p>
            <div className="flex flex-wrap gap-2">
              {CONTENT_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setContentType(t)}
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                    contentType === t
                      ? "bg-foreground text-card font-medium"
                      : "bg-accent text-foreground hover:bg-accent/80"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0 p-6">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-foreground">
              {filterLabel}
              <span className="text-sm font-normal text-muted-foreground ml-3">
                共 {filteredCases.length} 条知识
              </span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {filterType === "dept" ? "部门专区" : filterType === "tags" ? "领域专区" : "专题"} · {filterLabel}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCases.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <CaseCard caseItem={c} />
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
