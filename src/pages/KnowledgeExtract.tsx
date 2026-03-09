import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, ArrowRight, ArrowLeft, FileText, Tag, Send, Wand2,
  CheckCircle2, Upload, Link2, ClipboardPaste, Search, Globe, Zap,
  X, File, ChevronDown
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { CASE_CATEGORIES } from "@/data/mockData";

interface Source {
  id: string;
  name: string;
  type: "file" | "url" | "text";
  status: "ready" | "processing";
}

const KnowledgeExtract = () => {
  const [sources, setSources] = useState<Source[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showWizard, setShowWizard] = useState(false);
  const [step, setStep] = useState(0);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<{
    title: string; summary: string; tags: string[]; sections: string[];
  } | null>(null);

  const STEPS = ["选择类型", "输入信息", "编辑发布"];

  const addSource = useCallback((type: Source["type"], name: string) => {
    const newSource: Source = {
      id: Date.now().toString(),
      name,
      type,
      status: "processing",
    };
    setSources(prev => [...prev, newSource]);
    setTimeout(() => {
      setSources(prev => prev.map(s => s.id === newSource.id ? { ...s, status: "ready" } : s));
    }, 1500);
  }, []);

  const removeSource = (id: string) => {
    setSources(prev => prev.filter(s => s.id !== id));
  };

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

  const handleStartExtract = () => {
    setShowWizard(true);
    setStep(0);
  };

  // NotebookLM-style landing when no wizard
  if (!showWizard) {
    return (
      <AppLayout>
        <div className="flex-1 min-w-0 flex flex-col items-center justify-start pt-12 px-6 pb-12">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto mb-10"
          >
            <h1 className="text-3xl font-semibold text-foreground mb-2">
              AI 知识萃取
            </h1>
            <p className="text-base text-muted-foreground">
              从<span className="text-primary font-medium">你的素材</span>中提炼结构化知识案例
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full max-w-2xl mb-6"
          >
            <div className="card-base px-4 py-3 flex items-center gap-3">
              <Search className="w-5 h-5 text-muted-foreground shrink-0" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索已有知识或输入主题..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
              <div className="flex items-center gap-2 shrink-0">
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs text-muted-foreground hover:bg-accent transition-colors">
                  <Globe className="w-3.5 h-3.5" /> 知识库
                  <ChevronDown className="w-3 h-3" />
                </button>
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs text-muted-foreground hover:bg-accent transition-colors">
                  <Zap className="w-3.5 h-3.5" /> 快速萃取
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
              <button className="w-8 h-8 rounded-full bg-accent flex items-center justify-center hover:bg-primary/10 transition-colors">
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </motion.div>

          {/* Upload area */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-2xl"
          >
            <div className="rounded-xl border-2 border-dashed border-border bg-secondary/30 p-10 flex flex-col items-center justify-center min-h-[240px]">
              {sources.length === 0 ? (
                <>
                  <p className="text-base text-foreground mb-1">拖拽素材到此处</p>
                  <p className="text-sm text-muted-foreground mb-8">
                    文档、笔记、会议纪要、项目总结…
                    <button className="text-primary hover:underline ml-1">支持格式</button>
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => addSource("file", "项目总结文档.docx")}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-card text-sm text-foreground hover:border-primary/40 hover:bg-accent transition-all"
                    >
                      <Upload className="w-4 h-4" /> 上传文件
                    </button>
                    <button
                      onClick={() => addSource("url", "https://wiki.company.com/project-review")}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-card text-sm text-foreground hover:border-primary/40 hover:bg-accent transition-all"
                    >
                      <Link2 className="w-4 h-4" /> 网页链接
                    </button>
                    <button
                      onClick={() => addSource("text", "粘贴的经验笔记")}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-card text-sm text-foreground hover:border-primary/40 hover:bg-accent transition-all"
                    >
                      <ClipboardPaste className="w-4 h-4" /> 粘贴文本
                    </button>
                  </div>
                </>
              ) : (
                <div className="w-full space-y-2">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-foreground">
                      已添加 {sources.length} 个素材
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => addSource("file", `素材_${sources.length + 1}.pdf`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs text-muted-foreground hover:bg-accent transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" /> 添加更多
                      </button>
                    </div>
                  </div>
                  {sources.map((source) => (
                    <div
                      key={source.id}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg bg-card border border-border"
                    >
                      <File className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-sm text-foreground flex-1 truncate">{source.name}</span>
                      {source.status === "processing" ? (
                        <span className="text-xs text-muted-foreground animate-pulse">处理中...</span>
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      )}
                      <button
                        onClick={() => removeSource(source.id)}
                        className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Progress bar */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{sources.length} / 300</span>
            </div>
          </motion.div>

          {/* Start button */}
          {sources.length > 0 && sources.every(s => s.status === "ready") && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <button
                onClick={handleStartExtract}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
              >
                <Sparkles className="w-4 h-4" /> 开始萃取
              </button>
            </motion.div>
          )}
        </div>
      </AppLayout>
    );
  }

  // 3-step wizard
  return (
    <AppLayout>
      <div className="flex">
        <div className="flex-1 min-w-0 p-6 max-w-3xl">
          <div className="flex items-center gap-3 mb-1">
            <button
              onClick={() => setShowWizard(false)}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> 返回
            </button>
          </div>
          <h1 className="text-xl font-semibold text-foreground mb-1 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI 知识萃取
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            素材已就绪，{sources.length} 个来源 · 开始结构化整理
          </p>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                  i <= step ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground"
                }`}>
                  {i < step ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span className={`text-sm ${i <= step ? "text-foreground font-medium" : "text-muted-foreground"}`}>{s}</span>
                {i < STEPS.length - 1 && <div className={`w-10 h-px ${i < step ? "bg-primary" : "bg-border"}`} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                <h2 className="font-semibold text-base text-foreground mb-4">选择沉淀类型</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CASE_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedType(cat)}
                      className={`card-base p-4 text-left transition-all ${
                        selectedType === cat ? "border-primary bg-primary/5" : ""
                      }`}
                    >
                      <p className="font-medium text-foreground text-sm">{cat}</p>
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
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-40 hover:bg-primary/90 transition-colors"
                  >
                    下一步 <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                <h2 className="font-semibold text-base text-foreground mb-4">输入原始信息</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">标题（可选）</label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="输入案例标题，或留空让 AI 生成"
                      className="w-full px-3 py-2 rounded-lg border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:shadow-[0_0_0_2px_hsl(var(--primary)/0.1)] transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">原始内容 / 经验描述</label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="把你的经验、想法、笔记粘贴到这里，AI 将帮你整理成结构化案例..."
                      className="w-full px-3 py-2.5 rounded-lg border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:shadow-[0_0_0_2px_hsl(var(--primary)/0.1)] transition-all min-h-[180px] resize-y"
                    />
                  </div>
                  <button
                    onClick={handleAIGenerate}
                    disabled={aiGenerating}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
                  >
                    <Wand2 className="w-4 h-4" />
                    {aiGenerating ? "AI 生成中..." : "AI 生成结构"}
                  </button>

                  {aiResult && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-primary/20 bg-primary/5 p-5 space-y-3">
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
                            <span key={t} className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs">{t}</span>
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
                  <button onClick={() => setStep(0)} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="w-4 h-4" /> 上一步
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    下一步 <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                <h2 className="font-semibold text-base text-foreground mb-4">编辑完善 & 发布</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">标题</label>
                    <input
                      defaultValue={aiResult?.title || title}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus:border-primary focus:shadow-[0_0_0_2px_hsl(var(--primary)/0.1)] transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">摘要</label>
                    <textarea
                      defaultValue={aiResult?.summary || ""}
                      className="w-full px-3 py-2.5 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus:border-primary focus:shadow-[0_0_0_2px_hsl(var(--primary)/0.1)] transition-all min-h-[80px] resize-y"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">正文</label>
                    <textarea
                      placeholder="在此编辑案例正文内容..."
                      className="w-full px-3 py-2.5 rounded-lg border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:shadow-[0_0_0_2px_hsl(var(--primary)/0.1)] transition-all min-h-[280px] resize-y"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-foreground mb-1.5 block">领域</label>
                      <select className="w-full px-3 py-2 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus:border-primary transition-all">
                        <option>AI 与大模型</option>
                        <option>项目管理</option>
                        <option>数据与架构</option>
                        <option>设计与体验</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium text-foreground mb-1.5 block">可见范围</label>
                      <select className="w-full px-3 py-2 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus:border-primary transition-all">
                        <option>全公司可见</option>
                        <option>部门可见</option>
                        <option>仅自己可见</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-between">
                  <button onClick={() => setStep(1)} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="w-4 h-4" /> 上一步
                  </button>
                  <button className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                    <Send className="w-4 h-4" /> 发布案例
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* AI Copilot panel */}
        <aside className="w-72 shrink-0 border-l border-border p-5 hidden xl:block sticky top-0 h-screen overflow-y-auto bg-secondary/30">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm text-primary">AI Copilot</h3>
          </div>
          <div className="space-y-2">
            {[
              { icon: <Wand2 className="w-4 h-4" />, label: "润色文字", desc: "优化表达，提升可读性" },
              { icon: <FileText className="w-4 h-4" />, label: "生成摘要", desc: "一键生成案例摘要" },
              { icon: <Tag className="w-4 h-4" />, label: "推荐标签", desc: "智能推荐相关标签" },
            ].map((tool) => (
              <button
                key={tool.label}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors text-left"
              >
                <div className="text-primary">{tool.icon}</div>
                <div>
                  <p className="text-sm font-medium text-foreground">{tool.label}</p>
                  <p className="text-xs text-muted-foreground">{tool.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-lg border border-border bg-card">
            <p className="text-xs text-muted-foreground mb-3">AI 助手</p>
            <div className="p-3 rounded-lg bg-accent text-sm text-foreground">
              👋 你好！我可以帮你把零散经验快速整理成结构化案例。试试上面的工具吧！
            </div>
            <div className="mt-3 flex gap-2">
              <input
                placeholder="问我任何问题..."
                className="flex-1 px-3 py-2 rounded-lg border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-all"
              />
              <button className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
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
