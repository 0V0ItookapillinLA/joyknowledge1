import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import CaseCard from "@/components/CaseCard";
import { MOCK_EXPERTS, MOCK_CASES } from "@/data/mockData";

const DOMAIN_TREE = [
  { label: "AI 与大模型", children: ["自然语言处理", "大模型应用", "智能客服"] },
  { label: "项目管理", children: ["敏捷方法", "跨部门协作", "风险管理"] },
  { label: "数据与架构", children: ["知识图谱", "数据治理", "数据架构"] },
  { label: "设计与体验", children: ["用户体验", "交互设计", "设计系统"] },
];

const ExpertLibrary = () => {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedExpert, setSelectedExpert] = useState(MOCK_EXPERTS[0]);

  const filteredExperts = selectedDomain
    ? MOCK_EXPERTS.filter((e) => e.domains.includes(selectedDomain))
    : MOCK_EXPERTS;

  const expertCases = MOCK_CASES.filter((c) => c.author === selectedExpert.name);

  return (
    <AppLayout>
      <div className="flex">
        {/* Domain tree */}
        <aside className="w-52 shrink-0 border-r border-border p-4 hidden lg:block sticky top-0 h-screen overflow-y-auto">
          <h3 className="font-display font-semibold text-sm text-foreground mb-3">领域分类</h3>
          <div className="space-y-3">
            <button
              onClick={() => setSelectedDomain(null)}
              className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                !selectedDomain ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              全部领域
            </button>
            {DOMAIN_TREE.map((domain) => (
              <div key={domain.label}>
                <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">{domain.label}</p>
                {domain.children.map((child) => (
                  <button
                    key={child}
                    onClick={() => setSelectedDomain(child)}
                    className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      selectedDomain === child ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {child}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </aside>

        {/* Expert list + detail */}
        <div className="flex-1 min-w-0 p-6">
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">专家书房</h1>
          <p className="text-sm text-muted-foreground mb-6">发现领域专家，学习他们的实践经验</p>

          {/* Expert cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {filteredExperts.map((expert) => (
              <motion.button
                key={expert.id}
                onClick={() => setSelectedExpert(expert)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`card-base p-5 text-left w-full transition-all ${
                  selectedExpert.id === expert.id ? "ring-2 ring-primary" : ""
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {expert.name[0]}
                  </div>
                  <div>
                    <p className="font-display font-semibold text-foreground">{expert.name}</p>
                    <p className="text-xs text-muted-foreground">{expert.title} · {expert.department}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{expert.bio}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{expert.caseCount} 案例</span>
                  <span>{expert.followers} 关注者</span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Selected expert's cases */}
          <div>
            <h2 className="font-display font-semibold text-lg text-foreground mb-4">{selectedExpert.name} 的案例</h2>
            {expertCases.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {expertCases.map((c) => (
                  <CaseCard key={c.id} caseItem={c} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">该专家暂无公开案例</p>
            )}
          </div>
        </div>

        {/* Right info panel */}
        <aside className="w-64 shrink-0 border-l border-border p-5 hidden xl:block sticky top-0 h-screen overflow-y-auto">
          <h3 className="font-display font-semibold text-sm text-foreground mb-3">专家能力</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-2">擅长领域</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedExpert.domains.map((d) => (
                  <span key={d} className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">{d}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">技能标签</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedExpert.skills.map((s) => (
                  <span key={s} className="px-2 py-1 rounded-full bg-secondary text-secondary-foreground text-xs">{s}</span>
                ))}
              </div>
            </div>
            <div className="pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground mb-1">统计</p>
              <div className="space-y-1 text-sm">
                <p className="text-foreground">{selectedExpert.caseCount} 篇案例</p>
                <p className="text-foreground">{selectedExpert.followers} 位关注者</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </AppLayout>
  );
};

export default ExpertLibrary;
