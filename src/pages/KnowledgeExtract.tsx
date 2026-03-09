import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Send, FileText, Tag, Upload, Link2, ClipboardPaste,
  X, File, CheckCircle2, Plus, Search, Loader2, Save, Zap,
  Mic, Video, GitBranch, BarChart3, Globe, ArrowRight, HardDrive,
  ChevronLeft, Edit3, BookOpen, Wand2, MessageSquare, FileUp,
  Check, RotateCcw
} from "lucide-react";
import AppLayout from "@/components/AppLayout";

/* ───── Types ───── */
interface Source {
  id: string;
  name: string;
  type: "file" | "url" | "text" | "case";
  status: "ready" | "processing" | "analyzing";
  selected: boolean;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
}

interface ToolOption {
  id: string;
  label: string;
  desc: string;
  icon: typeof FileText;
  checked: boolean;
  color: string;
}

type AppMode = "select" | "workspace" | "generating" | "result" | "quick-upload" | "quick-extract";
type ExtractMode = "quick" | "deep";

/* ───── Mock Content ───── */
const GENERATED_DOC = `# Q3季度研发效能提升专项总结

## 📋 概述
本报告基于上传的研发效能报告和项目复盘会议纪要，结合 AI 深度分析生成。涵盖项目背景、实施过程、核心成果与经验反思。

---

## 1. 项目背景与目标

### 1.1 业务挑战
随着业务规模快速扩张，研发团队面临交付周期长、质量不稳定、跨部门协作低效等核心痛点。季度初的内部调研显示，超过 72% 的开发者认为现有流程存在明显瓶颈。

### 1.2 目标设定
- 发布周期缩短 30% 以上
- 代码覆盖率提升至 80%+
- 需求交付率提升至 90%+

## 2. 解决方案设计

### 2.1 技术选型
采用 Jenkins + GitLab CI 构建自动化流水线，引入 SonarQube 进行代码质量管控。经过对比评估 3 种方案后，选择了渐进式迁移策略。

### 2.2 流程重构
推行 Scrum + Kanban 混合敏捷模式，建立每日站会和 Sprint Review 机制。

## 3. 实施成果

| 指标 | 改进前 | 改进后 | 变化幅度 |
|------|--------|--------|----------|
| 发布周期 | 14天 | 8.4天 | ↓ 40% |
| Bug修复时长 | 48h | 12h | ↓ 75% |
| 代码覆盖率 | 45% | 82% | ↑ 82% |
| 需求交付率 | 65% | 91% | ↑ 40% |

## 4. 经验与反思

### 4.1 关键成功因素
1. 高层支持与资源保障
2. 渐进式推进，避免一刀切
3. 数据驱动的持续优化

### 4.2 踩坑总结
- 初期自动化测试覆盖率目标设定过高，导致团队抵触
- 跨部门协作需要明确的接口人机制

---

## 🧠 思维导图

\`\`\`
研发效能提升
├── 流程优化
│   ├── CI/CD 流水线搭建
│   ├── 代码质量管控 (SonarQube)
│   └── 自动化测试体系
├── 团队协作
│   ├── Scrum + Kanban
│   ├── 每日站会 & Sprint Review
│   └── 跨部门接口人机制
└── 度量体系
    ├── 发布频率 & 前置时间
    ├── 代码覆盖率 & Bug 密度
    └── 需求交付率
\`\`\`

---

## ⚡ 知识闪卡

**卡片 1** — DevOps 核心原则
> Q: DevOps 的三大支柱是什么？
> A: 文化（Culture）、自动化（Automation）、度量（Measurement）

**卡片 2** — 关键指标
> Q: 项目发布周期改进了多少？
> A: 从 14 天缩短至 8.4 天，缩短了 40%

**卡片 3** — 方法论
> Q: 项目采用了什么敏捷框架？
> A: Scrum + Kanban 混合模式

**卡片 4** — 代码质量
> Q: 代码覆盖率提升了多少？
> A: 从 45% 提升到 82%

---

## 🏷️ 推荐标签
研发效能 · DevOps · 自动化测试 · 流程优化 · CI/CD · 敏捷开发`;

const SOCRATIC_RESPONSES = [
  "你提到了这个做法很有效，能具体说说**当时是什么契机**让你决定采用这种方式的吗？背后的思考过程是什么？",
  "这个经验很有价值。我想深入了解一下，在实施过程中**你遇到的最大阻力**是什么？你是如何克服的？",
  "你刚才提到的这个方法论很独到。如果让你**给刚入行的同事一个建议**，你会怎么总结这个经验的核心？",
  "非常好的观点！那在这个过程中，有没有什么**你事后觉得可以做得更好**的地方？",
  "我注意到你的描述中隐含了一个很重要的决策点。能聊聊**当时有哪些备选方案**，为什么最终选择了这个方向？",
  "这个经验背后的**底层逻辑**是什么？你觉得它可以迁移到其他类似的场景中吗？",
];

const QUICK_RESPONSES = [
  "已收到你的补充信息！我正在将其与文件内容进行交叉分析，更新后的内容将体现在最终文档中。\n\n还有什么需要补充的吗？或者你可以直接点击右侧的「开始生成」。",
  "好的，这个信息很有价值。我会在生成报告时重点突出这部分内容。\n\n如果准备好了，可以选择右侧的工具后点击生成。",
  "明白了，这为报告增加了很好的上下文。我已经记录下来。\n\n你可以继续补充，或者选好工具后直接生成文档。",
];

/* ───── Component ───── */
const KnowledgeExtract = () => {
  const [appMode, setAppMode] = useState<AppMode>("select");
  const [extractMode, setExtractMode] = useState<ExtractMode>("quick");

  const [sources, setSources] = useState<Source[]>([
    { id: "1", name: "Q3季度研发效能报告.pdf", type: "file", status: "ready", selected: true },
    { id: "2", name: "项目复盘会议纪要.docx", type: "file", status: "ready", selected: true },
    { id: "3", name: "DevOps最佳实践指南.md", type: "file", status: "ready", selected: false },
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [showAddSource, setShowAddSource] = useState(false);
  const [quickTitle, setQuickTitle] = useState("Q3季度研发效能提升专项总结");
  const [quickStep, setQuickStep] = useState(0); // 0=extracting, 1=naming
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [webSearchQuery, setWebSearchQuery] = useState("");
  const [socraticIndex, setSocraticIndex] = useState(0);
  const [quickIndex, setQuickIndex] = useState(0);
  const [generatingProgress, setGeneratingProgress] = useState(0);
  const [resultContent, setResultContent] = useState(GENERATED_DOC);
  const [isEditing, setIsEditing] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [tools, setTools] = useState<ToolOption[]>([
    { id: "report", label: "结构化报告", desc: "按章节组织的完整文档", icon: FileText, checked: true, color: "text-blue-600 bg-blue-50 border-blue-200" },
    { id: "mindmap", label: "思维导图", desc: "知识脉络可视化", icon: GitBranch, checked: true, color: "text-green-600 bg-green-50 border-green-200" },
    { id: "flashcard", label: "知识闪卡", desc: "核心知识点速记卡", icon: Zap, checked: false, color: "text-amber-600 bg-amber-50 border-amber-200" },
    { id: "data", label: "数据图表", desc: "关键指标可视化", icon: BarChart3, checked: false, color: "text-rose-600 bg-rose-50 border-rose-200" },
    { id: "audio", label: "音频概览", desc: "语音版内容摘要", icon: Mic, checked: false, color: "text-orange-600 bg-orange-50 border-orange-200" },
    { id: "video", label: "视频概览", desc: "视频版知识讲解", icon: Video, checked: false, color: "text-purple-600 bg-purple-50 border-purple-200" },
  ]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  /* ───── Mode entry ───── */
  const enterWorkspace = (mode: ExtractMode) => {
    setExtractMode(mode);
    if (mode === "quick") {
      setAppMode("quick-upload");
      return;
    }
    setAppMode("workspace");
    const welcome: ChatMessage = { id: "1", role: "assistant", content: "你好！我将通过苏格拉底式提问来帮你挖掘**隐性知识** 🧠\n\n我已解析了你的文件，首先想问：\n\n在推动这个研发效能项目时，**最初的动机是什么**？是来自上级要求，还是你自己观察到了某些痛点？" };
    setChatMessages([
      { id: "sys", role: "system", content: `已自动解析 ${sources.filter(s => s.selected).length} 个来源文件` },
      welcome,
    ]);
  };

  /* ───── Source management ───── */
  const addSource = (type: Source["type"], name: string) => {
    const newSource: Source = { id: Date.now().toString(), name, type, status: "analyzing", selected: true };
    setSources(prev => [...prev, newSource]);
    setShowAddSource(false);
    setChatMessages(prev => [...prev, { id: `sys-${Date.now()}`, role: "system", content: `正在解析新来源：${name}...` }]);
    setTimeout(() => {
      setSources(prev => prev.map(s => s.id === newSource.id ? { ...s, status: "ready" } : s));
      setChatMessages(prev => [...prev, { id: `ai-${Date.now()}`, role: "assistant", content: `✅ 已完成「${name}」的解析，新增内容已纳入分析范围。` }]);
    }, 2000);
  };

  const toggleSource = (id: string) => setSources(prev => prev.map(s => s.id === id ? { ...s, selected: !s.selected } : s));
  const removeSource = (id: string) => setSources(prev => prev.filter(s => s.id !== id));
  const toggleTool = (id: string) => setTools(prev => prev.map(t => t.id === id ? { ...t, checked: !t.checked } : t));

  /* ───── Chat ───── */
  const handleSend = () => {
    if (!chatInput.trim() || isAiTyping) return;
    setChatMessages(prev => [...prev, { id: Date.now().toString(), role: "user", content: chatInput }]);
    setChatInput("");
    setIsAiTyping(true);

    setTimeout(() => {
      let response: string;
      if (extractMode === "deep") {
        response = SOCRATIC_RESPONSES[socraticIndex % SOCRATIC_RESPONSES.length];
        setSocraticIndex(prev => prev + 1);
        response += "\n\n> 💡 你的每一次回答都在帮助我构建更完整的知识体系。";
      } else {
        response = QUICK_RESPONSES[quickIndex % QUICK_RESPONSES.length];
        setQuickIndex(prev => prev + 1);
      }
      setChatMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: response }]);
      setIsAiTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (text: string) => {
    setChatInput(text);
    setTimeout(() => {
      setChatMessages(prev => [...prev, { id: Date.now().toString(), role: "user", content: text }]);
      setChatInput("");
      setIsAiTyping(true);
      setTimeout(() => {
        const deepMap: Record<string, string> = {
          "继续追问我": "好的，让我继续挖掘。\n\n你在刚才提到了团队协作——**你认为跨部门沟通中最容易被忽视的环节是什么？**",
          "总结我的隐性知识": "## 🧠 隐性知识萃取总结\n\n1. **决策直觉**：倾向于「先小范围试点，再逐步推广」\n2. **团队管理**：「数据说话」比「行政命令」更能推动变革\n3. **风险感知**：能提前识别软性风险并渐进式化解\n4. **方法论迁移**：善于将成功经验抽象后跨场景应用\n\n> 准备好后可以选择工具并开始生成文档。",
        };
        const quickMap: Record<string, string> = {
          "帮我提炼核心观点": "## 📌 核心观点\n\n1. DevOps 流水线是效能提升的关键基础设施\n2. 渐进式推进比一刀切更适合组织变革\n3. 数据驱动是持续优化的核心方法论\n4. 跨部门协作需要明确的机制保障\n\n准备好后请选择右侧工具并点击生成。",
          "补充背景信息": "好的，请告诉我更多关于项目的背景信息，比如：\n\n- 项目的时间跨度\n- 参与的团队和人数\n- 面临的主要挑战\n\n这些信息会让生成的文档更加完整。",
        };
        const map = extractMode === "deep" ? deepMap : quickMap;
        const response = map[text] || (extractMode === "deep" ? SOCRATIC_RESPONSES[socraticIndex % SOCRATIC_RESPONSES.length] : QUICK_RESPONSES[quickIndex % QUICK_RESPONSES.length]);
        setChatMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: response }]);
        setIsAiTyping(false);
      }, 1500);
    }, 100);
  };

  /* ───── Generation ───── */
  const startGeneration = () => {
    setAppMode("generating");
    setGeneratingProgress(0);
    const selectedTools = tools.filter(t => t.checked);
    const totalSteps = selectedTools.length * 3;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setGeneratingProgress(Math.min((step / totalSteps) * 100, 100));
      if (step >= totalSteps) {
        clearInterval(interval);
        setTimeout(() => setAppMode("result"), 600);
      }
    }, 400);
  };

  const selectedCount = sources.filter(s => s.selected).length;
  const checkedTools = tools.filter(t => t.checked);

  /* ═══════ RENDER ═══════ */

  // ───── Step 1: Mode Selection ─────
  if (appMode === "select") {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[calc(100vh-56px)] bg-background">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl px-6"
          >
            <div className="text-center mb-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5"
              >
                <Sparkles className="w-8 h-8 text-primary" />
              </motion.div>
              <h1 className="text-2xl font-bold text-foreground mb-2">开始知识萃取</h1>
              <p className="text-muted-foreground">选择萃取模式，开启你的知识沉淀之旅</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Quick Mode */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => enterWorkspace("quick")}
                className="group relative p-6 rounded-2xl border-2 border-border bg-card text-left hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileUp className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1.5">快速提炼</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  上传文档，AI 自动分析提炼，快速生成结构化报告
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {["自动分析", "快速生成", "文档提炼"].map(t => (
                    <span key={t} className="px-2 py-0.5 rounded-md bg-accent text-xs text-muted-foreground">{t}</span>
                  ))}
                </div>
                <ArrowRight className="absolute right-5 top-6 w-5 h-5 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </motion.button>

              {/* Deep Mode */}
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => enterWorkspace("deep")}
                className="group relative p-6 rounded-2xl border-2 border-border bg-card text-left hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1.5">深度萃取</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  AI 苏格拉底式追问，深度挖掘你的隐性知识与经验
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {["深度追问", "隐性知识", "经验萃取"].map(t => (
                    <span key={t} className="px-2 py-0.5 rounded-md bg-accent text-xs text-muted-foreground">{t}</span>
                  ))}
                </div>
                <ArrowRight className="absolute right-5 top-6 w-5 h-5 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </AppLayout>
    );
  }

  // ───── Generating Animation ─────
  if (appMode === "generating") {
    const currentToolIdx = Math.floor((generatingProgress / 100) * checkedTools.length);
    const currentTool = checkedTools[Math.min(currentToolIdx, checkedTools.length - 1)];
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[calc(100vh-56px)] bg-background">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md text-center px-6"
          >
            {/* Spinning icon */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8"
            >
              <Wand2 className="w-10 h-10 text-primary" />
            </motion.div>

            <h2 className="text-xl font-bold text-foreground mb-2">AI 正在生成文档</h2>
            <p className="text-sm text-muted-foreground mb-8">
              结合 {selectedCount} 个来源文件{extractMode === "deep" ? "和对话内容" : ""}，使用 {checkedTools.length} 个工具生成
            </p>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-accent overflow-hidden mb-4">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: `${generatingProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Current step */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              {currentTool && (
                <motion.span
                  key={currentTool.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                  正在生成：{currentTool.label}...
                </motion.span>
              )}
            </div>

            {/* Tool badges */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {checkedTools.map((tool, i) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0.3 }}
                  animate={{
                    opacity: i <= currentToolIdx ? 1 : 0.3,
                    scale: i === currentToolIdx ? 1.1 : 1,
                  }}
                  className={`p-2 rounded-lg border ${tool.color}`}
                >
                  <tool.icon className="w-4 h-4" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </AppLayout>
    );
  }

  // ───── Result Page (Edit & Publish) ─────
  if (appMode === "result") {
    return (
      <AppLayout>
        <div className="flex flex-col h-[calc(100vh-56px)] bg-background">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-6 py-3 border-b border-border flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => setAppMode("workspace")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> 返回继续编辑
              </button>
              <div className="w-px h-5 bg-border" />
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">文档已生成</span>
              </div>
              <div className="flex gap-1.5 ml-2">
                {checkedTools.map(tool => (
                  <span key={tool.id} className={`px-2 py-0.5 rounded-md text-xs border ${tool.color}`}>
                    {tool.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  isEditing ? "bg-primary text-primary-foreground" : "border border-border hover:bg-accent text-foreground"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                {isEditing ? "编辑中" : "编辑"}
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                <Save className="w-3.5 h-3.5" /> 保存草稿
              </button>
              <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
                <Send className="w-3.5 h-3.5" /> 确认发布
              </button>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 overflow-y-auto"
          >
            <div className="max-w-3xl mx-auto py-8 px-6">
              {isEditing ? (
                <textarea
                  value={resultContent}
                  onChange={(e) => setResultContent(e.target.value)}
                  className="w-full min-h-[70vh] bg-transparent text-sm text-foreground leading-relaxed outline-none resize-none font-mono"
                />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-1"
                >
                  {resultContent.split("\n").map((line, i) => {
                    if (line.startsWith("# ")) return <h1 key={i} className="text-2xl font-bold text-foreground mt-8 mb-4">{line.slice(2)}</h1>;
                    if (line.startsWith("## ")) return <h2 key={i} className="text-xl font-semibold text-foreground mt-6 mb-3 flex items-center gap-2">{line.slice(3)}</h2>;
                    if (line.startsWith("### ")) return <h3 key={i} className="text-base font-medium text-foreground mt-4 mb-2">{line.slice(4)}</h3>;
                    if (line.startsWith("---")) return <hr key={i} className="border-border my-6" />;
                    if (line.startsWith("- ")) return <li key={i} className="text-sm text-foreground ml-4 mb-1.5 list-disc">{line.slice(2)}</li>;
                    if (line.startsWith("> ")) return <blockquote key={i} className="text-sm text-muted-foreground border-l-2 border-primary/30 pl-3 my-1 italic">{line.slice(2)}</blockquote>;
                    if (line.startsWith("```")) return <div key={i} className="text-xs text-muted-foreground font-mono" />;
                    if (line.startsWith("|")) return <p key={i} className="text-sm text-foreground font-mono bg-accent/50 px-3 py-1 rounded">{line}</p>;
                    if (line.startsWith("**") && line.includes("**")) return <p key={i} className="text-sm font-semibold text-foreground mb-1">{line.replace(/\*\*/g, "")}</p>;
                    if (line.trim() === "") return <div key={i} className="h-2" />;
                    return <p key={i} className="text-sm text-foreground leading-relaxed">{line}</p>;
                  })}
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </AppLayout>
    );
  }

  // ───── Workspace (3-column) ─────
  const suggestions = extractMode === "deep"
    ? [{ emoji: "🧠", text: "继续追问我" }, { emoji: "📝", text: "总结我的隐性知识" }]
    : [{ emoji: "📌", text: "帮我提炼核心观点" }, { emoji: "💬", text: "补充背景信息" }];

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-56px)] relative">
        {/* ═══ Left: Sources ═══ */}
        <aside className="w-[272px] shrink-0 border-r border-border flex flex-col bg-muted/30">
          <div className="px-4 pt-4 pb-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-foreground">来源</h3>
                <span className="px-1.5 py-0.5 rounded bg-accent text-xs text-muted-foreground">{sources.length}</span>
              </div>
              <button onClick={() => setShowAddSource(true)} className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-primary transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-sm shadow-sm">
              <Search className="w-3.5 h-3.5 text-muted-foreground" />
              <input placeholder="搜索来源..." className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1.5">
            {sources.map((source) => (
              <motion.div
                key={source.id}
                layout
                className={`flex items-center gap-2.5 px-3 py-3 rounded-xl border group transition-all cursor-pointer ${
                  source.selected ? "bg-card border-primary/20 shadow-sm" : "bg-card/50 border-border hover:border-border"
                }`}
                onClick={() => toggleSource(source.id)}
              >
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                  source.selected ? "bg-primary border-primary" : "border-muted-foreground/30"
                }`}>
                  {source.selected && <CheckCircle2 className="w-3 h-3 text-primary-foreground" />}
                </div>
                <File className={`w-4 h-4 shrink-0 ${source.selected ? "text-primary" : "text-muted-foreground"}`} />
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-foreground truncate block">{source.name}</span>
                  {source.status === "analyzing" && (
                    <span className="text-xs text-primary flex items-center gap-1 mt-0.5"><Loader2 className="w-3 h-3 animate-spin" /> 解析中...</span>
                  )}
                </div>
                <button onClick={(e) => { e.stopPropagation(); removeSource(source.id); }} className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-accent text-muted-foreground transition-all">
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </div>

          <div className="px-4 py-3 border-t border-border">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>已选中 {selectedCount} / {sources.length}</span>
              <button onClick={() => setSources(prev => prev.map(s => ({ ...s, selected: true })))} className="text-primary hover:underline">全选</button>
            </div>
          </div>
        </aside>

        {/* ═══ Center: Chat ═══ */}
        <div className="flex-1 min-w-0 flex flex-col bg-background">
          <div className="px-6 py-3 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <span className="font-semibold text-sm text-foreground">AI 知识萃取助手</span>
                <p className="text-xs text-muted-foreground">
                  {extractMode === "deep" ? "深度萃取 · 苏格拉底式追问" : "快速提炼 · 自动分析"} · {selectedCount} 个来源
                </p>
              </div>
            </div>
            <button
              onClick={() => { setAppMode("select"); setChatMessages([]); }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> 切换模式
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {chatMessages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex ${msg.role === "user" ? "justify-end" : msg.role === "system" ? "justify-center" : "justify-start"}`}
              >
                {msg.role === "system" ? (
                  <div className="px-3 py-1.5 rounded-full bg-accent text-xs text-muted-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-primary" />{msg.content}
                  </div>
                ) : (
                  <div className="flex gap-2.5 max-w-[85%]">
                    {msg.role === "assistant" && (
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                      </div>
                    )}
                    <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-accent/80 text-foreground border border-border/50 rounded-bl-md shadow-sm"
                    }`}>{msg.content}</div>
                  </div>
                )}
              </motion.div>
            ))}
            {isAiTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><Sparkles className="w-3.5 h-3.5 text-primary" /></div>
                <div className="rounded-2xl rounded-bl-md px-4 py-3 bg-accent/80 border border-border/50 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="px-6 pb-3">
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button key={s.text} onClick={() => handleSuggestionClick(s.text)} disabled={isAiTyping}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card text-xs text-foreground hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm transition-all disabled:opacity-50 shadow-sm">
                  <span>{s.emoji}</span>{s.text}
                </button>
              ))}
            </div>
          </div>

          <div className="px-6 pb-5">
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-border bg-card shadow-sm focus-within:border-primary/40 focus-within:shadow-md transition-all">
              <input
                value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder={extractMode === "deep" ? "分享你的经验，AI 会通过追问帮你挖掘隐性知识..." : "补充信息或直接选择工具生成文档..."}
                disabled={isAiTyping}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none disabled:opacity-50"
              />
              <button onClick={handleSend} disabled={!chatInput.trim() || isAiTyping}
                className="p-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-30 shadow-sm">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ═══ Right: Tool Picker ═══ */}
        <aside className="w-[260px] shrink-0 border-l border-border flex flex-col bg-muted/30">
          <div className="px-4 pt-4 pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-foreground">生成工具</h3>
              <span className="px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-medium">{checkedTools.length} 已选</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">选择要包含在文档中的内容类型</p>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {tools.map((tool) => (
              <motion.button
                key={tool.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleTool(tool.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                  tool.checked
                    ? `${tool.color} shadow-sm`
                    : "bg-card border-border hover:border-primary/30"
                }`}
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                  tool.checked ? "bg-primary border-primary" : "border-muted-foreground/30"
                }`}>
                  {tool.checked && <Check className="w-3 h-3 text-primary-foreground" />}
                </div>
                <tool.icon className="w-4 h-4 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium block">{tool.label}</span>
                  <span className="text-[10px] text-muted-foreground">{tool.desc}</span>
                </div>
              </motion.button>
            ))}

            {/* Tags section */}
            <div className="mt-3 p-3 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium text-foreground">推荐标签</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["研发效能", "DevOps", "自动化测试", "流程优化", "CI/CD"].map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs">{tag}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3 border-t border-border space-y-2">
            <button
              onClick={startGeneration}
              disabled={checkedTools.length === 0}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
            >
              <Wand2 className="w-4 h-4" /> 开始生成（{checkedTools.length} 项）
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors">
              <Save className="w-4 h-4" /> 保存草稿
            </button>
          </div>
        </aside>

        {/* ═══ Add Source Modal ═══ */}
        <AnimatePresence>
          {showAddSource && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-foreground/40"
              onClick={() => setShowAddSource(false)}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                className="w-full max-w-[600px] bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
                onClick={(e) => e.stopPropagation()}>
                <div className="relative px-8 pt-8 pb-4 text-center">
                  <button onClick={() => setShowAddSource(false)} className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-accent text-muted-foreground transition-colors"><X className="w-5 h-5" /></button>
                  <h2 className="text-xl font-semibold text-foreground">添加知识来源</h2>
                  <p className="text-sm text-primary mt-1">从你的文档中萃取知识</p>
                </div>
                <div className="px-8 pb-4">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-background">
                    <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                    <input value={webSearchQuery} onChange={(e) => setWebSearchQuery(e.target.value)} placeholder="搜索网络上的新知识来源" className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent text-xs text-muted-foreground"><Globe className="w-3 h-3" /> Web</span>
                      <button className="p-1.5 rounded-full bg-muted hover:bg-accent transition-colors"><ArrowRight className="w-4 h-4 text-muted-foreground" /></button>
                    </div>
                  </div>
                </div>
                <div className="px-8 pb-6">
                  <div className="border-2 border-dashed border-border rounded-xl p-10 text-center hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer">
                    <p className="text-base text-muted-foreground font-medium">或拖放你的文件到这里</p>
                    <p className="text-sm text-muted-foreground/70 mt-1">pdf, images, docs, audio, and more</p>
                  </div>
                </div>
                <div className="px-8 pb-8 grid grid-cols-4 gap-3">
                  {[
                    { icon: Upload, label: "上传文件", type: "file" as const, name: `文档_${sources.length + 1}.pdf` },
                    { icon: Link2, label: "网页链接", type: "url" as const, name: "https://wiki.company.com" },
                    { icon: HardDrive, label: "云盘", type: "file" as const, name: "云盘文档.pdf" },
                    { icon: ClipboardPaste, label: "粘贴文本", type: "text" as const, name: "粘贴的笔记" },
                  ].map(opt => (
                    <button key={opt.label} onClick={() => addSource(opt.type, opt.name)} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border bg-background text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all">
                      <opt.icon className="w-4 h-4" />{opt.label}
                    </button>
                  ))}
                </div>
                <div className="px-8 pb-6">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <div className="h-1.5 flex-1 rounded-full bg-accent overflow-hidden mr-3">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(sources.length / 300) * 100}%` }} />
                    </div>
                    <span>{sources.length} / 300</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
};

export default KnowledgeExtract;
