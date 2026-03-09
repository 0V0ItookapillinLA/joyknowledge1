import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, ArrowLeft, FileText, Tag, Eye, Send, Wand2, CheckCircle2 } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { CASE_CATEGORIES, MOCK_TAGS } from "@/data/mockData";

const STEPS = ["选择类型", "输入信息", "编辑发布"];

const KnowledgeExtract = () => {
  const [step, setStep] = useState(0);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<{ title: string; summary: string; tags: string[]; sections: string[] } | null>(null);

  const handleAIGenerate = () => {
    setAiGenerating(true);
    setTimeout(() => {
      setAiResult({
        title: title || "基于实践的知识萃取方法论",
        summary: "本文从实际项目出发，总结了在特定场景下的方法论和关键经验，为团队后续类似工作提供参考。",
        tags: ["最佳实践", "项目复盘", "流程优化"],
        sections: ["背景与挑战", "解决方案", "实施过程", "成果与反思"],
      });
      setAiGenerating(false);
    }, 1500);
  };

  return (
    <AppLayout>
      <div className="flex">
        {/* Main editing area */}
        <div className="flex-1 min-w-0 p-6 max-w-3xl">
          <h1 className="font-display text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="ai-gradient-text">AI 知识萃取</span>
          </h1>
          <p className="text-sm text-muted-foreground mb-6">把零散经验快速沉淀为结构化案例</p>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  i <= step ? "ai-gradient-bg text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}>
                  {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-sm ${i <= step ? "text-foreground font-medium" : "text-muted-foreground"}`}>{s}</span>
                {i < STEPS.length - 1 && <div className={`w-12 h-0.5 ${i < step ? "bg-primary" : "bg-border"}`} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-display font-semibold text-lg text-foreground mb-4">选择沉淀类型</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CASE_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedType(cat)}
                      className={`card-base p-4 text-left transition-all ${
                        selectedType === cat ? "ring-2 ring-primary" : ""
                      }`}
                    >
                      <p className="font-medium text-foreground">{cat}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {cat === "经验案例" && "记录个人或团队的实践经验"}
                        {cat === "项目复盘" && "对已完成项目的系统回顾"}
                        {cat === "问题解决" && "描述问题发现与解决过程"}
                        {cat === "最佳实践" && "总结可复用的方法与流程"}
                        {cat === "客户案例" && "记录客户合作的成功经验"}
                      </p>
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    disabled={!selectedType}
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-40 hover:opacity-90 transition-opacity"
                  >
                    下一步 <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-display font-semibold text-lg text-foreground mb-4">输入原始信息</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">标题（可选）</label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="输入案例标题，或留空让 AI 生成"
                      className="w-full px-4 py-2.5 rounded-lg bg-card border border-input text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">原始内容 / 经验描述</label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="把你的经验、想法、笔记粘贴到这里，AI 将帮你整理成结构化案例..."
                      className="w-full px-4 py-3 rounded-lg bg-card border border-input text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring min-h-[200px] resize-y"
                    />
                  </div>
                  <button
                    onClick={handleAIGenerate}
                    disabled={aiGenerating}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg ai-gradient-bg text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
                  >
                    <Wand2 className="w-4 h-4" />
                    {aiGenerating ? "AI 生成中..." : "AI 生成结构"}
                  </button>

                  {aiResult && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card-base p-5 space-y-3 border-primary/20">
                      <p className="text-xs font-medium text-primary flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> AI 生成结果</p>
                      <div>
                        <p className="text-xs text-muted-foreground">标题</p>
                        <p className="text-sm font-medium text-foreground">{aiResult.title}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">摘要</p>
                        <p className="text-sm text-card-foreground">{aiResult.summary}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">推荐标签</p>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {aiResult.tags.map((t) => (
                            <span key={t} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">{t}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">章节结构</p>
                        <div className="space-y-1 mt-1">
                          {aiResult.sections.map((s, i) => (
                            <p key={s} className="text-sm text-card-foreground">{i + 1}. {s}</p>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
                <div className="mt-6 flex justify-between">
                  <button onClick={() => setStep(0)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4" /> 上一步
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    下一步 <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-display font-semibold text-lg text-foreground mb-4">编辑完善 & 发布</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">标题</label>
                    <input
                      defaultValue={aiResult?.title || title}
                      className="w-full px-4 py-2.5 rounded-lg bg-card border border-input text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">摘要</label>
                    <textarea
                      defaultValue={aiResult?.summary || ""}
                      className="w-full px-4 py-3 rounded-lg bg-card border border-input text-sm text-foreground outline-none focus:ring-2 focus:ring-ring min-h-[80px] resize-y"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">正文</label>
                    <textarea
                      placeholder="在此编辑案例正文内容..."
                      className="w-full px-4 py-3 rounded-lg bg-card border border-input text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring min-h-[300px] resize-y"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-foreground mb-1 block">领域</label>
                      <select className="w-full px-4 py-2.5 rounded-lg bg-card border border-input text-sm text-foreground outline-none">
                        <option>AI 与大模型</option>
                        <option>项目管理</option>
                        <option>数据与架构</option>
                        <option>设计与体验</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium text-foreground mb-1 block">可见范围</label>
                      <select className="w-full px-4 py-2.5 rounded-lg bg-card border border-input text-sm text-foreground outline-none">
                        <option>全公司可见</option>
                        <option>部门可见</option>
                        <option>仅自己可见</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-between">
                  <button onClick={() => setStep(1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4" /> 上一步
                  </button>
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg ai-gradient-bg text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                    <Send className="w-4 h-4" /> 发布案例
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* AI Copilot panel */}
        <aside className="w-72 shrink-0 border-l border-border p-5 hidden xl:block sticky top-0 h-screen overflow-y-auto">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="font-display font-semibold text-sm ai-gradient-text">AI Copilot</h3>
          </div>
          <div className="space-y-3">
            {[
              { icon: <Wand2 className="w-4 h-4" />, label: "润色文字", desc: "优化表达，提升可读性" },
              { icon: <FileText className="w-4 h-4" />, label: "生成摘要", desc: "一键生成案例摘要" },
              { icon: <Tag className="w-4 h-4" />, label: "推荐标签", desc: "智能推荐相关标签" },
              { icon: <Eye className="w-4 h-4" />, label: "预览效果", desc: "查看案例发布预览" },
            ].map((tool) => (
              <button
                key={tool.label}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-primary/10 transition-colors text-left"
              >
                <div className="text-primary">{tool.icon}</div>
                <div>
                  <p className="text-sm font-medium text-foreground">{tool.label}</p>
                  <p className="text-xs text-muted-foreground">{tool.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-lg bg-secondary">
            <p className="text-xs text-muted-foreground mb-2">AI 助手</p>
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-card text-sm text-card-foreground">
                👋 你好！我可以帮你把零散经验快速整理成结构化案例。试试上面的工具吧！
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <input
                placeholder="问我任何问题..."
                className="flex-1 px-3 py-2 rounded-lg bg-card border border-input text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
              <button className="p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </AppLayout>
  );
};

export default KnowledgeExtract;
