import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Send, FileText, Tag, Upload, Link2, ClipboardPaste,
  X, File, CheckCircle2, Plus, Search, Loader2, Eye, Save, Zap,
  Mic, Video, GitBranch, BarChart3, Globe, ArrowRight, HardDrive,
  ChevronLeft, Edit3, BookOpen
} from "lucide-react";
import AppLayout from "@/components/AppLayout";

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

interface StudioItem {
  id: string;
  type: string;
  label: string;
  icon: typeof FileText;
  status: "idle" | "generating" | "ready";
  preview?: string;
  color: string;
  fullContent?: string;
}

const STUDIO_CONTENTS: Record<string, string> = {
  report: `# Q3季度研发效能提升专项总结

## 1. 项目背景与目标

### 1.1 业务挑战
随着业务规模快速扩张，研发团队面临交付周期长、质量不稳定、跨部门协作低效等核心痛点。

### 1.2 效能痛点分析
- 发布周期平均 14 天，远高于行业标杆
- 代码质量缺乏系统化管控，线上 Bug 率居高不下
- 需求从提出到交付的端到端周期过长

### 1.3 目标设定
- 发布周期缩短 30% 以上
- 代码覆盖率提升至 80%+
- 需求交付率提升至 90%+

## 2. 解决方案设计

### 2.1 技术选型
采用 Jenkins + GitLab CI 构建自动化流水线，引入 SonarQube 进行代码质量管控。

### 2.2 流程重构
推行 Scrum + Kanban 混合敏捷模式，建立每日站会和 Sprint Review 机制。

## 3. 实施成果

| 指标 | 改进前 | 改进后 | 变化幅度 |
|------|--------|--------|----------|
| 发布周期 | 14天 | 8.4天 | -40% |
| Bug修复时长 | 48h | 12h | -75% |
| 代码覆盖率 | 45% | 82% | +82% |
| 需求交付率 | 65% | 91% | +40% |

## 4. 经验与反思

### 4.1 关键成功因素
1. 高层支持与资源保障
2. 渐进式推进，避免一刀切
3. 数据驱动的持续优化

### 4.2 踩坑总结
- 初期自动化测试覆盖率目标设定过高，导致团队抵触
- 跨部门协作需要明确的接口人机制`,
  mindmap: `# 研发效能提升 知识图谱

## 核心节点

### 1. 流程优化
- CI/CD 流水线搭建
  - Jenkins 配置
  - GitLab CI 集成
  - 自动化部署
- 代码质量管控
  - SonarQube 门禁
  - Code Review 规范
  - 单元测试覆盖

### 2. 团队协作
- 敏捷实践
  - Scrum 框架
  - Kanban 看板
  - 每日站会
- 跨部门对齐
  - 需求评审会
  - Sprint Review
  - 接口人机制

### 3. 度量体系
- 效能指标
  - 发布频率
  - 变更前置时间
  - 故障恢复时间
- 质量指标
  - 代码覆盖率
  - Bug 密度
  - 线上故障率`,
  flashcard: `# 知识闪卡

**卡片 1** — DevOps 核心原则
Q: DevOps 的三大支柱是什么？
A: 文化（Culture）、自动化（Automation）、度量（Measurement）

**卡片 2** — CI/CD 区别
Q: 持续集成和持续部署的区别？
A: CI 关注代码合并和自动测试，CD 关注自动化发布到生产环境

**卡片 3** — 关键指标
Q: DORA 四大关键指标是什么？
A: 部署频率、变更前置时间、变更失败率、故障恢复时间

**卡片 4** — 代码覆盖率
Q: 项目代码覆盖率从多少提升到多少？
A: 从 45% 提升到 82%，提升了 82%

**卡片 5** — 敏捷实践
Q: 项目采用了什么敏捷框架？
A: Scrum + Kanban 混合模式`,
};

const SOCRATIC_RESPONSES = [
  "你提到了这个做法很有效，能具体说说**当时是什么契机**让你决定采用这种方式的吗？背后的思考过程是什么？",
  "这个经验很有价值。我想深入了解一下，在实施过程中**你遇到的最大阻力**是什么？你是如何克服的？",
  "你刚才提到的这个方法论很独到。如果让你**给刚入行的同事一个建议**，你会怎么总结这个经验的核心？",
  "非常好的观点！那在这个过程中，有没有什么**你事后觉得可以做得更好**的地方？或者说如果重来一次，你会怎么调整？",
  "我注意到你的描述中隐含了一个很重要的决策点。能聊聊**当时有哪些备选方案**，为什么最终选择了这个方向？",
  "这个经验背后的**底层逻辑**是什么？你觉得它可以迁移到其他类似的场景中吗？",
];

const KnowledgeExtract = () => {
  const [sources, setSources] = useState<Source[]>([
    { id: "1", name: "Q3季度研发效能报告.pdf", type: "file", status: "ready", selected: true },
    { id: "2", name: "项目复盘会议纪要.docx", type: "file", status: "ready", selected: true },
    { id: "3", name: "DevOps最佳实践指南.md", type: "file", status: "ready", selected: false },
  ]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "system",
      content: "已自动解析 2 个来源文件，识别到 3 个核心主题。",
    },
    {
      id: "1",
      role: "assistant",
      content: "你好！我已完成文件解析 📄\n\n我将通过一系列问题来帮你挖掘隐藏在经验中的**隐性知识**。\n\n首先，关于你上传的研发效能报告——你在推动这个项目时，**最初的动机是什么**？是来自上级的要求，还是你自己观察到了某些痛点？",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [showAddSource, setShowAddSource] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [webSearchQuery, setWebSearchQuery] = useState("");
  const [previewItem, setPreviewItem] = useState<StudioItem | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [socraticIndex, setSocraticIndex] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [studioItems, setStudioItems] = useState<StudioItem[]>([
    { id: "report", type: "report", label: "结构化报告", icon: FileText, status: "ready", preview: "Q3研发效能提升专项总结，含4个章节...", color: "bg-blue-50 text-blue-600 border-blue-100", fullContent: STUDIO_CONTENTS.report },
    { id: "mindmap", type: "mindmap", label: "思维导图", icon: GitBranch, status: "ready", preview: "3层知识结构，12个关键节点", color: "bg-green-50 text-green-600 border-green-100", fullContent: STUDIO_CONTENTS.mindmap },
    { id: "flashcard", type: "flashcard", label: "知识闪卡", icon: Zap, status: "generating", color: "bg-amber-50 text-amber-600 border-amber-100" },
    { id: "audio", type: "audio", label: "音频概览", icon: Mic, status: "idle", color: "bg-orange-50 text-orange-600 border-orange-100" },
    { id: "video", type: "video", label: "视频概览", icon: Video, status: "idle", color: "bg-purple-50 text-purple-600 border-purple-100" },
    { id: "data", type: "data", label: "数据报告", icon: BarChart3, status: "idle", color: "bg-rose-50 text-rose-600 border-rose-100" },
  ]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStudioItems(prev => prev.map(item =>
        item.id === "flashcard" ? { ...item, status: "ready" as const, preview: "5张核心知识卡片已生成", fullContent: STUDIO_CONTENTS.flashcard } : item
      ));
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const addSource = (type: Source["type"], name: string) => {
    const newSource: Source = {
      id: Date.now().toString(),
      name,
      type,
      status: "analyzing",
      selected: true,
    };
    setSources(prev => [...prev, newSource]);
    setShowAddSource(false);

    setChatMessages(prev => [...prev, {
      id: `sys-${Date.now()}`,
      role: "system",
      content: `正在解析新来源：${name}...`,
    }]);

    setTimeout(() => {
      setSources(prev => prev.map(s => s.id === newSource.id ? { ...s, status: "ready" } : s));
      setChatMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: `✅ 已完成「${name}」的解析。\n\n基于新增内容，我有一个问题想问你：**这份材料中提到的方法，在你的实际工作中是如何落地的？** 有没有遇到过理论和实践不一致的情况？`,
      }]);
    }, 2000);
  };

  const toggleSource = (id: string) => {
    setSources(prev => prev.map(s => s.id === id ? { ...s, selected: !s.selected } : s));
  };

  const removeSource = (id: string) => {
    setSources(prev => prev.filter(s => s.id !== id));
  };

  const handleSend = () => {
    if (!chatInput.trim() || isAiTyping) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsAiTyping(true);

    setTimeout(() => {
      const response = SOCRATIC_RESPONSES[socraticIndex % SOCRATIC_RESPONSES.length];
      setSocraticIndex(prev => prev + 1);

      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response + "\n\n> 💡 你的每一次回答都在帮助我构建更完整的知识图谱，右侧 Studio 中的产物会实时更新。",
      }]);
      setIsAiTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (text: string) => {
    setChatInput(text);
    setTimeout(() => {
      const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: text };
      setChatMessages(prev => [...prev, userMsg]);
      setChatInput("");
      setIsAiTyping(true);

      setTimeout(() => {
        const responseMap: Record<string, string> = {
          "继续追问我": "好的，让我继续挖掘。\n\n你在刚才的描述中提到了团队协作的问题——**你认为跨部门沟通中最容易被忽视的环节是什么？** 你有没有建立过某种机制来解决信息不对称的问题？",
          "总结我的隐性知识": "## 🧠 隐性知识萃取总结\n\n基于我们的对话，我提取到以下**隐性知识**：\n\n1. **决策直觉**：你在技术选型时倾向于「先小范围试点，再逐步推广」的策略\n2. **团队管理**：你发现「数据说话」比「行政命令」更能推动变革\n3. **风险感知**：你能提前识别「团队抵触」等软性风险，并通过渐进式方式化解\n4. **方法论迁移**：你善于将一个领域的成功经验抽象后应用到其他场景\n\n> 这些已同步到右侧 Studio，正在更新结构化报告。",
          "帮我优化报告结构": "## 📋 报告结构优化建议\n\n基于你分享的隐性知识，我建议调整报告结构：\n\n**新增章节：**\n- 📌 「决策过程与思考」— 记录你在关键节点的思维过程\n- 📌 「隐性经验提炼」— 将对话中挖掘的隐性知识结构化\n- 📌 「情境化建议」— 针对不同场景给出差异化建议\n\n这样报告不仅有数据和结果，更有**可复用的思维框架**。需要我立即更新吗？",
          "生成结构化报告": "## 📝 报告生成中\n\n正在结合你上传的文件和我们的对话内容，生成一份包含**显性数据 + 隐性经验**的完整结构化报告...\n\n> ✅ 已完成，请点击右侧 Studio 的「结构化报告」查看和编辑。",
        };

        const response = responseMap[text] || SOCRATIC_RESPONSES[socraticIndex % SOCRATIC_RESPONSES.length];
        setSocraticIndex(prev => prev + 1);

        setChatMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response,
        }]);
        setIsAiTyping(false);
      }, 1500);
    }, 100);
  };

  const generateStudioItem = (id: string) => {
    setStudioItems(prev => prev.map(item =>
      item.id === id ? { ...item, status: "generating" as const } : item
    ));
    setTimeout(() => {
      setStudioItems(prev => prev.map(item =>
        item.id === id ? { ...item, status: "ready" as const, preview: `已基于 ${sources.filter(s => s.selected).length} 个来源生成`, fullContent: STUDIO_CONTENTS[id] || "# 内容生成完毕\n\n详细内容将在此处展示。" } : item
      ));
    }, 2500);
  };

  const openPreview = (item: StudioItem) => {
    setPreviewItem(item);
    setEditContent(item.fullContent || "");
    setIsEditing(false);
  };

  const selectedCount = sources.filter(s => s.selected).length;

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-56px)] relative">
        {/* ========== Left: Sources panel ========== */}
        <aside className="w-[272px] shrink-0 border-r border-border flex flex-col bg-muted/30">
          <div className="px-4 pt-4 pb-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-foreground">来源</h3>
                <span className="px-1.5 py-0.5 rounded bg-accent text-xs text-muted-foreground">{sources.length}</span>
              </div>
              <button
                onClick={() => setShowAddSource(true)}
                className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-primary transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-sm shadow-sm">
              <Search className="w-3.5 h-3.5 text-muted-foreground" />
              <input
                placeholder="搜索来源..."
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1.5">
            {sources.map((source) => (
              <motion.div
                key={source.id}
                layout
                className={`flex items-center gap-2.5 px-3 py-3 rounded-xl border group transition-all cursor-pointer ${
                  source.selected
                    ? "bg-card border-primary/20 shadow-sm"
                    : "bg-card/50 border-border hover:border-border"
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
                    <span className="text-xs text-primary flex items-center gap-1 mt-0.5">
                      <Loader2 className="w-3 h-3 animate-spin" /> 解析中...
                    </span>
                  )}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeSource(source.id); }}
                  className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-accent text-muted-foreground transition-all"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </div>

          <div className="px-4 py-3 border-t border-border">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>已选中 {selectedCount} / {sources.length}</span>
              <button
                onClick={() => setSources(prev => prev.map(s => ({ ...s, selected: true })))}
                className="text-primary hover:underline"
              >
                全选
              </button>
            </div>
          </div>
        </aside>

        {/* ========== Center: AI Chat ========== */}
        <div className="flex-1 min-w-0 flex flex-col bg-background">
          <div className="px-6 py-3 border-b border-border flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <span className="font-semibold text-sm text-foreground">AI 知识萃取助手</span>
              <p className="text-xs text-muted-foreground">苏格拉底式追问 · 挖掘隐性知识 · 基于 {selectedCount} 个来源</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {chatMessages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : msg.role === "system" ? "justify-center" : "justify-start"
                }`}
              >
                {msg.role === "system" ? (
                  <div className="px-3 py-1.5 rounded-full bg-accent text-xs text-muted-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-primary" />
                    {msg.content}
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
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {isAiTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                </div>
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
              {[
                { emoji: "🧠", text: "继续追问我" },
                { emoji: "📝", text: "总结我的隐性知识" },
                { emoji: "📋", text: "帮我优化报告结构" },
                { emoji: "📄", text: "生成结构化报告" },
              ].map((suggestion) => (
                <button
                  key={suggestion.text}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  disabled={isAiTyping}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card text-xs text-foreground hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm transition-all disabled:opacity-50 shadow-sm"
                >
                  <span>{suggestion.emoji}</span>
                  {suggestion.text}
                </button>
              ))}
            </div>
          </div>

          <div className="px-6 pb-5">
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-border bg-card shadow-sm focus-within:border-primary/40 focus-within:shadow-md transition-all">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder="分享你的经验，AI 会通过追问帮你挖掘隐性知识..."
                disabled={isAiTyping}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!chatInput.trim() || isAiTyping}
                className="p-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-30 shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ========== Right: Studio panel ========== */}
        <aside className="w-[260px] shrink-0 border-l border-border flex flex-col bg-muted/30">
          <div className="px-4 pt-4 pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-foreground">Studio</h3>
              <span className="px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-medium">Beta</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">点击卡片预览 → 编辑 → 发布</p>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            <div className="grid grid-cols-2 gap-2">
              {studioItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (item.status === "ready") openPreview(item);
                    else if (item.status === "idle") generateStudioItem(item.id);
                  }}
                  className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all group ${
                    item.status === "ready"
                      ? `${item.color} border shadow-sm cursor-pointer`
                      : item.status === "generating"
                      ? "bg-card border-primary/20 border-dashed"
                      : "bg-card border-border hover:border-primary/30 hover:shadow-sm"
                  }`}
                >
                  {item.status === "generating" ? (
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  ) : (
                    <item.icon className="w-5 h-5" />
                  )}
                  <span className="text-xs font-medium">{item.label}</span>

                  {item.status === "ready" && (
                    <>
                      <span className="text-[10px] text-muted-foreground line-clamp-1 px-1">{item.preview}</span>
                      <div className="absolute inset-0 rounded-xl bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <div className="p-1.5 rounded-lg bg-card border border-border shadow-sm">
                          <Eye className="w-3.5 h-3.5 text-foreground" />
                        </div>
                      </div>
                    </>
                  )}
                  {item.status === "generating" && (
                    <span className="text-[10px] text-primary">生成中...</span>
                  )}
                  {item.status === "idle" && (
                    <span className="text-[10px] text-muted-foreground">点击生成</span>
                  )}
                </motion.button>
              ))}
            </div>

            <div className="mt-4 p-3 rounded-xl border border-border bg-card">
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
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
              <Send className="w-4 h-4" /> 发布案例
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors">
              <Save className="w-4 h-4" /> 保存草稿
            </button>
          </div>
        </aside>

        {/* ========== Add Source Modal (NotebookLM style) ========== */}
        <AnimatePresence>
          {showAddSource && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-foreground/40"
              onClick={() => setShowAddSource(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-[600px] bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="relative px-8 pt-8 pb-4 text-center">
                  <button
                    onClick={() => setShowAddSource(false)}
                    className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-accent text-muted-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <h2 className="text-xl font-semibold text-foreground">添加知识来源</h2>
                  <p className="text-sm text-primary mt-1">从你的文档中萃取知识</p>
                </div>

                {/* Web search */}
                <div className="px-8 pb-4">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-background">
                    <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                    <input
                      value={webSearchQuery}
                      onChange={(e) => setWebSearchQuery(e.target.value)}
                      placeholder="搜索网络上的新知识来源"
                      className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                    />
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent text-xs text-muted-foreground">
                        <Globe className="w-3 h-3" /> Web
                      </span>
                      <button className="p-1.5 rounded-full bg-muted hover:bg-accent transition-colors">
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Drop zone */}
                <div className="px-8 pb-6">
                  <div className="border-2 border-dashed border-border rounded-xl p-10 text-center hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer">
                    <p className="text-base text-muted-foreground font-medium">或拖放你的文件到这里</p>
                    <p className="text-sm text-muted-foreground/70 mt-1">pdf, images, docs, audio, and more</p>
                  </div>
                </div>

                {/* Source type buttons */}
                <div className="px-8 pb-8 grid grid-cols-4 gap-3">
                  {[
                    { icon: Upload, label: "上传文件", type: "file" as const, name: `文档_${sources.length + 1}.pdf` },
                    { icon: Link2, label: "网页链接", type: "url" as const, name: "https://wiki.company.com" },
                    { icon: HardDrive, label: "云盘", type: "file" as const, name: "云盘文档.pdf" },
                    { icon: ClipboardPaste, label: "粘贴文本", type: "text" as const, name: "粘贴的笔记" },
                  ].map(opt => (
                    <button
                      key={opt.label}
                      onClick={() => addSource(opt.type, opt.name)}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border bg-background text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all"
                    >
                      <opt.icon className="w-4 h-4" />
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Progress bar */}
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

        {/* ========== Preview/Edit Overlay ========== */}
        <AnimatePresence>
          {previewItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex bg-background"
            >
              {/* Preview header */}
              <div className="flex-1 flex flex-col">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => { setPreviewItem(null); setIsEditing(false); }}
                      className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <previewItem.icon className="w-5 h-5 text-primary" />
                    <h2 className="font-semibold text-foreground">{previewItem.label}</h2>
                    <span className="px-2 py-0.5 rounded-md bg-accent text-xs text-muted-foreground">预览</span>
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
                    <button
                      onClick={() => { setPreviewItem(null); setIsEditing(false); }}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" /> 确认发布
                    </button>
                  </div>
                </div>

                {/* Content area */}
                <div className="flex-1 overflow-y-auto p-8">
                  <div className="max-w-3xl mx-auto">
                    {isEditing ? (
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full h-full min-h-[60vh] bg-transparent text-sm text-foreground leading-relaxed outline-none resize-none font-mono"
                      />
                    ) : (
                      <div className="prose prose-sm max-w-none text-foreground">
                        {editContent.split("\n").map((line, i) => {
                          if (line.startsWith("# ")) return <h1 key={i} className="text-xl font-bold text-foreground mt-6 mb-3">{line.slice(2)}</h1>;
                          if (line.startsWith("## ")) return <h2 key={i} className="text-lg font-semibold text-foreground mt-5 mb-2">{line.slice(3)}</h2>;
                          if (line.startsWith("### ")) return <h3 key={i} className="text-base font-medium text-foreground mt-4 mb-1.5">{line.slice(4)}</h3>;
                          if (line.startsWith("- ")) return <li key={i} className="text-sm text-foreground ml-4 mb-1">{line.slice(2)}</li>;
                          if (line.startsWith("  - ")) return <li key={i} className="text-sm text-muted-foreground ml-8 mb-1">{line.slice(4)}</li>;
                          if (line.startsWith("|")) return <p key={i} className="text-sm text-foreground font-mono bg-accent/50 px-2 py-0.5 rounded">{line}</p>;
                          if (line.startsWith("**") && line.endsWith("**")) return <p key={i} className="text-sm font-semibold text-foreground mb-1">{line.replace(/\*\*/g, "")}</p>;
                          if (line.trim() === "") return <br key={i} />;
                          return <p key={i} className="text-sm text-foreground mb-1 leading-relaxed">{line}</p>;
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
};

export default KnowledgeExtract;
